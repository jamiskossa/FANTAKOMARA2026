
"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShoppingCart, ArrowLeft, Trash2, ChevronRight, Plus, Minus, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/providers/CartProvider';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function PanierPage() {
  const { items, removeItem, updateQuantity, totalPrice, itemCount, clearCart } = useCart();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour finaliser votre réservation.",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const reservationData = {
        clientId: user.uid,
        status: 'pending',
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          brand: i.brand,
          price: i.price,
          quantity: i.quantity
        })),
        totalPrice: totalPrice,
        deliveryOption: 'click-and-collect',
        createdAt: new Date().toISOString(), // Standard format for query sorting
      };

      await addDoc(collection(db, 'reservations'), reservationData);
      
      setIsSuccess(true);
      clearCart();
      toast({
        title: "Réservation confirmée !",
        description: "Votre commande est en attente de préparation par nos pharmaciens.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la réservation. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-xl w-full border-none shadow-2xl rounded-[48px] overflow-hidden bg-white text-center p-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Merci pour votre confiance !</h1>
            <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed">
              Votre réservation a bien été reçue. Nous vous informerons par SMS et e-mail dès qu'elle sera prête à être retirée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 px-10">
                <Link href="/client/dashboard">Suivre ma commande</Link>
              </Button>
              <Button variant="outline" asChild className="rounded-full border-slate-100 text-slate-400 font-black uppercase tracking-widest h-14 px-10">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter">Mon Panier</h1>
          <Badge className="bg-primary text-white font-black text-sm px-4 py-1.5 rounded-full">{itemCount} articles</Badge>
        </div>

        {items.length === 0 ? (
          <Card className="border-none shadow-soft p-12 lg:p-24 text-center bg-white rounded-[48px]">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
              <ShoppingCart className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Votre panier est vide</h2>
            <p className="text-slate-500 font-medium mb-12 text-lg">Découvrez nos produits et promotions pour commencer votre shopping santé.</p>
            <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-16 px-12 text-lg shadow-xl shadow-primary/20">
              <Link href="/">
                <ArrowLeft className="mr-2 h-6 w-6" />
                Continuer mes achats
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card key={item.id} className="border-none shadow-soft rounded-[32px] overflow-hidden bg-white group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform" />
                      </div>
                      
                      <div className="flex-grow space-y-2 text-center sm:text-left">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.brand}</p>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">{item.name}</h3>
                        <p className="text-xl font-black text-secondary tracking-tighter">{item.price.toFixed(2).replace('.', ',')}€</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center bg-slate-50 rounded-full p-1 border border-slate-100 shadow-inner">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-full hover:bg-white text-slate-400"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-black text-lg">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-full hover:bg-white text-slate-400"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-300 hover:text-destructive transition-colors"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="link" asChild className="text-slate-400 font-black uppercase text-xs tracking-widest mt-4">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continuer mes achats
                </Link>
              </Button>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden sticky top-28 bg-white">
                <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] relative z-10">Résumé de réservation</h3>
                </div>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">Articles ({itemCount})</span>
                      <span className="text-slate-900">{totalPrice.toFixed(2).replace('.', ',')}€</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">Préparation Express</span>
                      <span className="text-primary uppercase tracking-widest">Gratuit</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-black text-slate-900 uppercase tracking-tight">Total TTC</span>
                      <span className="text-4xl font-black text-secondary tracking-tighter">{totalPrice.toFixed(2).replace('.', ',')}€</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 items-start">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                      Réservation sécurisée. Le paiement s'effectue lors du retrait en pharmacie après vérification par nos pharmaciens.
                    </p>
                  </div>

                  <Button 
                    disabled={isSubmitting}
                    onClick={handleCheckout}
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-16 text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                      <>
                        Confirmer la réservation
                        <ChevronRight className="ml-2 h-6 w-6" />
                      </>
                    )}
                  </Button>
                  
                  <div className="flex justify-center gap-4 opacity-30 grayscale">
                    <div className="w-8 h-5 bg-slate-400 rounded" />
                    <div className="w-8 h-5 bg-slate-400 rounded" />
                    <div className="w-8 h-5 bg-slate-400 rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
