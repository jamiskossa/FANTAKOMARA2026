
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Truck, Clock, ShieldCheck } from 'lucide-react';

export default function LivraisonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12">Livraison & Retours</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[32px] shadow-soft text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase text-xs mb-2">Expédition 24h</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Toute la France</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-soft text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mx-auto mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase text-xs mb-2">Retrait 2h</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Click & Collect Gratuit</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-soft text-center">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-secondary mx-auto mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase text-xs mb-2">Suivi réel</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Tracking Colissimo</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
