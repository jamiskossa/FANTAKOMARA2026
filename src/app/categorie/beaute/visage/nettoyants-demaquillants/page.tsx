
"use client";

import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  Filter, 
  X, 
  Truck, 
  Zap, 
  Store, 
  CheckCircle2,
  Info,
  Plus,
  Minus,
  Maximize2
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  brand: string;
  name: string;
  promo?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  offerDetails?: string;
  deliveryOptions: string[];
  description: string;
  fullDescription?: string;
}

const initialProducts: Product[] = [
  { 
    id: 'nd1', 
    brand: 'LA ROCHE-POSAY', 
    name: 'Coffret Hyalu B5 Sérum Suractivé + Sérum Vitamin C12 10ml offert + Eau Micellaire 50ml offerte', 
    promo: '2 POUR 64,99€', 
    price: 34.99, 
    rating: 5, 
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    offerDetails: '2 achetés = 64.99€ soit 7% de réduction',
    deliveryOptions: [
      'Livraison à domicile en France',
      'Livraison express en 2h sur Paris',
      'Retrait gratuit en pharmacie en 2h'
    ],
    description: 'Le coffret Hyalu B5 de La Roche-Posay est un rituel anti-rides complet pour réparer et repulper la peau.',
    fullDescription: 'Enrichi en acide hyaluronique pur de deux poids moléculaires, en vitamine B5 et en madécassoside, le sérum Hyalu B5 répare la barrière cutanée et repulpe la peau immédiatement. Ce coffret exclusif inclut des miniatures de soins complémentaires pour une routine complète.'
  },
  { 
    id: 'nd2', 
    brand: 'CONDENSÉ PARIS', 
    name: 'Baume "Miel" Nettoyant Démaquillant', 
    promo: '-5,50€ RÉDUCTION', 
    price: 21.99, 
    oldPrice: 27.49, 
    rating: 4, 
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    offerDetails: 'Réduction immédiate de 20% sur ce produit phare.',
    deliveryOptions: [
      'Livraison à domicile en France',
      'Retrait gratuit en pharmacie en 2h'
    ],
    description: 'Une texture baume fondante qui se transforme en huile puis en lait au contact de l\'eau.',
    fullDescription: 'Le Baume Miel démaquille parfaitement le visage et les yeux, même le maquillage waterproof. Sa formule riche en huiles végétales laisse la peau douce, nourrie et sans aucun film gras.'
  },
  { 
    id: 'nd3', 
    brand: 'CONDENSÉ PARIS', 
    name: 'Crème Mousse Nettoyante - 100ml', 
    promo: '-5,10€ RÉDUCTION', 
    price: 20.39, 
    oldPrice: 25.49, 
    rating: 5, 
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    offerDetails: 'Prix spécial sur le format voyage.',
    deliveryOptions: [
      'Livraison à domicile en France',
      'Retrait gratuit en pharmacie en 2h'
    ],
    description: 'Une mousse onctueuse pour un nettoyage en profondeur tout en respectant l\'équilibre cutané.',
    fullDescription: 'Cette crème se transforme en une mousse dense et fine pour éliminer impuretés et excès de sébum. La peau est nette, fraîche et éclatante.'
  },
  { 
    id: 'nd4', 
    brand: 'NUXE', 
    name: 'Coffret Noël Rose A l\'Infini', 
    promo: '-2,50€ RÉDUCTION', 
    price: 22.49, 
    oldPrice: 24.99, 
    rating: 5, 
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    offerDetails: 'Offre limitée pour les fêtes.',
    deliveryOptions: [
      'Livraison à domicile en France',
      'Retrait gratuit en pharmacie en 2h'
    ],
    description: 'Un coffret sensoriel à la rose pour un moment de bien-être absolu.',
    fullDescription: 'Retrouvez toute la douceur de la gamme Very Rose dans ce coffret cadeau comprenant une eau micellaire apaisante et une huile délicate.'
  },
];

