"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BrandBanner } from '@/components/home/BrandBanner';

export default function MarquesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-fluid-gradient">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-slate-900 tracking-tight">Nos Marques</h1>
            <p className="text-xl text-slate-600">Découvrez l'ensemble des laboratoires et marques de confiance sélectionnés par nos pharmaciens.</p>
          </div>
        </section>
        
        <BrandBanner />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {['A-Derma', 'Avène', 'Bioderma', 'Caudalie', 'Cerave', 'Eucerin', 'Filorga', 'Garancia', 'La Roche-Posay', 'Nuxe', 'SVR', 'Uriage', 'Vichy', 'Weleda'].map(name => (
                 <div key={name} className="p-8 border rounded-2xl flex items-center justify-center font-bold text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                   {name}
                 </div>
               ))}
             </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
