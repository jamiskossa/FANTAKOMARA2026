
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12">Mentions Légales</h1>
        <div className="bg-white rounded-[32px] p-10 shadow-soft space-y-8 text-slate-600 border border-slate-100">
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">Éditeur du site</h2>
            <p className="font-medium">Pharmacie Nouvelle d'Ivry<br />40 Rue Marat, 94200 Ivry-sur-Seine<br />Tél : 01 46 71 12 34</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">Pharmacien Titulaire</h2>
            <p className="font-medium">Dr. Fanta Komara<br />Inscrit à l'Ordre National des Pharmaciens (RPPS: 10000000000)</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">Hébergement</h2>
            <p className="font-medium">Firebase Hosting (Google Cloud Platform)<br />Données de santé hébergées sur serveurs certifiés HDS aux normes européennes.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
