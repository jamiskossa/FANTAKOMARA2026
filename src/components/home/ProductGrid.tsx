
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductModal, type Product } from '@/components/ui/product-modal';

const DEFAULT_PLACEHOLDER = "https://picsum.photos/seed/placeholder/600/600";

const mockProducts: Product[] = [
  {
    id: '1',
    brand: 'LA ROCHE-POSAY',
    name: 'Lipikar Baume AP+M Relipidant',
    price: 18.90,
    oldPrice: 22.50,
    image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || DEFAULT_PLACEHOLDER,
    promo: '-15%',
    description: 'Baume relipidant triple-réparation. Apaise immédiatement la peau. Anti-grattage, anti-rechute.'
  },
  {
    id: '2',
    brand: 'ARKOPHARMA',
    name: 'Gelée Royale 1000mg Bio',
    price: 12.99,
    image: PlaceHolderImages.find(img => img.id === 'vitamin-supplement')?.imageUrl || DEFAULT_PLACEHOLDER,
    description: 'Complément alimentaire à base de gelée royale bio pour renforcer l\'immunité.'
  },
  {
    id: '3',
    brand: 'URIAGE',
    name: 'Huile Lavante Nettoyante Corps',
    price: 11.50,
    oldPrice: 14.90,
    image: PlaceHolderImages.find(img => img.id === 'hygiene-products')?.imageUrl || DEFAULT_PLACEHOLDER,
    promo: 'TOP',
    description: 'Huile lavante onctueuse pour les peaux sensibles et sèches.'
  },
  {
    id: '4',
    brand: 'GALLIA',
    name: 'Lait Bébé Calisma 1er âge',
    price: 19.95,
    image: PlaceHolderImages.find(img => img.id === 'baby-care')?.imageUrl || DEFAULT_PLACEHOLDER,
    description: 'Lait infantile pour nourrissons de 0 à 6 mois.'
  }
];

export function ProductGrid({ title, subtitle }: { title: string, subtitle?: string }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-2 text-lg">{subtitle}</p>}
          </div>
          <Link href="/promotions" className="text-primary font-bold hover:underline flex items-center group">
            Tout voir <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-10">
          {mockProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden border-none shadow-none hover:shadow-2xl transition-all duration-500 rounded-3xl p-2 bg-white cursor-pointer flex flex-col"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 rounded-2xl shrink-0">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {product.promo && (
                  <Badge className="absolute top-4 left-4 bg-primary text-white font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs">
                    {product.promo}
                  </Badge>
                )}
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-destructive" />
                </Button>
              </div>
              <CardContent className="pt-4 sm:pt-6 px-2 sm:px-3 flex-grow">
                <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-yellow-400`} />
                  ))}
                </div>
                <p className="text-[9px] sm:text-[11px] font-bold text-secondary uppercase tracking-widest mb-1">
                  {product.brand}
                </p>
                <h3 className="text-xs sm:text-base font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem] mb-1 group-hover:text-primary">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg sm:text-2xl font-black text-slate-900">
                    {product.price.toFixed(2)}€
                  </span>
                  {product.oldPrice && (
                    <span className="text-[10px] sm:text-sm text-destructive font-medium line-through">
                      {product.oldPrice.toFixed(2)}€
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-2 sm:p-3 pt-0">
                <Button className="w-full rounded-full bg-slate-900 hover:bg-primary text-white font-black text-[9px] sm:text-xs h-10 sm:h-12 transition-all shadow-lg hover:shadow-primary/40 group-hover:translate-y-[-2px] uppercase tracking-widest">
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Réserver en pharmacie
                </Button>
              </CardFooter>
            </Card>
          ))}
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
