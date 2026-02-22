"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/home/ProductGrid';

export default function SantePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-fluid-gradient">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-slate-900 tracking-tight">Santé & Bien-être</h1>
            <p className="text-xl text-slate-600">Compléments alimentaires, médicaments sans ordonnance et solutions pour votre vitalité quotidienne.</p>
          </div>
        </section>
        
        <ProductGrid 
          title="Vos indispensables Santé" 
          subtitle="Tout pour votre forme et vitalité" 
        />
      </main>
      <Footer />
    </div>
  );
}
