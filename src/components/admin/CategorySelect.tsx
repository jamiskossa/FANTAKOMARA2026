import React from "react";

interface Category {
  name: string;
  subCategories: {
    name: string;
    products: string[];
  }[];
}

interface CategorySelectProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (value: string) => void;
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
}

export default function CategorySelect({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedProduct,
  setSelectedProduct,
}: CategorySelectProps) {
  const subCategories = categories.find((c) => c.name === selectedCategory)?.subCategories || [];
  const products = subCategories.find((sc) => sc.name === selectedSubCategory)?.products || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold">Catégorie</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubCategory("");
            setSelectedProduct("");
          }}
        >
          <option value="">-- Choisir --</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">Sous-catégorie</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedSubCategory}
          onChange={(e) => {
            setSelectedSubCategory(e.target.value);
            setSelectedProduct("");
          }}
          disabled={!selectedCategory}
        >
          <option value="">-- Choisir --</option>
          {subCategories.map((sc) => (
            <option key={sc.name} value={sc.name}>
              {sc.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">Produit</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          disabled={!selectedSubCategory}
        >
          <option value="">-- Choisir --</option>
          {products.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
