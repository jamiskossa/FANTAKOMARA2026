
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { QuickActions } from '@/components/home/QuickActions';
import { ProductGrid } from '@/components/home/ProductGrid';
import { PromotionCarousel } from '@/components/home/PromotionCarousel';
import { VisualCategories } from '@/components/home/VisualCategories';
import { BrandBanner } from '@/components/home/BrandBanner';
import { ServiceBanner } from '@/components/layout/ServiceBanner';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <QuickActions />
        
        <ProductGrid 
          title="Meilleures Ventes" 
          subtitle="Vos produits préférés au meilleur prix" 
        />
        
        <VisualCategories />
        
        <PromotionCarousel />
        
        <BrandBanner />
        
        <section className="py-24 bg-white border-t">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest">L'histoire de l'officine</Badge>
            <h2 className="text-3xl lg:text-5xl font-black mb-8 text-slate-900 tracking-tighter uppercase">Votre pharmacie de proximité à Ivry-sur-Seine</h2>
            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed font-medium">
              Depuis plus de 10 ans, la Pharmacie Nouvelle d'Ivry vous accompagne au quotidien avec des conseils personnalisés et une sélection rigoureuse des meilleures marques de parapharmacie. Profitez de nos services digitaux : Click & Collect en 2h et Scan d'Ordonnance sécurisé pour gagner du temps.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-60">
               <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 px-4 py-2 rounded-lg">Ordre National des Pharmaciens</div>
               <div className="text-[9px] font-black uppercase tracking-widest text-primary border border-primary/20 px-4 py-2 rounded-lg">Paiement 100% Sécurisé</div>
               <div className="text-[9px] font-black uppercase tracking-widest text-secondary border border-secondary/20 px-4 py-2 rounded-lg">Agréé ARS</div>
            </div>
          </div>
        </section>

        <ServiceBanner />
      </main>

      <Footer />
    </div>
  );
}
