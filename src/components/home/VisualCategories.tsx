
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const DEFAULT_CAT_IMAGE = "https://picsum.photos/seed/cat/600/400";

export function VisualCategories() {
  const categories = [
    {
      title: "Soins Visage & Dermo",
      description: "Les meilleures marques au prix Ivry",
      image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || DEFAULT_CAT_IMAGE,
      href: "/categorie/beaute",
      className: "lg:col-span-2 lg:row-span-2 min-h-[300px] lg:min-h-[400px]"
    },
    {
      title: "Vitalité & Forme",
      description: "Boostez votre énergie",
      image: PlaceHolderImages.find(img => img.id === 'vitamin-supplement')?.imageUrl || DEFAULT_CAT_IMAGE,
      href: "/categorie/sante",
      className: "lg:col-span-1 lg:row-span-1 min-h-[200px] lg:min-h-[250px]"
    },
    {
      title: "Univers Bébé",
      description: "Douceur et sécurité",
      image: PlaceHolderImages.find(img => img.id === 'baby-care')?.imageUrl || DEFAULT_CAT_IMAGE,
      href: "/categorie/bebe",
      className: "lg:col-span-1 lg:row-span-1 min-h-[200px] lg:min-h-[250px]"
    }
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Nos univers parapharmacie</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Découvrez une sélection rigoureuse de produits adaptés à tous vos besoins de santé et de beauté.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              href={cat.href}
              className={`group relative overflow-hidden rounded-3xl shadow-soft flex flex-col ${cat.className}`}
            >
              <Image 
                src={cat.image} 
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw"
                data-ai-hint="pharmacy category"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-90" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">{cat.title}</h3>
                <p className="text-white/80 font-medium mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {cat.description}
                </p>
                <div className="inline-flex items-center font-bold text-sm bg-white text-secondary px-6 py-2 rounded-full w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                  Découvrir →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
