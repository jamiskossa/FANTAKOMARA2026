"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductModal, type Product } from '@/components/ui/product-modal';

const promotionProducts: Product[] = [
  {
    id: 'p1',
    brand: 'NUXE',
    name: "Coffret Noël Le Rituel d'Exception",
    price: 44.99,
    oldPrice: 48.99,
    promo: '-4€',
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    description: "Un coffret d'exception pour un rituel de soin complet à la fragrance iconique de Nuxe."
  },
  {
    id: 'p2',
    brand: 'URIAGE',
    name: 'Age Absolu Sérum',
    price: 40.99,
    oldPrice: 43.99,
    promo: '-3€',
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    description: "Sérum booster de collagène et d'élastine pour une peau redensifiée et raffermie."
  },
  {
    id: 'p3',
    brand: 'SVR',
    name: 'Topialyse Baume Protect+ x2',
    price: 28.79,
    oldPrice: 35.99,
    promo: '-7,20€',
    image: PlaceHolderImages.find(img => img.id === 'hygiene-products')?.imageUrl || "",
    description: "Le premier soin émollient qui protège contre les agresseurs environnementaux."
  },
  {
    id: 'p4',
    brand: 'LA ROCHE-POSAY',
    name: 'Lipikar Baume AP+M Relipidant',
    price: 18.90,
    oldPrice: 22.50,
    promo: '-15%',
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    description: "Baume relipidant triple-réparation. Apaise immédiatement la peau."
  },
  {
    id: 'p5',
    brand: 'BIODERMA',
    name: 'Atoderm Huile de Douche 1L',
    price: 12.50,
    oldPrice: 15.00,
    promo: '-2,50€',
    image: PlaceHolderImages.find(img => img.id === 'hygiene-products')?.imageUrl || "",
    description: "Nettoie en douceur et apaise les peaux sensibles sèches à très sèches."
  }
];

export function PromotionCarousel() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="py-20 bg-[#f9fafb]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-2">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Promotions Pharmacie Nouvelle d'Ivry à Ivry-sur-Seine
            </h2>
            <p className="text-slate-500 text-lg">
              Retrouvez le meilleur des promotions de parapharmacie
            </p>
          </div>
          <Link href="/promotions" className="text-primary font-bold hover:underline flex items-center group">
            Voir toutes les promotions <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="px-12 relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {promotionProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <Card 
                    className="group border-none shadow-none hover:shadow-xl transition-all duration-500 rounded-3xl p-3 bg-white h-full flex flex-col cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-2xl block mb-6">
                      <Image 
                        src={product.image || "https://picsum.photos/seed/placeholder/600/600"} 
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <Badge className="absolute top-4 left-4 bg-destructive text-white font-black px-3 py-1 rounded-full text-xs shadow-sm">
                        {product.promo}
                      </Badge>
                    </div>
                    <CardContent className="p-2 flex flex-col flex-grow">
                      <div className="flex items-center gap-1 mb-2">
                         {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 text-yellow-400 fill-yellow-400`} />
                        ))}
                      </div>
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] mb-3 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="mt-auto pt-2">
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-black text-slate-900">
                            {product.price.toFixed(2).replace('.', ',')}€
                          </span>
                          <span className="text-sm text-destructive font-medium line-through">
                            {product.oldPrice?.toFixed(2).replace('.', ',')}€
                          </span>
                        </div>
                        <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-11 transition-all shadow-md">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-6 border-none bg-white shadow-lg hover:bg-primary hover:text-white" />
            <CarouselNext className="hidden md:flex -right-6 border-none bg-white shadow-lg hover:bg-primary hover:text-white" />
          </Carousel>
        </div>
      </div>

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}