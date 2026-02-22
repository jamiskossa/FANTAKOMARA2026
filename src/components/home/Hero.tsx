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
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1920&auto=format&fit=crop",
    hint: "modern pharmacy",
    title: "Votre santé, notre priorité au quotidien.",
    subtitle: "Retrouvez les plus grandes marques de parapharmacie au meilleur prix."
  },
  {
    image: "https://images.unsplash.com/photo-1616750819574-7e38aa8046fa?q=80&w=1920&auto=format&fit=crop",
    hint: "skincare luxury",
    title: "L'excellence dermo-cosmétique.",
    subtitle: "Des conseils personnalisés pour prendre soin de votre peau."
  },
  {
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1920&auto=format&fit=crop",
    hint: "health vitamins",
    title: "Vitalité et Bien-être.",
    subtitle: "Une sélection rigoureuse de compléments alimentaires pour votre forme."
  }
];

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <section className="relative w-full overflow-hidden bg-slate-100">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-[450px] lg:h-[600px]"
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
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  data-ai-hint={slide.hint}
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 z-10 flex items-center">
                  <div className="container mx-auto px-4 md:px-12">
                    <div className="max-w-2xl space-y-4 lg:space-y-6 text-left">
                      <div className="inline-flex items-center bg-primary/90 backdrop-blur-sm rounded-full px-4 py-1 text-white text-[10px] lg:text-xs font-black uppercase tracking-[0.2em]">
                        Votre officine connectée à Ivry
                      </div>
                      
                      <h1 className="text-3xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-xl">
                        {slide.title}
                      </h1>
                      
                      <p className="text-sm lg:text-xl text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-md">
                        {slide.subtitle} <br className="hidden md:block" /> 
                        Commandez en ligne et retirez en 2h.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
