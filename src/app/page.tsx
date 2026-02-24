
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Rappel Lait Infantile Section */}
        <div className="container mx-auto px-4 -mt-12 mb-12 relative z-30">
          <div className="bg-white/80 border-2 border-destructive/20 backdrop-blur-md p-6 rounded-[32px] shadow-2xl shadow-destructive/10 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-destructive text-white flex items-center justify-center animate-pulse shadow-lg shadow-destructive/30">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-destructive tracking-tighter">Rappel Lait Infantile</h3>
                <p className="text-sm font-bold text-slate-600">Information de sécurité majeure : vérifiez les lots concernés.</p>
              </div>
            </div>
            <Button asChild variant="destructive" className="w-full md:w-auto rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-destructive/40 transition-all hover:scale-105 active:scale-95">
              <Link href="/rappel-lait">
                Consulter les alertes
              </Link>
            </Button>
          </div>
        </div>

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
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-12">
               <a href="https://www.ordre.pharmacien.fr/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-all hover:scale-105">
                 <div className="h-16 w-32 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center p-3 grayscale group-hover:grayscale-0 group-hover:border-primary/20 transition-all shadow-sm group-hover:shadow-xl">
                   <div className="text-center">
                     <p className="text-[8px] font-black uppercase leading-tight text-slate-400 group-hover:text-primary">Ordre National</p>
                     <p className="text-[10px] font-black uppercase leading-tight text-slate-600">Pharmaciens</p>
                   </div>
                 </div>
               </a>
               <a href="https://ansm.sante.fr/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-all hover:scale-105">
                 <div className="h-16 w-32 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center p-3 grayscale group-hover:grayscale-0 group-hover:border-primary/20 transition-all shadow-sm group-hover:shadow-xl">
                   <div className="text-center">
                     <p className="text-[10px] font-black uppercase text-slate-400 group-hover:text-primary">ANSM</p>
                     <p className="text-[7px] font-bold text-slate-500 uppercase">Sécurité du médicament</p>
                   </div>
                 </div>
               </a>
               <a href="https://www.ars.sante.fr/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-all hover:scale-105">
                 <div className="h-16 w-32 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center p-3 grayscale group-hover:grayscale-0 group-hover:border-primary/20 transition-all shadow-sm group-hover:shadow-xl">
                   <div className="text-center">
                     <p className="text-[10px] font-black uppercase text-slate-400 group-hover:text-primary">Agréé ARS</p>
                     <p className="text-[7px] font-bold text-slate-500 uppercase">Île-de-France</p>
                   </div>
                 </div>
               </a>
               <a href="https://sante.gouv.fr/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-all hover:scale-105">
                 <div className="h-16 w-32 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center p-3 grayscale group-hover:grayscale-0 group-hover:border-primary/20 transition-all shadow-sm group-hover:shadow-xl">
                   <div className="text-center">
                     <p className="text-[8px] font-black uppercase leading-tight text-slate-400 group-hover:text-primary">Ministère de la</p>
                     <p className="text-[10px] font-black uppercase leading-tight text-slate-600">Santé</p>
                   </div>
                 </div>
               </a>
            </div>
          </div>
        </section>

        <ServiceBanner />
      </main>

      <Footer />
    </div>
  );
}
