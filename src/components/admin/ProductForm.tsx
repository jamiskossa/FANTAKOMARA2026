import React, { useState } from "react";
import CategorySelect from "./CategorySelect";
import { categories } from "@/data/categories";

interface ProductFormProps {
  onSubmit?: (item: any) => void;
}

export default function ProductForm({ onSubmit }: ProductFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [threshold, setThreshold] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      id: Date.now(),
      category: selectedCategory,
      subCategory: selectedSubCategory,
      product: selectedProduct,
      price: Number(price),
      stock: Number(stock),
      threshold: Number(threshold),
      pharmacy: "Nouvelle Divry",
    };
    
    if (onSubmit) {
      onSubmit(productData);
    }
    
    // Reset fields
    setStock("");
    setPrice("");
    setThreshold("");
  };

  return (
    <form
      className="bg-white p-6 rounded shadow-md space-y-4 max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold border-b pb-2">Gestion des produits - Nouvelle Divry</h2>
      
      <CategorySelect
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold">Prix (€)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Stock disponible</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Seuil d'alerte</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded w-full font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors"
      >
        Ajouter au stock
      </button>
    </form>
  );
}
