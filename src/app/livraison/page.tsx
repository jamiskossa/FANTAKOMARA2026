
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function LivraisonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12">Livraison & Retraits</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-black uppercase text-sm mb-4">Click & Collect 2h</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Commandez vos produits de parapharmacie et récupérez-les gratuitement en officine 2 heures plus tard.</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mx-auto mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="font-black uppercase text-sm mb-4">Livraison Domicile</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Expédition sous 24h/48h via Colissimo. Livraison gratuite dès 49€ d'achat en France métropolitaine.</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-soft border border-slate-100">
          <h2 className="text-2xl font-black uppercase text-slate-900 mb-6 flex items-center gap-3">
            <MapPin className="text-primary" /> Notre zone de service
          </h2>
          <p className="text-slate-600 font-medium mb-6">La Pharmacie Nouvelle d'Ivry dessert principalement Ivry-sur-Seine et les communes limitrophes pour les conseils de proximité, mais nous livrons nos produits de parapharmacie dans toute la France.</p>
          <div className="aspect-video w-full rounded-[24px] bg-slate-100 overflow-hidden relative grayscale opacity-60">
             <div className="absolute inset-0 flex items-center justify-center font-black text-slate-400 uppercase tracking-widest">Plan de livraison</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
