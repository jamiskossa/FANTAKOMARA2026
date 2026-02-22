
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
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
  category: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    brand: 'LA ROCHE-POSAY',
    name: 'Lipikar Baume AP+M',
    volume: '400 ml',
    price: 18.90,
    oldPrice: 22.50,
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
    badge: '-15%',
    category: 'Soin Corps'
  },
  {
    id: '2',
    brand: 'ARKOPHARMA',
    name: 'Arkoroyal Gelée Royale 1000mg',
    volume: '20 ampoules',
    price: 12.99,
    image: PlaceHolderImages.find(img => img.id === 'vitamin-supplement')?.imageUrl || "",
    category: 'Compléments'
  },
  {
    id: '3',
    brand: 'URIAGE',
    name: 'Huile Lavante Nettoyante',
    volume: '1 L',
    price: 11.50,
    oldPrice: 14.90,
    image: PlaceHolderImages.find(img => img.id === 'hygiene-products')?.imageUrl || "",
    badge: 'PROMO',
    category: 'Hygiène'
  },
  {
    id: '4',
    brand: 'GALLIA',
    name: 'Calisma 1 Lait Bébé',
    volume: '800 g',
    price: 19.95,
    image: PlaceHolderImages.find(img => img.id === 'baby-care')?.imageUrl || "",
    category: 'Bébé'
  }
];

export function ProductGrid({ title, subtitle, products = mockProducts }: { title: string, subtitle?: string, products?: Product[] }) {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Link href="/shop" className="text-primary font-bold hover:underline hidden sm:block">
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-muted rounded-xl">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  data-ai-hint="pharmacy product"
                />
                {product.badge && (
                  <Badge className="absolute top-2 left-2 bg-secondary text-white font-bold px-3 py-1">
                    {product.badge}
                  </Badge>
                )}
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="pt-4 px-2">
                <p className="text-[10px] lg:text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h3 className="text-sm lg:text-base font-medium line-clamp-2 min-h-[2.8rem] mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">{product.volume}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg lg:text-xl font-bold text-foreground">
                    {product.price.toFixed(2)}€
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.oldPrice.toFixed(2)}€
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-2 pt-0">
                <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-10">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 sm:hidden">
           <Link href="/shop" className="flex items-center justify-center w-full py-3 bg-muted rounded-lg text-primary font-bold">
            Voir tout le catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
