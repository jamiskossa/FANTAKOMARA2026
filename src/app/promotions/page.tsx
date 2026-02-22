
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PromotionCarousel } from '@/components/home/PromotionCarousel';
import { ProductGrid } from '@/components/home/ProductGrid';

export default function PromotionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-fluid-gradient border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center bg-destructive/10 text-destructive rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest mb-6">
              Offres limitées
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 text-slate-900 uppercase tracking-tighter">Nos Promotions</h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Profitez des meilleurs prix sur une sélection de produits de dermo-cosmétique et compléments alimentaires.
            </p>
          </div>
        </section>

        <PromotionCarousel />

        <div className="container mx-auto px-4 py-20">
          <ProductGrid title="Toutes les offres" subtitle="Découvrez nos prix barrés du moment" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
