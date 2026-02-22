
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingCart, Menu, X, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs sm:text-sm font-medium">
        <p>
          HAPPY DAYS ! -10%, -15%, -20% dès 99€, 149€, 199€ avec les codes 
          <span className="font-bold ml-1">HAPPY10 / HAPPY15 / HAPPY20</span>
        </p>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start">
              <span className="text-xl lg:text-2xl font-bold text-primary leading-none">Pharmacie Nouvelle</span>
              <span className="text-sm lg:text-base font-medium text-muted-foreground uppercase tracking-wider">d'Ivry</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input 
                  placeholder="Rechercher un produit, une marque..." 
                  className="rounded-full pr-10 focus-visible:ring-primary"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 hover:bg-transparent">
                  <Search className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>

            {/* Desktop Icons & Services */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Link href="/click-collect" className="flex items-center text-sm font-semibold text-primary hover:opacity-80">
                  <Clock className="w-4 h-4 mr-1" />
                  Click & Collect
                </Link>
                <Link href="/scan-ordonnance" className="flex items-center text-sm font-semibold text-primary hover:opacity-80">
                  <FileText className="w-4 h-4 mr-1" />
                  Scan Ordonnance
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="text-foreground">
                  <User className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-foreground relative">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-foreground relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block border-t bg-white">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-8 py-3 text-sm font-medium">
              <li><Link href="/categorie/sante" className="hover:text-primary transition-colors">Santé</Link></li>
              <li><Link href="/categorie/beaute" className="hover:text-primary transition-colors">Beauté</Link></li>
              <li><Link href="/categorie/hygiene" className="hover:text-primary transition-colors">Hygiène</Link></li>
              <li><Link href="/categorie/bebe" className="hover:text-primary transition-colors">Bébé</Link></li>
              <li><Link href="/marques" className="hover:text-primary transition-colors">Marques</Link></li>
              <li><Link href="/promotions" className="text-secondary font-bold hover:opacity-80">Promotions</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t absolute w-full shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-4 py-4 space-y-4">
              <div className="relative w-full md:hidden">
                <Input 
                  placeholder="Rechercher..." 
                  className="rounded-full pr-10"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Search className="h-4 w-4 text-primary" />
                </Button>
              </div>
              <ul className="space-y-3 font-medium text-lg">
                <li><Link href="/categorie/sante" className="block py-2">Santé</Link></li>
                <li><Link href="/categorie/beaute" className="block py-2">Beauté</Link></li>
                <li><Link href="/categorie/hygiene" className="block py-2">Hygiène</Link></li>
                <li><Link href="/categorie/bebe" className="block py-2">Bébé</Link></li>
                <li><Link href="/marques" className="block py-2">Marques</Link></li>
                <li><Link href="/promotions" className="block py-2 text-secondary font-bold">Promotions</Link></li>
                <li><Link href="/blog" className="block py-2">Blog</Link></li>
                <li><Link href="/contact" className="block py-2">Contact</Link></li>
              </ul>
              <div className="pt-4 border-t space-y-3">
                <Link href="/click-collect" className="flex items-center p-3 rounded-lg bg-primary/10 text-primary font-bold">
                  <Clock className="w-5 h-5 mr-3" />
                  Click & Collect
                </Link>
                <Link href="/scan-ordonnance" className="flex items-center p-3 rounded-lg bg-primary/10 text-primary font-bold">
                  <FileText className="w-5 h-5 mr-3" />
                  Scan Ordonnance
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Services Info Bar */}
      <div className="bg-muted py-2 text-[10px] sm:text-xs">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground font-medium uppercase tracking-wide">
            <li>Retrait 2h</li>
            <li>Livraison offerte dès 49€</li>
            <li>Paiement sécurisé</li>
            <li>Conseils personnalisés</li>
          </ul>
        </div>
      </div>
    </>
  );
}
