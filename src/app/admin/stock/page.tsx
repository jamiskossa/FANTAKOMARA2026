"use client";

import React, { useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import SaleForm from "@/components/admin/SaleForm";
import PromotionForm from "@/components/admin/PromotionForm";
import KapelForm from "@/components/admin/KapelForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Percent, LayoutDashboard, ShoppingCart, AlertTriangle, CheckCircle2 } from "lucide-react";

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

export default function StockManagementPage() {
  const [activeTab, setActiveTab] = useState<"product" | "sale" | "promotion" | "kapel">("product");
  const [stockItems, setStockItems] = useState<Product[]>([
    {
      id: 1,
      product: "Nettoyants et Démaquillants",
      category: "Beauté",
      subCategory: "Visage",
      stock: 50,
      threshold: 10,
      price: 15.99,
      pharmacy: "Nouvelle Divry",
    },
    {
      id: 2,
      product: "Gommages",
      category: "Beauté",
      subCategory: "Visage",
      stock: 30,
      threshold: 5,
      price: 12.99,
      pharmacy: "Nouvelle Divry",
    }
  ]);

  const handleAddStock = (item: Product) => {
    setStockItems(prev => [...prev, item]);
    setActiveTab("product"); // Stay on product tab or maybe switch to list view
  };

  const handleStockUpdate = (updatedStock: Product[]) => {
    setStockItems(updatedStock);
  };

  const sampleProductNames = stockItems.map(s => s.product);

  return (
    <div className="container mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
          Gestion du Stock - Nouvelle Divry
        </h1>
        <p className="text-slate-500 font-medium">
          Système connecté aux ventes en ligne (Click & Collect) avec alertes de rupture.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setActiveTab("product")}
          className={`p-6 rounded-[24px] flex flex-col items-center gap-4 transition-all duration-300 ${
            activeTab === "product"
              ? "bg-blue-600 text-white shadow-xl scale-105"
              : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
          }`}
        >
          <div className={`p-3 rounded-2xl ${activeTab === "product" ? "bg-white/20" : "bg-blue-50"}`}>
            <Package className={activeTab === "product" ? "text-white" : "text-blue-600"} />
          </div>
          <span className="font-black uppercase text-xs tracking-widest">Ajout Stock</span>
        </button>

        <button
          onClick={() => setActiveTab("sale")}
          className={`p-6 rounded-[24px] flex flex-col items-center gap-4 transition-all duration-300 ${
            activeTab === "sale"
              ? "bg-green-600 text-white shadow-xl scale-105"
              : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
          }`}
        >
          <div className={`p-3 rounded-2xl ${activeTab === "sale" ? "bg-white/20" : "bg-green-50"}`}>
            <ShoppingCart className={activeTab === "sale" ? "text-white" : "text-green-600"} />
          </div>
          <span className="font-black uppercase text-xs tracking-widest">Vente Directe</span>
        </button>

        <button
          onClick={() => setActiveTab("promotion")}
          className={`p-6 rounded-[24px] flex flex-col items-center gap-4 transition-all duration-300 ${
            activeTab === "promotion"
              ? "bg-amber-600 text-white shadow-xl scale-105"
              : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
          }`}
        >
          <div className={`p-3 rounded-2xl ${activeTab === "promotion" ? "bg-white/20" : "bg-amber-50"}`}>
            <Percent className={activeTab === "promotion" ? "text-white" : "text-amber-600"} />
          </div>
          <span className="font-black uppercase text-xs tracking-widest">Promotion</span>
        </button>

        <button
          onClick={() => setActiveTab("kapel")}
          className={`p-6 rounded-[24px] flex flex-col items-center gap-4 transition-all duration-300 ${
            activeTab === "kapel"
              ? "bg-indigo-600 text-white shadow-xl scale-105"
              : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
          }`}
        >
          <div className={`p-3 rounded-2xl ${activeTab === "kapel" ? "bg-white/20" : "bg-indigo-50"}`}>
            <LayoutDashboard className={activeTab === "kapel" ? "text-white" : "text-indigo-600"} />
          </div>
          <span className="font-black uppercase text-xs tracking-widest">KAPEL</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 p-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              {activeTab === "product" && <><Package /> Ajouter au Stock</>}
              {activeTab === "sale" && <><ShoppingCart /> Vente Click & Collect</>}
              {activeTab === "promotion" && <><Percent /> Nouvelle Promotion</>}
              {activeTab === "kapel" && <><LayoutDashboard /> Configurer KAPEL</>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {activeTab === "product" && <ProductForm onSubmit={handleAddStock} />}
            {activeTab === "sale" && <SaleForm stockItems={stockItems} onStockUpdate={handleStockUpdate} />}
            {activeTab === "promotion" && <PromotionForm products={sampleProductNames} />}
            {activeTab === "kapel" && <KapelForm />}
          </CardContent>
        </Card>

        {/* Real-time Inventory Section */}
        <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-100 p-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center justify-between">
              Stock Actuel
              <Badge variant="outline" className="text-[10px] uppercase font-black px-4 py-1">
                {stockItems.length} Produits
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="uppercase text-[10px] font-black pl-8">Produit</TableHead>
                  <TableHead className="uppercase text-[10px] font-black">Stock</TableHead>
                  <TableHead className="uppercase text-[10px] font-black">Seuil</TableHead>
                  <TableHead className="uppercase text-[10px] font-black pr-8 text-right">Etat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase text-xs">
                      Aucun produit en stock
                    </TableCell>
                  </TableRow>
                ) : stockItems.map((item) => {
                  const isCritical = item.stock <= item.threshold;
                  return (
                    <TableRow key={item.id} className={`hover:bg-slate-50 transition-colors ${isCritical ? 'bg-red-50/50' : ''}`}>
                      <TableCell className="pl-8 py-6">
                        <div>
                          <p className="text-xs font-black uppercase text-slate-900">{item.product}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{item.category} &gt; {item.subCategory}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-black ${isCritical ? 'text-red-600' : 'text-slate-900'}`}>
                          {item.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-slate-400">{item.threshold}</span>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        {isCritical ? (
                          <Badge className="bg-red-600 text-white border-none shadow-none text-[8px] uppercase font-black px-2 py-0.5 inline-flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" /> Seuil atteint
                          </Badge>
                        ) : (
                          <Badge className="bg-green-600 text-white border-none shadow-none text-[8px] uppercase font-black px-2 py-0.5 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> OK
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="text-center pb-12">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
          Pharmacie Nouvelle d'Ivry - Gestion Pro 2026
        </p>
      </div>
    </div>
  );
}
