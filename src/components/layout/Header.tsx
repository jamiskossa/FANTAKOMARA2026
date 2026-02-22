"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/providers/CartProvider';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { itemCount } = useCart();
  const { user } = useUser();
  const db = useFirestore();

  const userProfileRef = React.useMemo(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);
  const role = profile?.role || 'guest';
  const canShop = role === 'client' || role === 'guest';

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationData = {
    sante: {
      label: "Santé",
      links: [
        { label: "Compléments alimentaires", href: "/categorie/sante/complements" },
        { label: "Forme & Vitalité", href: "/categorie/sante/forme" },
        { label: "Sommeil & Stress", href: "/categorie/sante/sommeil" },
        { label: "Digestion", href: "/categorie/sante/digestion" },
        { label: "Articulations & Muscles", href: "/categorie/sante/articulations" },
        { label: "Immunité", href: "/categorie/sante/immunite" },
      ],
      allHref: "/categorie/sante"
    },
    beaute: {
      label: "Beauté",
      subCategories: [
        {
          label: "Soins du visage",
          links: [
            { label: "Anti-âge", href: "/categorie/beaute/visage/anti-age" },
            { label: "Hydratation", href: "/categorie/beaute/visage/hydratation" },
            { label: "Anti-imperfections", href: "/categorie/beaute/visage/anti-imperfections" },
            { label: "Nettoyants & Démaquillants", href: "/categorie/beaute/visage/nettoyants-demaquillants", highlight: true },
          ],
          allHref: "/categorie/beaute/visage"
        }
      ],
      links: [
        { label: "Soins du corps", href: "/categorie/beaute/corps" },
        { label: "Cheveux", href: "/categorie/beaute/cheveux" },
        { label: "Solaires", href: "/categorie/beaute/solaires" },
      ],
      allHref: "/categorie/beaute"
    },
    hygiene: {
      label: "Hygiène",
      links: [
        { label: "Douche & Bain", href: "/categorie/hygiene/douche" },
        { label: "Dentaire", href: "/categorie/hygiene/dentaire" },
        { label: "Hygiène intime", href: "/categorie/hygiene/intime" },
        { label: "Déodorants", href: "/categorie/hygiene/deodorants" },
      ],
      allHref: "/categorie/hygiene"
    },
    bebe: {
      label: "Bébé",
      links: [
        { label: "Lait infantile", href: "/categorie/bebe/lait" },
        { label: "Soins bébé", href: "/categorie/bebe/soins" },
        { label: "Soins maman", href: "/categorie/bebe/maman" },
        { label: "Hygiène bébé", href: "/categorie/bebe/hygiene" },
      ],
      allHref: "/categorie/bebe"
    }
  };

  return (
    <>
      <div className="bg-secondary text-white py-1.5 text-center text-[10px] sm:text-xs font-black tracking-widest px-4 uppercase">
        <p>Retrait en pharmacie gratuit en 2h • Livraison offerte dès 49€</p>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl overflow-hidden border-2 border-slate-100 p-1 bg-white shadow-soft transition-all group-hover:border-primary/20 group-hover:scale-105">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image 
                    src="/images/logo.png" 
                    alt="Logo Pharmacie Nouvelle d'Ivry" 
                    fill 
                    className="object-contain"
                    onError={(e) => {
                      // Fallback if user hasn't added the logo yet
                      const target = e.target as HTMLImageElement;
                      target.src = "https://picsum.photos/seed/ph-logo/200/200";
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm lg:text-lg font-black text-slate-900 leading-none tracking-tighter uppercase">Pharmacie Nouvelle</span>
                <span className="text-[10px] lg:text-[12px] font-bold text-primary uppercase tracking-[0.1em]">d'Ivry</span>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full group">
                <Input 
                  placeholder="Rechercher un produit..." 
                  className="rounded-full pr-12 h-10 border-slate-200 focus-visible:ring-primary transition-all bg-slate-50/50 text-sm"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 text-slate-400">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-1 lg:space-x-2">
              <Button variant="ghost" size="sm" className="flex flex-col h-auto py-1 px-3 items-center text-slate-600 hover:text-primary transition-colors group" asChild>
                <Link href="/compte">
                  <User className="h-5 w-5 mb-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Compte</span>
                </Link>
              </Button>
              
              {canShop && (
                <Button variant="ghost" size="sm" className="flex flex-col h-auto py-1 px-3 items-center text-slate-600 hover:text-primary relative transition-colors group" asChild>
                  <Link href="/panier">
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5 mb-0.5 group-hover:scale-110 transition-transform" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-white text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-black">
                          {itemCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest">Panier</span>
                  </Link>
                </Button>
              )}

              <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-slate-50 h-9 w-9" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {mounted && (
          <nav className="hidden lg:block border-t bg-white">
            <div className="container mx-auto px-4">
              <ul className="flex items-center justify-center space-x-10 py-2 text-[10px] font-black uppercase tracking-[0.1em]">
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group">
                      {navigationData.sante.label}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 shadow-2xl border-t-4 border-t-primary rounded-xl">
                      {navigationData.sante.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild className="rounded-lg font-bold">
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="font-black text-primary rounded-lg">
                        <Link href={navigationData.sante.allHref}>Tous les produits Santé</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group">
                      {navigationData.beaute.label}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 shadow-2xl border-t-4 border-t-primary rounded-xl">
                      {navigationData.beaute.subCategories.map((sub) => (
                        <DropdownMenuSub key={sub.label}>
                          <DropdownMenuSubTrigger className="flex items-center justify-between font-bold rounded-lg">
                            {sub.label}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-64 p-2 rounded-xl shadow-2xl">
                              {sub.links.map((link) => (
                                <DropdownMenuItem key={link.href} asChild className={link.highlight ? "text-secondary font-black rounded-lg" : "font-bold rounded-lg"}>
                                  <Link href={link.href}>{link.label}</Link>
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild className="font-black rounded-lg">
                                <Link href={sub.allHref}>Tous les soins visage</Link>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      ))}
                      {navigationData.beaute.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild className="font-bold rounded-lg">
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="font-black text-primary rounded-lg">
                        <Link href={navigationData.beaute.allHref}>Tous les produits Beauté</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group">
                      {navigationData.hygiene.label}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 shadow-2xl border-t-4 border-t-primary rounded-xl">
                      {navigationData.hygiene.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild className="font-bold rounded-lg">
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="font-black text-primary rounded-lg">
                        <Link href={navigationData.hygiene.allHref}>Tous les produits Hygiène</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group">
                      {navigationData.bebe.label}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 shadow-2xl border-t-4 border-t-primary rounded-xl">
                      {navigationData.bebe.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild className="font-bold rounded-lg">
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="font-black text-primary rounded-lg">
                        <Link href={navigationData.bebe.allHref}>Tous les produits Bébé</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                <li><Link href="/marques" className="hover:text-primary transition-colors">Marques</Link></li>
                <li><Link href="/promotions" className="text-destructive font-black hover:opacity-80">Promotions</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </nav>
        )}

        {mounted && isMenuOpen && (
          <div className="lg:hidden bg-white border-t absolute w-full shadow-2xl z-50 h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="relative w-full">
                <Input placeholder="Rechercher..." className="rounded-full pr-10 h-12 border-slate-200 bg-slate-50 font-bold text-sm" />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sante" className="border-b-slate-50">
                  <AccordionTrigger className="text-base font-black uppercase py-4 hover:no-underline">
                    {navigationData.sante.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-4 pl-4">
                      {navigationData.sante.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-slate-500 font-bold block text-sm" onClick={() => setIsMenuOpen(false)}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="beaute" className="border-b-slate-50">
                  <AccordionTrigger className="text-base font-black uppercase py-4 hover:no-underline">
                    {navigationData.beaute.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-6 pl-4">
                      {navigationData.beaute.subCategories.map((sub) => (
                        <div key={sub.label}>
                          <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3">{sub.label}</p>
                          <ul className="space-y-4 pl-2">
                            {sub.links.map((link) => (
                              <li key={link.href}>
                                <Link 
                                  href={link.href} 
                                  className={`block font-bold text-sm ${link.highlight ? "text-secondary" : "text-slate-500"}`}
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <ul className="space-y-6 pt-4">
                <li><Link href="/marques" className="block text-base font-black uppercase" onClick={() => setIsMenuOpen(false)}>Nos Marques</Link></li>
                <li><Link href="/promotions" className="block text-base font-black uppercase text-destructive" onClick={() => setIsMenuOpen(false)}>Promotions</Link></li>
                <li><Link href="/contact" className="block text-base font-black uppercase" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
              </ul>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
