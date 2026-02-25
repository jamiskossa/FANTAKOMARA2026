import fs from "fs";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const PROJECT_ID = "fantakomara2026";

async function runTests() {
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: fs.readFileSync("firestore.rules", "utf8") },
  });

  // Contextes utilisateurs
  const clientCtx = testEnv.authenticatedContext("clientUID", { role: "client" });
  const staffCtx  = testEnv.authenticatedContext("staffUID",  { role: "collaborator" });
  const adminCtx  = testEnv.authenticatedContext("adminUID",  { role: "admin" });

  const clientDb = clientCtx.firestore();
  const staffDb  = staffCtx.firestore();
  const adminDb  = adminCtx.firestore();

  // -----------------------------
  // 1️⃣ userProfiles
  // -----------------------------
  console.log("Testing userProfiles...");
  const userProfileRef = doc(clientDb, "userProfiles", "clientUID");

  // Create client profile
  await assertSucceeds(setDoc(userProfileRef, { role: "client", name: "Client Test" }));

  // Read own profile
  await assertSucceeds(getDoc(userProfileRef));

  // Update own profile → should fail (client cannot update)
  await assertFails(updateDoc(userProfileRef, { name: "Hacker Name" }));

  // Staff can read
  const staffProfileRef = doc(staffDb, "userProfiles", "clientUID");
  await assertSucceeds(getDoc(staffProfileRef));

  // Admin can delete
  const adminProfileRef = doc(adminDb, "userProfiles", "clientUID");
  await assertSucceeds(deleteDoc(adminProfileRef));

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

  // Client cannot delete
  await assertFails(deleteDoc(clientReservationRef));

  // Staff can update
  const staffReservationRef = doc(staffDb, "reservations", "res1");
  await assertSucceeds(updateDoc(staffReservationRef, { status: "confirmed" }));

  // Admin can delete
  const adminReservationRef = doc(adminDb, "reservations", "res1");
  await assertSucceeds(deleteDoc(adminReservationRef));

  // -----------------------------
  // 4️⃣ supportMessages
  // -----------------------------
  console.log("Testing supportMessages...");
  const supportRef = doc(clientDb, "supportMessages", "msg1");
  await assertSucceeds(setDoc(supportRef, { clientId: "clientUID", message: "Help!" }));
  await assertFails(deleteDoc(supportRef));
  await assertSucceeds(getDoc(doc(staffDb, "supportMessages", "msg1")));

  // -----------------------------
  // 5️⃣ staffMessages
  // -----------------------------
  console.log("Testing staffMessages...");
  const staffMsgRef = doc(staffDb, "staffMessages", "msg1");
  await assertSucceeds(setDoc(staffMsgRef, { message: "Internal Note" }));
  await assertFails(setDoc(doc(clientDb, "staffMessages", "msg2"), { message: "Hack" }));

  // -----------------------------
  // 6️⃣ contactMessages
  // -----------------------------
  console.log("Testing contactMessages...");
  const contactRef = doc(clientDb, "contactMessages", "contact1");
  await assertSucceeds(setDoc(contactRef, { message: "Hello" }));
  await assertFails(deleteDoc(contactRef));

  // -----------------------------
  // 7️⃣ newsletter
  // -----------------------------
  console.log("Testing newsletter...");
  const newsRef = doc(clientDb, "newsletter", "news1");
  await assertSucceeds(setDoc(newsRef, { email: "test@example.com" }));
  await assertFails(updateDoc(newsRef, { email: "hacker@example.com" }));

  // -----------------------------
  // 8️⃣ pharmacyReviews
  // -----------------------------
  console.log("Testing pharmacyReviews...");
  const reviewRef = doc(clientDb, "pharmacyReviews", "review1");
  await assertSucceeds(setDoc(reviewRef, { rating: 5, clientId: "clientUID" }));
  await assertFails(updateDoc(reviewRef, { rating: 1 }));

  // -----------------------------
  // 9️⃣ collaboratorSessions
  // -----------------------------
  console.log("Testing collaboratorSessions...");
  const collabRef = doc(adminDb, "collaboratorSessions", "session1");
  await assertSucceeds(setDoc(collabRef, { notes: "Session admin" }));
  await assertFails(setDoc(doc(clientDb, "collaboratorSessions", "session2"), { notes: "Hack" }));

  console.log("✅ All tests completed successfully!");
}

runTests().then(() => process.exit(0)).catch((err) => {
  console.error("❌ Test failed", err);
  process.exit(1);
});