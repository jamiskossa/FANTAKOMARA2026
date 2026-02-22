
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShoppingCart, ArrowLeft, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function PanierPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-soft p-12 text-center bg-white rounded-[32px]">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <ShoppingCart className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Votre panier est vide</h2>
              <p className="text-slate-500 font-medium mb-8">Découvrez nos produits et promotions pour commencer votre shopping.</p>
              <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 px-10">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Continuer mes achats
                </Link>
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-none shadow-soft rounded-[32px] overflow-hidden sticky top-28 bg-white">
              <div className="bg-slate-900 p-6 text-white text-center">
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Résumé de commande</h3>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center text-sm font-bold border-b border-slate-50 pb-4">
                  <span className="text-slate-400 uppercase tracking-widest">Sous-total</span>
                  <span className="text-slate-900">0,00€</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-b border-slate-50 pb-4">
                  <span className="text-slate-400 uppercase tracking-widest">Livraison</span>
                  <span className="text-primary uppercase tracking-widest">Gratuit</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total</span>
                  <span className="text-2xl font-black text-secondary">0,00€</span>
                </div>
                <Button disabled className="w-full rounded-full bg-secondary text-white font-black uppercase tracking-widest h-14 mt-4">
                  Commander
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Paiement 100% sécurisé</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
