"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Truck, 
  Zap, 
  Store, 
  CheckCircle2, 
  Maximize2 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when product changes
  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    toast({
      title: "Ajouté au panier",
      description: `${quantity} x ${product.name} a été ajouté à votre panier.`,
    });
    onClose();
  };

  const totalPrice = (product.price * quantity).toFixed(2).replace('.', ',');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none sm:rounded-[32px] shadow-2xl flex flex-col h-[100vh] sm:h-[90vh] w-full bg-white">
        {/* Accessibility titles (Hidden from view) */}
        <DialogTitle className="sr-only">
          Détails du produit : {product.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {product.description || `Informations détaillées sur le produit ${product.name} de la marque ${product.brand}.`}
        </DialogDescription>

        <div className="flex flex-col sm:flex-row flex-grow overflow-hidden">
          
          {/* Image Section - Top on mobile, Left on desktop */}
          <div className="w-full sm:w-[45%] bg-slate-50 relative group overflow-hidden shrink-0 aspect-square sm:aspect-auto">
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              className="object-contain p-8 sm:p-12 transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
              onClick={() => window.open(product.image, '_blank')}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4 text-slate-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Agrandir</span>
            </div>
            {product.promo && (
              <div className="absolute top-6 left-6 bg-primary text-white font-black px-4 py-2 rounded-full text-xs shadow-xl z-10 uppercase tracking-widest">
                {product.promo}
              </div>
            )}
            {/* Mobile Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 sm:hidden bg-white/50 backdrop-blur-md rounded-full h-10 w-10 z-30"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Info Section - Scrollable */}
          <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto p-6 sm:p-12 pb-32 sm:pb-32">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{product.brand}</span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight mb-4 uppercase tracking-tighter text-left">
                  {product.name}
                </h2>
                <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed text-left">
                  {product.description || "Formulé sous contrôle dermatologique pour minimiser les risques d'allergies. Sans parabènes, sans colorants artificiels."}
                </p>
              </div>

              {/* Special Offer */}
              {product.offerText && (
                <div className="bg-accent/50 border border-primary/10 rounded-2xl p-4 mb-8">
                  <p className="text-sm font-black text-secondary uppercase tracking-tight mb-1">Offre exclusive</p>
                  <p className="text-sm text-slate-600 font-bold">{product.offerText}</p>
                </div>
              )}

              {/* Price and Quantity */}
              <div className="space-y-6 sm:space-y-8 mb-10 border-b border-slate-100 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
                      {product.price.toFixed(2).replace('.', ',')}€
                    </span>
                    {product.oldPrice && (
                      <span className="text-base sm:text-lg text-destructive font-bold line-through opacity-40">
                        {product.oldPrice.toFixed(2).replace('.', ',')}€
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantité</span>
                    <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white"
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
                        className="h-8 w-8 rounded-full hover:bg-white"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="space-y-4 mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Livraison & Retrait</h4>
                {(product.delivery || [
                  'Livraison à domicile en France',
                  'Retrait gratuit en pharmacie en 2h'
                ]).map((option, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-bold">{option}</span>
                  </div>
                ))}
              </div>

              {/* Long Description */}
              {product.ingredients && (
                <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-medium">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ingrédients principaux</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Sticky Action Bar */}
            <div className="absolute bottom-0 inset-x-0 border-t border-slate-100 bg-white/95 backdrop-blur-xl p-4 sm:p-6 sm:px-12 flex items-center justify-between gap-4 sm:gap-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
              <div className="flex flex-col shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix Total</span>
                <span className="text-xl sm:text-2xl font-black text-secondary tracking-tighter">
                  {totalPrice}€
                </span>
              </div>
              <div className="flex items-center gap-3 grow max-w-md">
                <Button 
                  className="grow rounded-full bg-primary hover:bg-primary/90 text-white font-black h-12 sm:h-14 text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  <span>Ajouter au panier</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="hidden sm:flex rounded-full border-slate-200 font-black h-14 w-14 p-0 uppercase tracking-widest hover:bg-slate-50 transition-all"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
