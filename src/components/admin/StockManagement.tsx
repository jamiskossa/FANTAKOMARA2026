"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Percent,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ProductForm from './ProductForm';
import PromotionForm from './PromotionForm';
import KapelForm from './KapelForm';

interface Product {
  id: string | number;
  name: string;
  category: string;
  subCategory: string;
  stockFinal: number;
  threshold: number;
  price: number;
  status: 'available' | 'hidden';
  onPromotion?: boolean;
}

export function StockManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'promo' | 'kapel'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Initial products data - to be replaced by Firestore
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Nettoyants et Démaquillants", category: "Beauté", subCategory: "Visage", stockFinal: 50, threshold: 10, price: 15.99, status: 'available' },
    { id: 2, name: "Gommages", category: "Beauté", subCategory: "Visage", stockFinal: 30, threshold: 5, price: 12.99, status: 'available' },
    { id: 3, name: "Shampooing", category: "Beauté", subCategory: "Cheveux", stockFinal: 4, threshold: 10, price: 10.50, status: 'available' },
  ]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = (id: string | number) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      setProducts(products.filter(p => p.id !== id));
      toast({ title: "Produit supprimé", description: "Le produit a été retiré de l'inventaire." });
    }
  };

  const toggleStatus = (id: string | number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: p.status === 'available' ? 'hidden' : 'available' } : p
    ));
    toast({ title: "Statut mis à jour", description: "La visibilité du produit a été modifiée." });
  };

  const handleAddProduct = (productData: any) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now(),
      name: productData.product, // Mapping field from form
      stockFinal: productData.stock,
      status: 'available'
    };
    setProducts([newProduct, ...products]);
    setActiveTab('list');
    toast({ title: "Produit ajouté", description: "Le nouveau produit est maintenant en stock." });
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-soft border border-slate-100">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant={activeTab === 'list' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('list')}
            className="rounded-full font-black uppercase text-[10px] h-9 px-6"
          >
            Liste Stock
          </Button>
          <Button 
            variant={activeTab === 'add' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('add')}
            className="rounded-full font-black uppercase text-[10px] h-9 px-6"
          >
            <PlusCircle className="w-3 h-3 mr-2" /> Nouveau
          </Button>
          <Button 
            variant={activeTab === 'promo' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('promo')}
            className="rounded-full font-black uppercase text-[10px] h-9 px-6"
          >
            <Percent className="w-3 h-3 mr-2" /> Promo
          </Button>
          <Button 
            variant={activeTab === 'kapel' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('kapel')}
            className="rounded-full font-black uppercase text-[10px] h-9 px-6"
          >
            KAPEL
          </Button>
        </div>
        
        {activeTab === 'list' && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-10 h-9 rounded-full bg-slate-50 text-xs border-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {activeTab === 'list' && (
        <Card className="border-none shadow-soft rounded-[32px] overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="uppercase text-[10px] font-black pl-8">Produit</TableHead>
                <TableHead className="uppercase text-[10px] font-black">Catégorie</TableHead>
                <TableHead className="uppercase text-[10px] font-black">Stock</TableHead>
                <TableHead className="uppercase text-[10px] font-black">Prix</TableHead>
                <TableHead className="uppercase text-[10px] font-black">Visibilité</TableHead>
                <TableHead className="uppercase text-[10px] font-black text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 uppercase text-[10px] font-black text-slate-400">
                    Aucun produit trouvé
                  </TableCell>
                </TableRow>
              ) : filteredProducts.map((p) => {
                const isCritical = p.stockFinal <= p.threshold;
                return (
                  <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8 py-4">
                      <div>
                        <p className="text-xs font-black uppercase text-slate-900">{p.name}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{p.subCategory}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black uppercase">{p.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${isCritical ? 'text-destructive' : 'text-slate-900'}`}>
                          {p.stockFinal}
                        </span>
                        {isCritical && <AlertTriangle className="w-3 h-3 text-destructive" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold">{p.price.toFixed(2)}€</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleStatus(p.id)}
                        className={`h-7 px-2 rounded-lg ${p.status === 'available' ? 'text-green-600' : 'text-slate-400'}`}
                      >
                        {p.status === 'available' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span className="ml-2 text-[9px] font-black uppercase">{p.status === 'available' ? 'En vente' : 'Masqué'}</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteProduct(p.id)} title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === 'add' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProductForm onSubmit={handleAddProduct} />
        </div>
      )}

      {activeTab === 'promo' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PromotionForm products={products.map(p => p.name)} />
        </div>
      )}

      {activeTab === 'kapel' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <KapelForm />
        </div>
      )}
    </div>
  );
}
