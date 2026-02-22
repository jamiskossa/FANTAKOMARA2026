
"use client";

import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroSlides = [
  {
    image: PlaceHolderImages.find(img => img.id === 'hero-pharmacy')?.imageUrl || "https://picsum.photos/seed/h1/1920/800",
    hint: "pharmacy modern"
  },
  {
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "https://picsum.photos/seed/h2/1920/800",
    hint: "skincare luxury"
  },
  {
    image: PlaceHolderImages.find(img => img.id === 'vitamin-supplement')?.imageUrl || "https://picsum.photos/seed/h3/1920/800",
    hint: "vitamins display"
  }
];

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-[400px] lg:h-[550px]"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-full ml-0">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 h-full relative">
              <div className="relative w-full h-full">
                <Image 
                  src={slide.image} 
                  alt="Pharmacy products"
                  fill
                  priority={index === 0}
                  className="object-cover"
                  data-ai-hint={slide.hint}
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Overlay Text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4 lg:space-y-6">
            <div className="inline-flex items-center bg-primary/90 backdrop-blur-sm rounded-full px-4 py-1 text-white text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] animate-fade-in">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Votre officine de proximité connectée
            </div>
            
            <h1 className="text-3xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-2xl">
              Votre santé, <span className="text-secondary-foreground">notre priorité</span> au quotidien.
            </h1>
            
            <p className="text-sm lg:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Retrouvez les plus grandes marques de parapharmacie au meilleur prix. Commandez en ligne et retirez vos produits en 2h à Ivry-sur-Seine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
