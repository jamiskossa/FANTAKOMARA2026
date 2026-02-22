
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12">Politique de Confidentialité</h1>
        <div className="bg-white rounded-[32px] p-10 shadow-soft space-y-8 text-slate-600">
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">Protection des données</h2>
            <p>Conformément au RGPD, la Pharmacie Nouvelle d'Ivry s'engage à protéger la vie privée de ses utilisateurs. Vos données de santé sont traitées avec la plus grande confidentialité.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-primary uppercase mb-4">Finalité des données</h2>
            <p>Les informations collectées sont exclusivement destinées à la gestion de vos commandes et au suivi de vos soins par nos pharmaciens.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
