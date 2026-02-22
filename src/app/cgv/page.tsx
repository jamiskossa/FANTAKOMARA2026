
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CGVPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12">Conditions Générales de Vente</h1>
        <div className="bg-white rounded-[32px] p-10 shadow-soft space-y-8 text-slate-600 border border-slate-100">
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">1. Objet</h2>
            <p className="font-medium">Les présentes CGV régissent les ventes de produits de parapharmacie réalisées sur le site de la Pharmacie Nouvelle d'Ivry.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">2. Click & Collect</h2>
            <p className="font-medium">Le retrait en officine s'effectue au 40 Rue Marat, 94200 Ivry-sur-Seine, après réception de la notification de mise à disposition par SMS ou Email.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">3. Prix et Paiement</h2>
            <p className="font-medium">Les prix sont indiqués en euros TTC. Pour les réservations, le paiement s'effectue lors du retrait en magasin après validation par le pharmacien.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">4. Droit de rétractation</h2>
            <p className="font-medium">Conformément à la réglementation, les produits de santé et certains produits d'hygiène ne peuvent faire l'objet d'un retour pour des raisons de sécurité sanitaire.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
