
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, HeartPulse, Baby, ShieldCheck } from 'lucide-react';

export default function ConseilsPage() {
  const categories = [
    { title: "Dermo-cosmétique", desc: "Trouvez la routine adaptée à votre type de peau : grasse, sèche ou sensible.", icon: Sparkles, color: "text-primary" },
    { title: "Maman & Bébé", desc: "Les gestes essentiels pour le soin du nouveau-né et le bien-être de la maman.", icon: Baby, color: "text-secondary" },
    { title: "Santé Naturelle", desc: "Découvrez les bienfaits de la phytothérapie et de l'aromathérapie.", icon: HeartPulse, color: "text-primary" },
    { title: "Prévention", desc: "Boostez votre immunité et prévenez les maux de l'hiver efficacement.", icon: ShieldCheck, color: "text-secondary" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-12 text-center">Nos Conseils Santé</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white rounded-[40px] p-10 shadow-soft border border-slate-100 hover:border-primary/20 transition-all group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <cat.icon className={`w-8 h-8 ${cat.color}`} />
              </div>
              <h2 className="text-2xl font-black uppercase text-slate-900 mb-4 tracking-tight">{cat.title}</h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">{cat.desc}</p>
              <Button asChild className="rounded-full bg-slate-900 hover:bg-primary font-black uppercase tracking-widest text-[10px] h-12 px-8">
                <Link href="/blog">Lire les articles</Link>
              </Button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
