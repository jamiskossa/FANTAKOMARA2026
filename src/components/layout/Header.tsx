"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingCart, Menu, X, FileText, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Santé', sub: ['Compléments', 'Médicaments OTC', 'Vitalité'], href: '/categorie/sante' },
    { name: 'Beauté', sub: ['Visage', 'Corps', 'Cheveux'], href: '/categorie/beaute' },
    { name: 'Hygiène', sub: ['Douche', 'Dentaire', 'Intime'], href: '/categorie/hygiene' },
    { name: 'Bébé', sub: ['Lait', 'Soins', 'Accessoires'], href: '/categorie/bebe' },
  ];

  return (
    <>
      <div className="bg-secondary text-white py-2 text-center text-xs sm:text-sm font-medium">
        <p>Retrait 2h en pharmacie | Livraison gratuite dès 49€ | Conseils Experts</p>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-primary leading-none">Pharmacie Nouvelle</span>
              <span className="text-sm lg:text-base font-medium text-muted-foreground uppercase tracking-wider">d'Ivry</span>
            </Link>

            {/* Central Search (Exact Monge) */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Input 
                  placeholder="Rechercher un produit, une marque..." 
                  className="rounded-full pr-12 h-11 border-2 border-accent focus-visible:ring-secondary"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 text-secondary hover:bg-transparent">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Icons Right */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="hidden lg:flex items-center space-x-2 mr-4">
                <Button asChild variant="ghost" className="text-primary font-bold hover:text-primary/80">
                  <Link href="/click-collect">
                    <Clock className="w-4 h-4 mr-2" />
                    Click & Collect
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="text-secondary font-bold hover:text-secondary/80">
                  <Link href="/scan-ordonnance">
                    <FileText className="w-4 h-4 mr-2" />
                    Ordonnance
                  </Link>
                </Button>
              </div>
              
              <Button variant="ghost" size="icon" className="text-foreground" asChild>
                <Link href="/compte">
                  <User className="h-6 w-6" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" className="text-foreground relative" asChild>
                <Link href="/panier">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">0</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Nav (Exact Monge Style) */}
        <nav className="hidden lg:block border-t bg-white">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-8 py-3 text-sm font-bold uppercase tracking-wide">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group">
                      {cat.name}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {cat.sub.map((sub) => (
                        <DropdownMenuItem key={sub} asChild>
                          <Link href={`${cat.href}?sub=${sub.toLowerCase()}`} className="cursor-pointer">
                            {sub}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
              <li><Link href="/marques" className="hover:text-primary transition-colors">Marques</Link></li>
              <li><Link href="/promotions" className="text-destructive hover:opacity-80">Promotions</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Conseils</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t absolute w-full shadow-lg z-50 h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4 space-y-6">
              <div className="relative w-full">
                <Input placeholder="Rechercher..." className="rounded-full pr-10" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <ul className="space-y-4 font-bold text-lg">
                {categories.map(cat => (
                  <li key={cat.name}><Link href={cat.href} className="block py-2 border-b">{cat.name}</Link></li>
                ))}
                <li><Link href="/marques" className="block py-2 border-b">Marques</Link></li>
                <li><Link href="/promotions" className="block py-2 border-b text-destructive">Promotions</Link></li>
                <li><Link href="/blog" className="block py-2 border-b">Conseils</Link></li>
              </ul>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/click-collect">Click & Collect</Link>
                </Button>
                <Button asChild variant="outline" className="border-secondary text-secondary">
                  <Link href="/scan-ordonnance">Ordonnance</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}