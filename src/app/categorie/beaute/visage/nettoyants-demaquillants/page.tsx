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
import { 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  Filter, 
  X
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductModal, type Product } from '@/components/ui/product-modal';

const initialProducts: Product[] = [
  { 
    id: 'nd1', 
    brand: 'LA ROCHE-POSAY', 
    name: 'Coffret Hyalu B5 Sérum Suractivé + Sérum Vitamin C12 10ml offert + Eau Micellaire 50ml offerte', 
    promo: '2 POUR 64,99€', 
    price: 34.99, 
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    offerText: '2 achetés = 64.99€ soit 7% de réduction',
    delivery: [
      'Livraison à domicile en France',
      'Livraison express en 2h sur Paris',
      'Retrait gratuit en pharmacie en 2h'
    ],
    description: 'Le coffret Hyalu B5 de La Roche-Posay est un rituel anti-rides complet pour réparer et repulper la peau.',
    ingredients: ['Acide hyaluronique pur', 'Vitamine B5', 'Madécassoside']
  },
  { 
    id: 'nd2', 
    brand: 'CONDENSÉ PARIS', 
    name: 'Baume "Miel" Nettoyant Démaquillant', 
    promo: '-5,50€ RÉDUCTION', 
    price: 21.99, 
    oldPrice: 27.49, 
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    description: 'Une texture baume fondante qui se transforme en huile puis en lait au contact de l\'eau.',
    delivery: ['Livraison à domicile', 'Retrait gratuit en 2h']
  },
  { 
    id: 'nd3', 
    brand: 'CONDENSÉ PARIS', 
    name: 'Crème Mousse Nettoyante - 100ml', 
    promo: '-5,10€ RÉDUCTION', 
    price: 20.39, 
    oldPrice: 25.49, 
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    description: 'Une mousse onctueuse pour un nettoyage en profondeur tout en respectant l\'équilibre cutané.'
  },
  { 
    id: 'nd4', 
    brand: 'NUXE', 
    name: 'Coffret Noël Rose A l\'Infini', 
    promo: '-2,50€ RÉDUCTION', 
    price: 22.49, 
    oldPrice: 24.99, 
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    description: 'Un coffret sensoriel à la rose pour un moment de bien-être absolu.'
  },
];

export default function NettoyantsDemaquillantsPage() {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('pertinence');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-fluid-gradient">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/categorie/beaute" className="hover:text-primary transition-colors">Beauté</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/categorie/beaute/visage" className="hover:text-primary transition-colors">Visage</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-bold text-slate-900 uppercase tracking-tighter">Nettoyants et Démaquillants</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 lg:sticky lg:top-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-secondary flex items-center uppercase tracking-tight">
                  <Filter className="w-5 h-5 mr-3 text-primary" />
                  Filtrer par
                </h2>
              </div>

              <div className="space-y-4 mb-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Marque</label>
                <Select defaultValue="toutes">
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-primary">
                    <SelectValue placeholder="Toutes les marques" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les marques</SelectItem>
                    <SelectItem value="la-roche-posay">LA ROCHE-POSAY</SelectItem>
                    <SelectItem value="condense-paris">CONDENSÉ PARIS</SelectItem>
                    <SelectItem value="nuxe">NUXE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</label>
                  <span className="text-xs font-black text-primary">{priceRange[0]}€ – {priceRange[1]}€</span>
                </div>
                <Slider 
                  defaultValue={[0, 100]} 
                  max={100} 
                  step={1} 
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full rounded-full border-primary/30 text-primary font-black text-xs h-12 uppercase tracking-widest hover:bg-primary hover:text-white"
                onClick={() => setPriceRange([0, 100])}
              >
                <X className="w-4 h-4 mr-2" />
                Effacer les filtres
              </Button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Nettoyants et Démaquillants</h1>
                <p className="text-slate-400 font-bold text-sm tracking-wide">607 produits trouvés</p>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-1 rounded-2xl shadow-sm border border-slate-100 self-start md:self-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 hidden sm:inline">Trier par :</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] border-none shadow-none focus:ring-0 font-black text-secondary uppercase text-xs h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pertinence">Pertinence</SelectItem>
                    <SelectItem value="prix-croissant">Prix croissant</SelectItem>
                    <SelectItem value="prix-decroissant">Prix décroissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {initialProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer overflow-hidden border-none shadow-none hover:shadow-2xl transition-all duration-500 rounded-3xl p-2 bg-white flex flex-col hover:scale-[1.02] hover:-translate-y-2"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 rounded-2xl">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.promo && (
                      <Badge className="absolute top-4 left-4 bg-primary text-white font-black px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest">
                        {product.promo}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="pt-6 px-3 flex-grow">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1.5 opacity-70">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-3 min-h-[3rem] mb-4 group-hover:text-primary leading-tight">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        {product.price.toFixed(2).replace('.', ',')}€
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-destructive font-bold line-through opacity-60">
                          {product.oldPrice.toFixed(2).replace('.', ',')}€
                        </span>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-3 pt-0">
                    <Button className="w-full rounded-full bg-slate-900 hover:bg-primary text-white font-black h-12 uppercase tracking-widest">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <Footer />
    </div>
  );
}
