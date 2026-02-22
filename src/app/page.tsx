import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/home/ProductGrid';
import { PromotionCarousel } from '@/components/home/PromotionCarousel';
import { VisualCategories } from '@/components/home/VisualCategories';
import { BrandBanner } from '@/components/home/BrandBanner';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <ProductGrid 
          title="Les meilleures ventes de la Pharmacie Nouvelle d'Ivry" 
          subtitle="Vos produits préférés au meilleur prix à Ivry-sur-Seine" 
        />
        
        <VisualCategories />
        
        <PromotionCarousel />
        
        <BrandBanner />
        
        <section className="py-24 bg-fluid-gradient border-t">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 rounded-full px-4 py-1 text-sm font-bold">À propos de nous</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-slate-900 tracking-tight">Votre pharmacie de proximité à Ivry-sur-Seine</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Depuis plus de 10 ans, la Pharmacie Nouvelle d'Ivry vous accompagne au quotidien avec des conseils personnalisés et une sélection rigoureuse des meilleures marques de parapharmacie. Profitez de nos services digitaux : Click & Collect en 2h et Scan d'Ordonnance sécurisé pour gagner du temps.
            </p>
            <div className="mt-12 flex justify-center gap-12 grayscale opacity-40">
               {/* Simulation de logos de certification */}
               <div className="text-xs font-bold uppercase tracking-widest">Ordre National des Pharmaciens</div>
               <div className="text-xs font-bold uppercase tracking-widest">Paiement 100% Sécurisé</div>
               <div className="text-xs font-bold uppercase tracking-widest">Agréé ARS</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
