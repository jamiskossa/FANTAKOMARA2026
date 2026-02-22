
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function VisualCategories() {
  const categories = [
    {
      title: "Soins Visage & Dermo",
      description: "Marques premium au meilleur prix",
      image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
      href: "/categorie/beaute",
      className: "md:col-span-2 md:row-span-2"
    },
    {
      title: "Compléments & Forme",
      description: "Boostez votre quotidien",
      image: PlaceHolderImages.find(img => img.id === 'vitamin-supplement')?.imageUrl || "",
      href: "/categorie/sante",
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Univers Bébé & Maman",
      description: "Soins doux et sécurisés",
      image: PlaceHolderImages.find(img => img.id === 'baby-care')?.imageUrl || "",
      href: "/categorie/bebe",
      className: "md:col-span-1 md:row-span-1"
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 min-h-[500px] lg:min-h-[600px]">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              href={cat.href}
              className={`group relative overflow-hidden rounded-2xl ${cat.className}`}
            >
              <Image 
                src={cat.image} 
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                data-ai-hint="pharmacy category"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 lg:p-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{cat.title}</h3>
                <p className="text-white/80 font-medium mb-4">{cat.description}</p>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary transform group-hover:translate-x-2 transition-transform">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
