
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BrandBanner } from '@/components/home/BrandBanner';
import Image from 'next/image';

export default function MarquesPage() {
  const allBrands = [
    'A-Derma', 'Avène', 'Bioderma', 'Caudalie', 'Cerave', 'Eucerin', 'Filorga', 
    'Garancia', 'La Roche-Posay', 'Nuxe', 'SVR', 'Uriage', 'Vichy', 'Weleda'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow">
        <section className="py-24 bg-fluid-gradient border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 text-slate-900 uppercase tracking-tighter">Nos Marques</h1>
            <p className="text-xl text-slate-600 font-medium">
              Découvrez l'ensemble des laboratoires et marques de confiance sélectionnés par nos pharmaciens pour votre santé et votre beauté.
            </p>
          </div>
        </section>
        
        <BrandBanner />
        
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
               {allBrands.map(name => (
                 <div key={name} className="bg-white p-10 border-2 border-slate-100 rounded-[32px] flex flex-col items-center justify-center gap-6 hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group">
                   <div className="relative w-full aspect-[2/1] transition-all duration-700">
                      <Image 
                        src={`https://picsum.photos/seed/${name}/400/200`}
                        alt={name}
                        fill
                        className="object-contain"
                        data-ai-hint="brand logo"
                      />
                   </div>
                   <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-600 group-hover:text-primary transition-colors">
                     {name}
                   </span>
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
