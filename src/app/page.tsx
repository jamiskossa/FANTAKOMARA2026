
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/home/ProductGrid';
import { VisualCategories } from '@/components/home/VisualCategories';
import { BrandBanner } from '@/components/home/BrandBanner';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <ProductGrid 
          title="Les meilleures ventes" 
          subtitle="Vos produits préférés au meilleur prix à Ivry" 
        />
        
        <VisualCategories />
        
        <ProductGrid 
          title="Promotions du moment" 
          subtitle="Profitez de nos offres exceptionnelles cette semaine"
        />
        
        <BrandBanner />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 text-primary">Votre pharmacie de proximité à Ivry-sur-Seine</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Depuis plus de 10 ans, la Pharmacie Nouvelle d'Ivry vous accompagne au quotidien avec des conseils personnalisés et une large sélection de produits de parapharmacie. Profitez de nos services digitaux : Click & Collect en 2h et Scan d'Ordonnance pour gagner du temps.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
