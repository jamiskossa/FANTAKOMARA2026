import React, { useState } from "react";

interface Product {
  id: number;
  product: string;
  category: string;
  subCategory: string;
  stock: number;
  threshold: number;
  price: number;
  pharmacy: string;
}

interface SaleFormProps {
  stockItems: Product[];
  onStockUpdate: (updatedStock: Product[]) => void;
}

export default function SaleForm({ stockItems, onStockUpdate }: SaleFormProps) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSale = (e: React.FormEvent) => {
    e.preventDefault();
    const productIndex = stockItems.findIndex((p) => p.id === Number(selectedProductId));
    
    if (productIndex === -1) return alert("Produit non trouvé");
    if (quantity > stockItems[productIndex].stock) return alert("Stock insuffisant");

    const updatedStock = [...stockItems];
    updatedStock[productIndex] = {
      ...updatedStock[productIndex],
      stock: updatedStock[productIndex].stock - quantity
    };

    // Alert if stock is below threshold
    if (updatedStock[productIndex].stock <= updatedStock[productIndex].threshold) {
      alert(`⚠️ Seuil atteint pour ${updatedStock[productIndex].product}`);
    }

    onStockUpdate(updatedStock);
    setQuantity(1);
    setSelectedProductId("");
  };

  return (
    <form onSubmit={handleSale} className="p-6 bg-white rounded shadow-md space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold border-b pb-2">Vente en ligne - Click & Collect</h2>

      <div>
        <label className="block font-semibold">Produit</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          required
        >
          <option value="">-- Sélectionner --</option>
          {stockItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.product} (Stock: {item.stock})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">Quantité</label>
        <input
          type="number"
          min="1"
          className="w-full border p-2 rounded"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded w-full font-bold uppercase tracking-wide hover:bg-green-700 transition-colors"
      >
        Valider la vente
      </button>
    </form>
  );
}
