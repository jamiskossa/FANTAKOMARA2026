"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Product {
  id: string;
  brand: string;
  name: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    brand: 'LA ROCHE-POSAY',
    name: 'Lipikar Baume AP+M Relipidant',
    volume: '400 ml',
    price: 18.90,
    oldPrice: 22.50,
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    badge: '-15%',
    rating: 5
  },
  {
    id: '2',
    brand: 'ARKOPHARMA',
    name: 'Gelée Royale 1000mg Bio',
    volume: '20 ampoules',
    price: 12.99,
    image: PlaceHolderImages.find(img => img.id === 'vitamin-supplement')?.imageUrl || "",
    rating: 4
  },
  {
    id: '3',
    brand: 'URIAGE',
    name: 'Huile Lavante Nettoyante Corps',
    volume: '1 L',
    price: 11.50,
    oldPrice: 14.90,
    image: PlaceHolderImages.find(img => img.id === 'hygiene-products')?.imageUrl || "",
    badge: 'TOP',
    rating: 5
  },
  {
    id: '4',
    brand: 'GALLIA',
    name: 'Lait Bébé Calisma 1er âge',
    volume: '800 g',
    price: 19.95,
    image: PlaceHolderImages.find(img => img.id === 'baby-care')?.imageUrl || "",
    rating: 4
  }
];

export function ProductGrid({ title, subtitle, products = mockProducts }: { title: string, subtitle?: string, products?: Product[] }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-2 text-lg">{subtitle}</p>}
          </div>
          <Link href="/shop" className="text-primary font-bold hover:underline flex items-center group">
            Tout voir <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-none shadow-none hover:shadow-2xl transition-all duration-500 rounded-3xl p-2 bg-white">
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 rounded-2xl">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  data-ai-hint="pharmacy product"
                />
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-primary text-white font-bold px-3 py-1 rounded-full text-xs">
                    {product.badge}
                  </Badge>
                )}
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full h-10 w-10 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <Heart className="h-5 w-5 text-slate-400 hover:text-destructive" />
                </Button>
              </div>
              <CardContent className="pt-6 px-3">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < (product.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-1">
                  {product.brand}
                </p>
                <h3 className="text-base font-semibold text-slate-800 line-clamp-2 min-h-[3rem] mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{product.volume}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {product.price.toFixed(2)}€
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-destructive font-medium line-through">
                      {product.oldPrice.toFixed(2)}€
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button className="w-full rounded-full bg-slate-900 hover:bg-primary text-white font-bold h-12 transition-all shadow-lg hover:shadow-primary/40 group-hover:translate-y-[-2px]">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}