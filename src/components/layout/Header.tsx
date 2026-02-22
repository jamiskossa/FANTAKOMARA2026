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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* 1. Barre Promo HAPPY DAYS */}
      <div className="bg-[#002d5c] text-white py-1.5 text-center text-xs sm:text-sm font-bold tracking-tight">
        <p>HAPPY DAYS ! -10% , -15%, -20% à partir de 99€, 149€ et 199€ avec les codes HAPPY10, HAPPY15 et HAPPY20 !</p>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          {/* 2. Ligne Logo, Recherche et Icônes */}
          <div className="flex items-center justify-between py-4 gap-6 lg:gap-12">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start shrink-0">
              <span className="text-xl lg:text-2xl font-black text-primary leading-none tracking-tighter uppercase">Pharmacie Nouvelle</span>
              <span className="text-sm lg:text-base font-bold text-secondary uppercase tracking-widest">d'Ivry</span>
            </Link>

            {/* Barre de Recherche Centrale */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full group">
                <Input 
                  placeholder="Rechercher un produit, une marque..." 
                  className="rounded-full pr-12 h-12 border-2 border-accent focus-visible:ring-secondary transition-all"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 text-secondary hover:bg-transparent">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Icônes Compte et Panier */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button variant="ghost" size="sm" className="hidden lg:flex flex-col h-auto py-1 px-2 items-center text-slate-600 hover:text-primary transition-colors" asChild>
                <Link href="/compte">
                  <User className="h-6 w-6 mb-0.5" />
                  <span className="text-[10px] font-bold uppercase">Compte</span>
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex flex-col h-auto py-1 px-2 items-center text-slate-600 hover:text-primary relative transition-colors" asChild>
                <Link href="/panier">
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6 mb-0.5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-black">0</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase hidden lg:block">Panier</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* 3. Ligne Services (Desktop) */}
          <div className="hidden lg:flex justify-end items-center pb-2 space-x-4">
             <Button asChild variant="outline" size="sm" className="rounded-full border-primary text-primary font-bold text-xs px-4 h-8 hover:bg-primary hover:text-white transition-all shadow-sm">
                <Link href="/click-collect">
                  <Clock className="w-3.5 h-3.5 mr-2" />
                  Click & Collect
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full border-secondary text-secondary font-bold text-xs px-4 h-8 hover:bg-secondary hover:text-white transition-all shadow-sm">
                <Link href="/scan-ordonnance">
                  <FileText className="w-3.5 h-3.5 mr-2" />
                  Scan Ordonnance
                </Link>
              </Button>
          </div>
        </div>

        {/* 4. Menu de Navigation Horizontal */}
        <nav className="hidden lg:block border-t bg-white">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-8 py-3 text-sm font-bold uppercase tracking-wide">
              {/* SANTÉ */}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group py-1">
                    Santé
                    <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 shadow-xl border-t-2 border-t-primary">
                    <DropdownMenuItem asChild><Link href="/categorie/sante/complements">Compléments alimentaires</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/sante/forme">Forme & Vitalité</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/sante/sommeil">Sommeil & Stress</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/sante/digestion">Digestion</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/sante/articulations">Articulations & Muscles</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/sante/immunite">Immunité</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="font-black text-primary"><Link href="/categorie/sante">Tous les produits Santé</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              {/* BEAUTÉ */}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group py-1">
                    Beauté
                    <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 shadow-xl border-t-2 border-t-primary">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center justify-between">
                        Soins du visage
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-64 p-2">
                          <DropdownMenuItem asChild><Link href="/categorie/beaute/visage/anti-age">Anti-âge</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href="/categorie/beaute/visage/hydratation">Hydratation</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href="/categorie/beaute/visage/anti-imperfections">Anti-imperfections</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-secondary font-bold"><Link href="/categorie/beaute/visage/nettoyants-demaquillants">Nettoyants & Démaquillants</Link></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="font-bold"><Link href="/categorie/beaute/visage">Tous les soins visage</Link></DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem asChild><Link href="/categorie/beaute/corps">Soins du corps</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/beaute/cheveux">Cheveux</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/beaute/solaires">Solaires</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="font-black text-primary"><Link href="/categorie/beaute">Tous les produits Beauté</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              {/* HYGIÈNE */}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group py-1">
                    Hygiène
                    <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 shadow-xl border-t-2 border-t-primary">
                    <DropdownMenuItem asChild><Link href="/categorie/hygiene/douche">Douche & Bain</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/hygiene/dentaire">Dentaire</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/hygiene/intime">Hygiène intime</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/hygiene/deodorants">Déodorants</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="font-black text-primary"><Link href="/categorie/hygiene">Tous les produits Hygiène</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              {/* BÉBÉ */}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group py-1">
                    Bébé
                    <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 shadow-xl border-t-2 border-t-primary">
                    <DropdownMenuItem asChild><Link href="/categorie/bebe/lait">Lait infantile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/bebe/soins">Soins bébé</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/bebe/maman">Soins maman</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/categorie/bebe/hygiene">Hygiène bébé</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="font-black text-primary"><Link href="/categorie/bebe">Tous les produits Bébé</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              <li><Link href="/marques" className="hover:text-primary transition-colors">Marques</Link></li>
              <li><Link href="/promotions" className="text-destructive font-black hover:opacity-80">Promotions</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </nav>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t absolute w-full shadow-lg z-50 h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4 space-y-6">
              <div className="relative w-full">
                <Input placeholder="Rechercher..." className="rounded-full pr-10" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <ul className="space-y-4 font-bold text-lg uppercase">
                <li><Link href="/categorie/sante" className="block py-2 border-b">Santé</Link></li>
                <li><Link href="/categorie/beaute" className="block py-2 border-b">Beauté</Link></li>
                <li><Link href="/categorie/hygiene" className="block py-2 border-b">Hygiène</Link></li>
                <li><Link href="/categorie/bebe" className="block py-2 border-b">Bébé</Link></li>
                <li><Link href="/marques" className="block py-2 border-b">Marques</Link></li>
                <li><Link href="/promotions" className="block py-2 border-b text-destructive">Promotions</Link></li>
                <li><Link href="/blog" className="block py-2 border-b">Blog</Link></li>
                <li><Link href="/contact" className="block py-2">Contact</Link></li>
              </ul>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
