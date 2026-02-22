
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
  { name: 'A-Derma', image: PlaceHolderImages.find(img => img.id === 'brand-laroche')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Avène', image: PlaceHolderImages.find(img => img.id === 'brand-uriage')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Bioderma', image: PlaceHolderImages.find(img => img.id === 'brand-bioderma')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Caudalie', image: PlaceHolderImages.find(img => img.id === 'brand-nuxe')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Cerave', image: "https://picsum.photos/seed/cerave/400/200" },
  { name: 'Eucerin', image: "https://picsum.photos/seed/eucerin/400/200" },
  { name: 'Filorga', image: "https://picsum.photos/seed/filorga/400/200" },
  { name: 'Garancia', image: "https://picsum.photos/seed/garancia/400/200" },
  { name: 'La Roche-Posay', image: PlaceHolderImages.find(img => img.id === 'brand-laroche')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Nuxe', image: PlaceHolderImages.find(img => img.id === 'brand-nuxe')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'SVR', image: "https://picsum.photos/seed/svr/400/200" },
  { name: 'Uriage', image: PlaceHolderImages.find(img => img.id === 'brand-uriage')?.imageUrl || DEFAULT_BRAND_LOGO },
  { name: 'Vichy', image: "https://picsum.photos/seed/vichy/400/200" },
  { name: 'Weleda', image: "https://picsum.photos/seed/weleda/400/200" },
];

export function BrandBanner() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="py-20 bg-white border-y overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Nos Laboratoires Partenaires
          </h2>
          <p className="text-slate-500 mt-4 font-medium uppercase tracking-widest text-xs">
            L'excellence dermo-cosmétique sélectionnée par vos pharmaciens
          </p>
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
                <div className="p-4 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-pointer group">
                  <div className="relative w-full aspect-[2/1] max-w-[220px] transition-transform duration-500 group-hover:scale-110">
                    <Image 
                      src={brand.image} 
                      alt={brand.name}
                      fill
                      className="object-contain"
                      data-ai-hint="brand logo"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-16 text-center">
          <Link 
            href="/marques" 
            className="inline-flex items-center text-primary font-black border-2 border-primary rounded-full px-12 py-4 uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/30"
          >
            Découvrir tous nos laboratoires
          </Link>
        </div>
      </div>
    </section>
  );
}
