"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ShoppingCart, Star, ChevronRight, Filter, X } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Product {
  id: string;
  brand: string;
  name: string;
  promo?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
}

const initialProducts: Product[] = [
  { id: 'nd1', brand: 'LA ROCHE-POSAY', name: 'Coffret Hyalu B5 Sérum Suractivé + Eau Micellaire', promo: '2 POUR 64,99€', price: 34.99, rating: 5, image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "" },
  { id: 'nd2', brand: 'CONDENSÉ PARIS', name: 'Baume "Miel" Nettoyant Démaquillant', promo: '-5,50€ RÉDUCTION', price: 21.99, oldPrice: 27.49, rating: 4, image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "" },
  { id: 'nd3', brand: 'CONDENSÉ PARIS', name: 'Crème Mousse Nettoyante - 100ml', promo: '-5,10€ RÉDUCTION', price: 20.39, oldPrice: 25.49, rating: 5, image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "" },
  { id: 'nd4', brand: 'CONDENSÉ PARIS', name: 'Lotion Douceur Eclat - 200ml', promo: '-5,00€ RÉDUCTION', price: 19.99, oldPrice: 24.99, rating: 4, image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "" },
  { id: 'nd5', brand: 'NUXE', name: 'Coffret Noël Rose A l\'Infini', promo: '-2,50€ RÉDUCTION', price: 22.49, oldPrice: 24.99, rating: 5, image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "" },
  { id: 'nd6', brand: 'NOREVA', name: 'Global X-Pro Soin Global Intensif 30ml', promo: '-5,00€ RÉDUCTION', price: 19.99, oldPrice: 24.99, rating: 4, image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "" },
  { id: 'nd7', brand: 'ALGOLOGIE', name: 'Gomme Marine - Crème Gommante', promo: '-4,98€ RÉDUCTION', price: 19.92, oldPrice: 24.90, rating: 5, image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "" },
  { id: 'nd8', brand: 'NOREVA', name: 'Actipur - DUO Gel Nettoyant - 2x400ml', promo: '-4,80€ RÉDUCTION', price: 19.19, oldPrice: 23.99, rating: 4, image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "" },
];

export default function NettoyantsDemaquillantsPage() {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('pertinence');

  return (
    <div className="min-h-screen flex flex-col bg-fluid-gradient">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/categorie/beaute" className="hover:text-primary transition-colors">Beauté</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/categorie/beaute/visage" className="hover:text-primary transition-colors">Visage</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-bold text-slate-900">Nettoyants et Démaquillants</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres */}
          <aside className="lg:w-64 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtrer par
                </h2>
              </div>

              {/* Filtre Marque */}
              <div className="space-y-4 mb-8">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400">Marque</label>
                <Select defaultValue="toutes">
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Toutes les marques" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les marques</SelectItem>
                    <SelectItem value="la-roche-posay">LA ROCHE-POSAY</SelectItem>
                    <SelectItem value="condense-paris">CONDENSÉ PARIS</SelectItem>
                    <SelectItem value="nuxe">NUXE</SelectItem>
                    <SelectItem value="noreva">NOREVA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre Prix */}
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400">Prix</label>
                  <span className="text-sm font-bold text-primary">{priceRange[0]}€ – {priceRange[1]}€</span>
                </div>
                <Slider 
                  defaultValue={[0, 100]} 
                  max={100} 
                  step={1} 
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full rounded-full border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
                onClick={() => setPriceRange([0, 100])}
              >
                <X className="w-4 h-4 mr-2" />
                Effacer les filtres
              </Button>
            </div>

            {/* Promo Banner Sidebar */}
            <div className="bg-secondary rounded-3xl p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="font-black text-xl mb-2">Offre Duo</h4>
                <p className="text-white/80 text-sm mb-4">Économisez sur vos nettoyants préférés.</p>
                <Button variant="secondary" size="sm" className="rounded-full font-bold">Voir l'offre</Button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </aside>

          {/* Liste Produits */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1 uppercase tracking-tight">Nettoyants et Démaquillants</h1>
                <p className="text-slate-500 font-medium">607 produits trouvés</p>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Trier par :</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] border-none shadow-none focus:ring-0 font-bold text-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pertinence">Pertinence</SelectItem>
                    <SelectItem value="prix-croissant">Prix croissant</SelectItem>
                    <SelectItem value="prix-decroissant">Prix décroissant</SelectItem>
                    <SelectItem value="nouveautes">Nouveautés</SelectItem>
                    <SelectItem value="meilleures-ventes">Meilleures ventes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {initialProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden border-none shadow-none hover:shadow-2xl transition-all duration-500 rounded-3xl p-2 bg-white flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-2xl">
                    <Image 
                      src={product.image || "https://picsum.photos/seed/placeholder/600/600"} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      data-ai-hint="pharmacy skincare product"
                    />
                    {product.promo && (
                      <Badge className="absolute top-4 left-4 bg-primary text-white font-black px-3 py-1 rounded-full text-[10px] shadow-sm">
                        {product.promo}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="pt-6 px-3 flex-grow">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] mb-3 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-slate-900">
                        {product.price.toFixed(2).replace('.', ',')}€
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-destructive font-medium line-through">
                          {product.oldPrice.toFixed(2).replace('.', ',')}€
                        </span>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-3 pt-0">
                    <Button className="w-full rounded-full bg-slate-900 hover:bg-primary text-white font-bold h-11 transition-all shadow-md group-hover:translate-y-[-2px]">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex items-center justify-center gap-4">
              <Button variant="outline" className="rounded-full px-6 font-bold text-slate-600" disabled>Précédent</Button>
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</span>
                <span className="text-slate-400 font-bold">sur 31</span>
              </div>
              <Button variant="outline" className="rounded-full px-6 font-bold text-primary border-primary">Suivant</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
