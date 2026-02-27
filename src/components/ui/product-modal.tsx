
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Minus, 
  Plus, 
  ShoppingCart, 
  CheckCircle2, 
  Maximize2,
  ShieldAlert
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/components/providers/CartProvider';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  promo?: string;
  offerText?: string;
  description?: string;
  ingredients?: string[];
  delivery?: string[];
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { toast } = useToast();
  const { addItem } = useCart();
  const { user } = useUser();
  const db = useFirestore();
  const [quantity, setQuantity] = useState(1);

  const userProfileRef = React.useMemo(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);
  const role = profile?.role || 'guest';
  const canAddToCart = role === 'client' || role === 'guest';

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
    
    toast({
      title: "Réservation ajoutée",
      description: `${quantity} x ${product.name} a été ajouté à votre réservation.`,
    });
    onClose();
  };

  const totalPrice = (product.price * quantity).toFixed(2).replace('.', ',');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none sm:rounded-[48px] shadow-2xl flex flex-col h-[100vh] sm:h-[90vh] w-full bg-white outline-none">
        <DialogTitle className="sr-only">
          {product.brand} - {product.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {product.description || `Détails du produit ${product.name}`}
        </DialogDescription>

        <div className="flex flex-col sm:flex-row flex-grow overflow-hidden">
          
          <div className="w-full sm:w-[45%] bg-slate-50 relative group overflow-hidden shrink-0 aspect-square sm:aspect-auto">
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              className="object-contain p-8 sm:p-16 transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
              onClick={() => window.open(product.image, '_blank')}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg">
              <Maximize2 className="w-4 h-4 text-slate-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Agrandir l'image</span>
            </div>
            {product.promo && (
              <div className="absolute top-8 left-8 bg-destructive text-white font-black px-5 py-2.5 rounded-full text-xs shadow-2xl z-10 uppercase tracking-widest">
                {product.promo}
              </div>
            )}
          </div>

          <div className="flex-grow flex flex-col overflow-hidden relative">
            <div className="flex-grow overflow-y-auto p-8 sm:p-16 pb-32 sm:pb-40">
              <div className="mb-4">
                <span className="text-xs font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-4 py-1.5 rounded-full">{product.brand}</span>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight mb-6 uppercase tracking-tighter">
                  {product.name}
                </h2>
                <p className="text-slate-500 font-medium text-base sm:text-lg leading-relaxed mb-4">
                  {product.description || "Une formule experte sélectionnée par nos pharmaciens pour sa haute tolérance et son efficacité prouvée. Sans paraben, respecte le pH physiologique."}
                </p>
                <p className="text-red-600 font-bold text-sm bg-red-50 p-4 rounded-2xl border border-red-100">
                  ⚠️ Ce médicament peut ne pas être adapté à votre situation. Un pharmacien analysera votre réservation avant validation.
                </p>
              </div>

              {product.offerText && (
                <div className="bg-accent/50 border border-primary/10 rounded-3xl p-6 mb-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2 relative z-10">Offre exclusive Ivry</p>
                  <p className="text-lg text-slate-700 font-black tracking-tight relative z-10">{product.offerText}</p>
                </div>
              )}

              <div className="space-y-8 mb-12 border-b border-slate-100 pb-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">
                      {product.price.toFixed(2).replace('.', ',')}€
                    </span>
                    {product.oldPrice && (
                      <span className="text-xl sm:text-2xl text-destructive font-black line-through opacity-30">
                        {product.oldPrice.toFixed(2).replace('.', ',')}€
                      </span>
                    )}
                  </div>

                  {canAddToCart && (
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantité</span>
                      <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 p-1.5 shadow-inner">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-full hover:bg-white text-slate-400"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <input 
                          type="number" 
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 text-center bg-transparent border-none focus:ring-0 font-black text-lg"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-full hover:bg-white text-slate-400"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Disponibilité</h4>
                  {(product.delivery || [
                    'Retrait Express en 2h',
                    'Livraison Domicile 24/48h'
                  ]).map((option, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm font-black uppercase tracking-tight">{option}</span>
                    </div>
                  ))}
                </div>
                
                {product.ingredients && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actifs Clés</h4>
                    <ul className="space-y-2">
                      {product.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 border-t border-slate-100 bg-white/95 backdrop-blur-xl p-6 sm:p-10 sm:px-16 flex items-center justify-between gap-6 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)] z-50">
              <div className="flex flex-col shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total TTC</span>
                <span className="text-2xl sm:text-4xl font-black text-secondary tracking-tighter">
                  {totalPrice}€
                </span>
              </div>
              <div className="flex items-center gap-4 grow max-w-lg">
                {canAddToCart ? (
                  <Button 
                    className="grow rounded-full bg-primary hover:bg-primary/90 text-white font-black h-14 sm:h-16 text-sm sm:text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all active:scale-95"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4" />
                    <span>Réserver en pharmacie</span>
                  </Button>
                ) : (
                  <div className="grow bg-slate-100 rounded-full px-6 h-14 sm:h-16 flex items-center justify-center gap-3 text-slate-400">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Réservé aux clients</span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="hidden sm:flex rounded-full border-slate-100 font-black h-16 w-16 p-0 uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-300"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
