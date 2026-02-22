
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    { q: "Quels sont les délais de préparation pour le Click & Collect ?", a: "Vos commandes sont généralement prêtes en moins de 2 heures ouvrées." },
    { q: "Puis-je commander des médicaments sur ordonnance ?", a: "Vous pouvez réserver vos médicaments en scannant votre ordonnance via notre outil dédié. Le paiement et le retrait se font obligatoirement en officine." },
    { q: "Quels sont les frais de livraison ?", a: "La livraison est gratuite dès 49€ d'achat en France métropolitaine." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8 text-center">Foire Aux Questions</h1>
        <div className="bg-white rounded-[32px] p-8 shadow-soft">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm font-bold uppercase tracking-tight text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
