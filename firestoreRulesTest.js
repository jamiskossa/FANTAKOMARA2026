import fs from "fs";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";

const PROJECT_ID = "fantakomara2026";

async function runTests() {
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { 
      host: "127.0.0.1",
      port: 8080,
      rules: fs.readFileSync("firestore.rules", "utf8") 
    },
  });

  // Contextes utilisateurs
  const clientCtx = testEnv.authenticatedContext("clientUID");
  const staffCtx  = testEnv.authenticatedContext("staffUID");
  const adminCtx  = testEnv.authenticatedContext("adminUID");

  const clientDb = clientCtx.firestore();
  const staffDb  = staffCtx.firestore();
  const adminDb  = adminCtx.firestore();

  // Setup actual user profiles in the emulator (using admin context to bypass rules if needed, 
  // but we'll use unauthenticated or direct if possible. Actually with rules-unit-testing, 
  // we can use withSecurityRulesDisabled)
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "userProfiles", "clientUID"), { role: "client", email: "client@test.com" });
    await setDoc(doc(db, "userProfiles", "staffUID"), { role: "collaborator", email: "staff@test.com" });
    await setDoc(doc(db, "userProfiles", "adminUID"), { role: "admin", email: "admin@test.com" });
  });

  // -----------------------------
  // 1️⃣ userProfiles
  // -----------------------------
  console.log("Testing userProfiles...");
  const userProfileRef = doc(clientDb, "userProfiles", "clientUID");

  // Read own profile
  await assertSucceeds(getDoc(userProfileRef));

  // Client cannot read other's profile
  await assertFails(getDoc(doc(clientDb, "userProfiles", "staffUID")));

  // Staff can read client profile
  await assertSucceeds(getDoc(doc(staffDb, "userProfiles", "clientUID")));

  // -----------------------------
  // 2️⃣ products
  // -----------------------------
  console.log("Testing products...");
  const productRef = doc(staffDb, "products", "prod1");
  await assertSucceeds(setDoc(productRef, { name: "Produit Test", price: 10 }));
  await assertFails(setDoc(doc(clientDb, "products", "prod2"), { name: "Hacker Product", price: 1 }));

  // -----------------------------
  // 3️⃣ reservations
  // -----------------------------
  console.log("Testing reservations...");
  const clientReservationRef = doc(clientDb, "reservations", "res1");
  await assertSucceeds(setDoc(clientReservationRef, { clientId: "clientUID", status: "pending" }));

  // Client can list own reservations
  const clientQuery = query(collection(clientDb, "reservations"), where("clientId", "==", "clientUID"));
  await assertSucceeds(getDocs(clientQuery));

  // Client CANNOT list all reservations
  await assertFails(getDocs(collection(clientDb, "reservations")));

  // Staff can list all
  await assertSucceeds(getDocs(collection(staffDb, "reservations")));

  // -----------------------------
  // 4️⃣ supportMessages
  // -----------------------------
  console.log("Testing supportMessages...");
  const supportRef = doc(clientDb, "supportMessages", "msg1");
  await assertSucceeds(setDoc(supportRef, { clientId: "clientUID", message: "Help!" }));
  
  // Client can list own
  const supportQuery = query(collection(clientDb, "supportMessages"), where("clientId", "==", "clientUID"));
  await assertSucceeds(getDocs(supportQuery));

  // Client cannot list all
  await assertFails(getDocs(collection(clientDb, "supportMessages")));

  // Staff can list all
  await assertSucceeds(getDocs(collection(staffDb, "supportMessages")));

  // -----------------------------
  // 5️⃣ pharmacyReviews
  // -----------------------------
  console.log("Testing pharmacyReviews...");
  const reviewRef = doc(clientDb, "pharmacyReviews", "review1");
  await assertSucceeds(setDoc(reviewRef, { rating: 5, clientId: "clientUID" }));
  
  // Owner can update
  await assertSucceeds(updateDoc(reviewRef, { rating: 4 }));

  // Other cannot update
  const staffReviewRef = doc(staffDb, "pharmacyReviews", "review1");
  await assertFails(updateDoc(staffReviewRef, { rating: 1 }));

  console.log("✅ All tests completed successfully!");
}

runTests().then(() => process.exit(0)).catch((err) => {
  console.error("❌ Test failed", err);
  process.exit(1);
});
