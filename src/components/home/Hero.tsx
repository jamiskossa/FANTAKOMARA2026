
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroSlides = [
  {
    id: 'hero-pharmacy-1',
    title: "Le meilleur de la dermo-cosmétique.",
    subtitle: "Retrouvez vos marques préférées au meilleur prix à Ivry."
  },
  {
    id: 'hero-pharmacy-2',
    title: "Votre santé, notre priorité au quotidien.",
    subtitle: "Des conseils personnalisés et un retrait en pharmacie en 2h."
  },
  {
    id: 'hero-pharmacy-3',
    title: "Vitalité et Bien-être toute l'année.",
    subtitle: "Une sélection rigoureuse de vitamines et compléments alimentaires."
  }
];

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <section className="relative w-full overflow-hidden bg-slate-100 min-h-[350px] sm:min-h-[450px] lg:min-h-[600px] h-[50vh] lg:h-[70vh]">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-full ml-0">
          {heroSlides.map((slide, index) => {
            const imageData = PlaceHolderImages.find(img => img.id === slide.id);
            return (
              <CarouselItem key={index} className="pl-0 h-full w-full relative min-h-[350px] sm:min-h-[450px] lg:min-h-[600px]">
                <Link href="/categorie/sante" className="block relative w-full h-full group min-h-[350px] sm:min-h-[450px] lg:min-h-[600px]">
                  <div className="relative w-full h-full overflow-hidden min-h-[350px] sm:min-h-[450px] lg:min-h-[600px]">
                    <Image 
                      src={imageData?.imageUrl || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1920&auto=format&fit=crop"} 
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      className="object-cover transition-transform duration-[10000ms] group-hover:scale-110"
                      sizes="100vw"
                      data-ai-hint={imageData?.imageHint || "pharmacy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                    
                    <div className="absolute inset-0 z-10 flex items-center">
                      <div className="container mx-auto px-4 md:px-12">
                        <div className="max-w-[280px] sm:max-w-2xl space-y-3 lg:space-y-6 text-left">
                          <div className="inline-flex items-center bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-[8px] sm:text-[10px] lg:text-xs font-black uppercase tracking-[0.2em]">
                            Officine d'Ivry-sur-Seine
                          </div>
                          
                          <h1 className="text-xl sm:text-4xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-2xl">
                            {slide.title}
                          </h1>
                          
                          <p className="text-[10px] sm:text-base lg:text-xl text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-md">
                            {slide.subtitle} <br className="hidden md:block" /> 
                            <span className="font-black text-primary">Click & Collect en 2h.</span>
                          </p>

                          <div className="pt-2">
                            <Link href="/categorie/sante">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs h-10 sm:h-14 px-6 sm:px-10 rounded-full shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                                Commencer mon shopping
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
