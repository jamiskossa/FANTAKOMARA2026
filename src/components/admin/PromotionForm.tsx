import React, { useState } from "react";

interface PromotionFormProps {
  products: string[];
}

export default function PromotionForm({ products }: PromotionFormProps) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [published, setPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Promotion ajoutée:", {
      selectedProduct,
      discountPrice,
      description,
      startDate,
      endDate,
      published,
    });
    // Ici: connecter à la base de données / API
  };

  return (
    <form
      className="bg-white p-6 rounded shadow-md space-y-4 max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block font-semibold">Produit</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">-- Choisir --</option>
          {products.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold">Description promotion</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">Prix promotion (€)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold">Date début</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold">Date fin</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publier côté partenaire
        </label>
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded w-full font-bold uppercase tracking-wide hover:bg-green-700 transition-colors"
      >
        Enregistrer la promotion
      </button>
    </form>
  );
}
