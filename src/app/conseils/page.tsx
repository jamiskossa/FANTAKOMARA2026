
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ConseilsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8">Nos Conseils Santé</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[32px] p-8 shadow-soft border-l-4 border-primary">
            <h2 className="text-xl font-black uppercase mb-4">Sommeil & Stress</h2>
            <p className="text-slate-500 mb-6">Découvrez nos solutions naturelles pour retrouver un sommeil réparateur et gérer votre anxiété au quotidien.</p>
            <Button asChild className="rounded-full"><Link href="/blog">Lire les articles</Link></Button>
          </div>
          <div className="bg-white rounded-[32px] p-8 shadow-soft border-l-4 border-secondary">
            <h2 className="text-xl font-black uppercase mb-4">Dermo-cosmétique</h2>
            <p className="text-slate-500 mb-6">Nos experts vous guident pour choisir la routine de soin adaptée à votre type de peau : grasse, sèche ou sensible.</p>
            <Button asChild variant="outline" className="rounded-full"><Link href="/categorie/beaute">Voir les produits</Link></Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
