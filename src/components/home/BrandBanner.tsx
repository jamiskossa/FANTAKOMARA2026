
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const brands = [
  { name: 'La Roche-Posay', image: PlaceHolderImages.find(img => img.id === 'brand-laroche')?.imageUrl || "" },
  { name: 'Uriage', image: PlaceHolderImages.find(img => img.id === 'brand-uriage')?.imageUrl || "" },
  { name: 'Bioderma', image: PlaceHolderImages.find(img => img.id === 'brand-bioderma')?.imageUrl || "" },
  { name: 'Nuxe', image: PlaceHolderImages.find(img => img.id === 'brand-nuxe')?.imageUrl || "" },
  { name: 'SVR', image: PlaceHolderImages.find(img => img.id === 'brand-laroche')?.imageUrl || "" },
  { name: 'Avène', image: PlaceHolderImages.find(img => img.id === 'brand-uriage')?.imageUrl || "" }
];

export function BrandBanner() {
  return (
    <section className="py-12 bg-white border-y">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold">Retrouvez toutes vos marques préférées</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand, index) => (
            <Link key={index} href={`/marques/${brand.name.toLowerCase()}`} className="w-full max-w-[120px] lg:max-w-[150px] relative aspect-[2/1] hover:opacity-100">
              <Image 
                src={brand.image} 
                alt={brand.name}
                fill
                className="object-contain"
                data-ai-hint="brand logo"
              />
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/marques" className="text-primary font-bold border-2 border-primary rounded-full px-8 py-2 hover:bg-primary hover:text-white transition-all">
            Voir toutes les marques
          </Link>
        </div>
      </div>
    </section>
  );
}
