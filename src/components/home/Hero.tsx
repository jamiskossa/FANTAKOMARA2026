"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, FileText, ChevronRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[450px] lg:min-h-[550px] flex items-center bg-fluid-gradient">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 border border-primary/20 text-primary text-sm font-bold animate-fade-in">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Votre pharmacie de proximité, connectée
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-bold text-slate-900 leading-[1.1]">
            Votre santé, <span className="text-primary">notre priorité</span> au quotidien.
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed">
            Retrouvez les plus grandes marques de parapharmacie au meilleur prix. Commandez en ligne et retirez vos produits en 2h à Ivry-sur-Seine.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-8 h-14 bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/click-collect">
                <Clock className="w-5 h-5 mr-2" />
                Click & Collect
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white text-lg font-bold" asChild>
              <Link href="/scan-ordonnance">
                <FileText className="w-5 h-5 mr-2" />
                Scan Ordonnance
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-sm font-medium text-slate-500">
            <Link href="/promotions" className="flex items-center hover:text-primary transition-colors">
              Voir les promos <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <Link href="/marques" className="flex items-center hover:text-primary transition-colors">
              Nos marques <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Abstract Design Elements */}
      <div className="absolute right-0 bottom-0 hidden lg:block w-1/3 h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[60px] border-primary" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full border-[40px] border-secondary" />
      </div>
    </section>
  );
}