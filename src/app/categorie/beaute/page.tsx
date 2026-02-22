"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/home/ProductGrid';
import { VisualCategories } from '@/components/home/VisualCategories';

export default function BeautePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-fluid-gradient">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-slate-900 tracking-tight">Beauté & Dermo-cosmétique</h1>
            <p className="text-xl text-slate-600">Retrouvez les plus grandes marques au meilleur prix pour vos soins du visage, du corps et des cheveux.</p>
          </div>
        </section>
        
        <VisualCategories />
        
        <ProductGrid 
          title="Sélection Beauté" 
          subtitle="Nos coups de cœur dermo-cosmétique" 
        />
      </main>
      <Footer />
    </div>
  );
}
