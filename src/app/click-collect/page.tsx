"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Clock, ShieldCheck, ShoppingBag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClickCollect() {
  const router = useRouter();
  const steps = [
    { icon: ShoppingBag, title: "Commandez en ligne", desc: "Faites votre shopping parmi 1000+ références." },
    { icon: Clock, title: "Prêt en 2h", desc: "Nos pharmaciens préparent votre panier avec soin." },
    { icon: MapPin, title: "Retirez à Ivry", desc: "Passez à la pharmacie 40 Rue Marat sans attendre." }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-fluid-gradient">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-slate-900">Click & Collect 2h</h1>
            <p className="text-xl text-slate-600 mb-10">Commandez vos produits de parapharmacie en ligne et retirez-les gratuitement dans notre officine à Ivry-sur-Seine.</p>
            <Button 
              size="lg" 
              className="rounded-full px-10 h-14 bg-primary text-lg font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
              onClick={() => router.push('/categorie/sante')}
            >
              Commencer mon shopping
            </Button>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <div key={i} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto text-secondary mb-6">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{step.title}</h3>
                  <p className="text-slate-500">{step.desc}</p>
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