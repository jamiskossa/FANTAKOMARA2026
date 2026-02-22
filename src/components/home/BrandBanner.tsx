
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const DEFAULT_BRAND_LOGO = "https://picsum.photos/seed/brand/400/200";

const brands = [
  { name: 'La Roche-Posay', image: PlaceHolderImages.find(img => img.id === 'brand-laroche')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Uriage', image: PlaceHolderImages.find(img => img.id === 'brand-uriage')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Bioderma', image: PlaceHolderImages.find(img => img.id === 'brand-bioderma')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Nuxe', image: PlaceHolderImages.find(img => img.id === 'brand-nuxe')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'SVR', image: PlaceHolderImages.find(img => img.id === 'brand-laroche')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Avène', image: PlaceHolderImages.find(img => img.id === 'brand-uriage')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Caudalie', image: PlaceHolderImages.find(img => img.id === 'brand-bioderma')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Vichy', image: PlaceHolderImages.find(img => img.id === 'brand-nuxe')?.imageUrl || DEFAULT_BRAND_LOGO },
];

export function BrandBanner() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="py-16 bg-white border-y overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Retrouvez toutes vos marques préférées
          </h2>
        </div>
        
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4 flex items-center">
            {brands.map((brand, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6">
                <div className="p-4 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <Link 
                    href={`/marques/${brand.name.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="relative w-full aspect-[2/1] max-w-[180px] lg:max-w-[220px]"
                  >
                    <Image 
                      src={brand.image} 
                      alt={brand.name}
                      fill
                      className="object-contain"
                      data-ai-hint="brand logo"
                    />
                  </Link>
                </div>
              </CarouselItem>
            ))}
            {/* Duplication pour un défilement infini plus fluide si nécessaire, 
                mais Embla loop:true gère déjà bien cela avec assez d'items */}
          </CarouselContent>
        </Carousel>

        <div className="mt-16 text-center">
          <Link 
            href="/marques" 
            className="inline-flex items-center text-primary font-black border-2 border-primary rounded-full px-10 py-3 uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/30"
          >
            Voir toutes les marques
          </Link>
        </div>
      </div>
    </section>
  );
}
