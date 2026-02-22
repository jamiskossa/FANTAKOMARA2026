
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
    <section className="relative w-full overflow-hidden bg-slate-100 h-[300px] sm:h-[450px] lg:h-[600px]">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-[300px] sm:h-[450px] lg:h-[600px] ml-0">
          {heroSlides.map((slide, index) => {
            const imageData = PlaceHolderImages.find(img => img.id === slide.id);
            return (
              <CarouselItem key={index} className="pl-0 h-full w-full relative">
                <Link href="/categorie/sante" className="block relative w-full h-full group">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image 
                      src={imageData?.imageUrl || "https://picsum.photos/seed/ph1/1920/1080"} 
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
                        <div className="max-w-[260px] sm:max-w-2xl space-y-2 lg:space-y-6 text-left">
                          <div className="inline-flex items-center bg-primary/90 backdrop-blur-sm rounded-full px-3 py-0.5 sm:px-4 sm:py-1 text-white text-[7px] sm:text-[10px] lg:text-xs font-black uppercase tracking-[0.2em]">
                            Officine d'Ivry-sur-Seine
                          </div>
                          
                          <h1 className="text-lg sm:text-4xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-2xl">
                            {slide.title}
                          </h1>
                          
                          <p className="text-[9px] sm:text-base lg:text-xl text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-md">
                            {slide.subtitle} <br className="hidden md:block" /> 
                            <span className="font-black text-primary">Click & Collect en 2h.</span>
                          </p>
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
