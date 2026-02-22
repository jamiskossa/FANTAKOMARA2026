
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-pharmacy');

  const slides = [
    {
      title: "HAPPY DAYS !",
      subtitle: "-10%, -15%, -20% sur tout le site",
      description: "Dès 99€, 149€ et 199€ avec les codes HAPPY10, HAPPY15 et HAPPY20.",
      buttonText: "J'en profite",
      color: "bg-secondary"
    },
    {
      title: "Soin Visage Expert",
      subtitle: "Les plus grandes marques",
      description: "Retrouvez La Roche-Posay, Avène et Bioderma au meilleur prix.",
      buttonText: "Découvrir",
      color: "bg-primary"
    }
  ];

  return (
    <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0">
        <Image 
          src={heroImage?.imageUrl || ""} 
          alt="Pharmacie Nouvelle d'Ivry"
          fill
          priority
          className="object-cover"
          data-ai-hint="pharmacy interior"
        />
        <div className="absolute inset-0 bg-black/40 lg:bg-black/30" />
      </div>

      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="flex flex-col justify-center h-full max-w-xl text-white">
          <Carousel 
            opts={{ loop: true }} 
            className="w-full"
            // We'll simulate autoplay by just having the UI ready
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="space-y-6">
                    <div className={`${slide.color} inline-block px-4 py-1 rounded-full text-xs lg:text-sm font-bold uppercase tracking-wider`}>
                      {slide.title}
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                      {slide.subtitle}
                    </h1>
                    <p className="text-lg lg:text-xl opacity-90 font-medium">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button size="lg" className="rounded-full px-10 bg-primary hover:bg-primary/90 text-white border-none text-base font-bold">
                        {slide.buttonText}
                      </Button>
                      <Button size="lg" variant="outline" className="rounded-full px-10 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-base font-bold">
                        Click & Collect
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