export default function NettoyantsDemaquillantsPage() {
  const { toast } = useToast();
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('pertinence');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    toast({
      title: "Ajouté au panier",
      description: `${quantity} x ${selectedProduct.name} a été ajouté à votre panier.`,
    });
    setSelectedProduct(null);
  };

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
          <span className="font-bold text-slate-900 uppercase tracking-tighter">Nettoyants et Démaquillants</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres */}
          <aside className="lg:w-72 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-secondary flex items-center uppercase tracking-tight">
                  <Filter className="w-5 h-5 mr-3 text-primary" />
                  Filtrer par
                </h2>
              </div>

              {/* Filtre Marque */}
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
                    <SelectItem value="noreva">NOREVA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre Prix */}
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
                  className="py-4"
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full rounded-full border-primary/30 text-primary font-black text-xs h-12 uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => setPriceRange([0, 100])}
              >
                <X className="w-4 h-4 mr-2" />
                Effacer les filtres
              </Button>
            </div>
          </aside>

          {/* Liste Produits */}
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
                    <SelectItem value="nouveautes">Nouveautés</SelectItem>
                    <SelectItem value="meilleures-ventes">Meilleures ventes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {initialProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer overflow-hidden border-none shadow-none hover:shadow-2xl transition-all duration-500 rounded-3xl p-2 bg-white flex flex-col hover:scale-[1.02] hover:-translate-y-2"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 rounded-2xl">
                    <Image 
                      src={product.image || "https://picsum.photos/seed/placeholder/600/600"} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      data-ai-hint="pharmacy skincare product"
                    />
                    {product.promo && (
                      <Badge className="absolute top-4 left-4 bg-primary text-white font-black px-3 py-1.5 rounded-full text-[9px] shadow-lg border-none uppercase tracking-widest">
                        {product.promo}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="pt-6 px-3 flex-grow">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1.5 opacity-70">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-3 min-h-[3rem] mb-4 group-hover:text-primary transition-colors leading-tight">
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
                    <Button 
                      className="w-full rounded-full bg-slate-900 hover:bg-primary text-white font-black h-12 transition-all shadow-md group-hover:shadow-primary/20 text-xs uppercase tracking-widest"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex items-center justify-center gap-6">
              <Button variant="outline" className="rounded-full px-8 h-12 font-black text-xs uppercase tracking-widest text-slate-400 border-slate-100" disabled>Précédent</Button>
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-primary/20">1</span>
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">sur 31</span>
              </div>
              <Button variant="outline" className="rounded-full px-8 h-12 font-black text-xs uppercase tracking-widest text-primary border-primary/20 hover:bg-primary hover:text-white transition-all">Suivant</Button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL PRODUIT EXPERT AMÉLIORÉE */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[32px] shadow-2xl flex flex-col h-[90vh]">
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
              {/* Image Section with Zoom */}
              <div className="md:w-[45%] bg-slate-100 relative group overflow-hidden shrink-0">
                <Image 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-slate-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Survolez pour zoomer</span>
                </div>
                {selectedProduct.promo && (
                  <div className="absolute top-6 left-6 bg-primary text-white font-black px-4 py-2 rounded-full text-xs shadow-xl z-10 uppercase tracking-widest">
                    {selectedProduct.promo}
                  </div>
                )}
              </div>

              {/* Info Section with Scroll */}
              <div className="flex-grow flex flex-col overflow-hidden bg-white">
                <div className="flex-grow overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{selectedProduct.brand}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <DialogHeader className="mb-8">
                    <DialogTitle className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4 uppercase tracking-tighter">
                      {selectedProduct.name}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium text-base leading-relaxed">
                      {selectedProduct.fullDescription || selectedProduct.description}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Offre Spéciale */}
                  {selectedProduct.offerDetails && (
                    <div className="bg-accent/50 border border-primary/10 rounded-2xl p-4 mb-8 flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-black text-secondary uppercase tracking-tight mb-1">Offre exclusive</p>
                        <p className="text-sm text-slate-600 font-bold">{selectedProduct.offerDetails}</p>
                      </div>
                    </div>
                  )}

                  {/* Prix et Quantité Section */}
                  <div className="space-y-8 mb-10 border-b border-slate-100 pb-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">
                          {selectedProduct.price.toFixed(2).replace('.', ',')}€
                        </span>
                        {selectedProduct.oldPrice && (
                          <span className="text-lg text-destructive font-bold line-through opacity-40">
                            {selectedProduct.oldPrice.toFixed(2).replace('.', ',')}€
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantité</span>
                        <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 p-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-10 text-center bg-transparent border-none focus:ring-0 font-black text-sm"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Livraison & Services */}
                  <div className="space-y-4 mb-10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Livraison & Retrait</h4>
                    {selectedProduct.deliveryOptions.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-slate-600">
                        {option.includes('domicile') && <Truck className="w-5 h-5 text-primary" />}
                        {option.includes('express') && <Zap className="w-5 h-5 text-primary" />}
                        {option.includes('pharmac') && <Store className="w-5 h-5 text-primary" />}
                        <span className="text-sm font-bold">{option}</span>
                        <CheckCircle2 className="w-4 h-4 text-primary/40 ml-auto" />
                      </div>
                    ))}
                  </div>

                  {/* Description Détail (Contenu Long) */}
                  <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-medium pb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conseils d'expert</h4>
                    <p>Appliquer matin et/ou soir sur le visage et le cou préalablement nettoyés. Sa texture fondante pénètre instantanément sans laisser de film gras, idéale comme base de maquillage.</p>
                    <p>Formulé sous contrôle dermatologique pour minimiser les risques d'allergies. Sans parabènes, sans colorants artificiels.</p>
                  </div>
                </div>

                {/* Sticky Action Bar */}
                <div className="mt-auto border-t border-slate-100 bg-white/80 backdrop-blur-xl p-6 md:px-12 flex items-center justify-between gap-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix Total</span>
                    <span className="text-2xl font-black text-secondary tracking-tighter">
                      {(selectedProduct.price * quantity).toFixed(2).replace('.', ',')}€
                    </span>
                  </div>
                  <div className="flex items-center gap-3 grow max-w-md">
                    <Button 
                      className="grow rounded-full bg-primary hover:bg-primary/90 text-white font-black h-14 text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      Ajouter au panier
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-full border-slate-200 font-black h-14 w-14 p-0 uppercase tracking-widest hover:bg-slate-50 transition-all"
                      onClick={() => setSelectedProduct(null)}
                      title="Fermer"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
