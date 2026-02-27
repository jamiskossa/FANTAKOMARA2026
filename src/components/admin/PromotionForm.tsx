import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

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
  const [manualOverride, setManualOverride] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Promotion ajoutée:", {
      selectedProduct,
      discountPrice,
      description,
      startDate,
      endDate,
      published,
      manualOverride
    });
    // Ici: connecter à la base de données / API
  };

  return (
    <form
      className="bg-white p-6 rounded shadow-md space-y-4 max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <h2 className="text-xl font-bold">Gestion des Promotions</h2>
        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <Switch 
            id="manual-mode" 
            checked={manualOverride} 
            onCheckedChange={setManualOverride} 
          />
          <Label htmlFor="manual-mode" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">
            Contrôle Manuel
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">Produit ciblé</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
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
              placeholder="ex: -20% sur la gamme Visage"
            />
          </div>
          <div>
            <label className="block font-semibold">Prix promotionnel (€)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border p-2 rounded"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold">Date de début</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Date de fin</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Options de Publication</span>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="publish-partner" className="text-xs font-bold text-slate-600">Visible sur le site</Label>
              <Switch 
                id="publish-partner" 
                checked={published} 
                onCheckedChange={setPublished}
                disabled={!manualOverride}
              />
            </div>
            {!manualOverride && (
              <p className="text-[9px] text-amber-600 font-medium italic">
                * La publication automatique est active. Activez le contrôle manuel pour modifier.
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white p-3 rounded-xl w-full font-bold uppercase tracking-wide hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
      >
        Enregistrer la promotion
      </button>
    </form>
  );
}
