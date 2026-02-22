"use client";

import React, { useState, useEffect } from 'react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      <div className="bg-[#002d5c] text-white py-1.5 text-center text-xs sm:text-sm font-bold tracking-tight">
        <p>HAPPY DAYS ! -10% , -15%, -20% à partir de 99€, 149€ et 199€ avec les codes HAPPY10, HAPPY15 et HAPPY20 !</p>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-6 lg:gap-12">
            <Link href="/" className="flex flex-col items-start shrink-0">
              <span className="text-xl lg:text-2xl font-black text-primary leading-none tracking-tighter uppercase">Pharmacie Nouvelle</span>
              <span className="text-sm lg:text-base font-bold text-secondary uppercase tracking-widest">d'Ivry</span>
            </Link>

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

        {mounted && (
          <nav className="hidden lg:block border-t bg-white">
            <div className="container mx-auto px-4">
              <ul className="flex items-center justify-center space-x-8 py-3 text-sm font-bold uppercase tracking-wide">
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group py-1">
                      {navigationData.sante.label}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 shadow-xl border-t-2 border-t-primary">
                      {navigationData.sante.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="font-black text-primary">
                        <Link href={navigationData.sante.allHref}>Tous les produits Santé</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group py-1">
                      {navigationData.beaute.label}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 shadow-xl border-t-2 border-t-primary">
                      {navigationData.beaute.subCategories.map((sub) => (
                        <DropdownMenuSub key={sub.label}>
                          <DropdownMenuSubTrigger className="flex items-center justify-between">
                            {sub.label}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-64 p-2">
                              {sub.links.map((link) => (
                                <DropdownMenuItem key={link.href} asChild className={link.highlight ? "text-secondary font-bold" : ""}>
                                  <Link href={link.href}>{link.label}</Link>
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild className="font-bold">
                                <Link href={sub.allHref}>Tous les soins visage</Link>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      ))}
                      {navigationData.beaute.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="font-black text-primary">
                        <Link href={navigationData.beaute.allHref}>Tous les produits Beauté</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group py-1">
                      {navigationData.hygiene.label}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 shadow-xl border-t-2 border-t-primary">
                      {navigationData.hygiene.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="font-black text-primary">
                        <Link href={navigationData.hygiene.allHref}>Tous les produits Hygiène</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>

                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-primary transition-colors outline-none group py-1">
                      {navigationData.bebe.label}
                      <ChevronDown className="ml-1 h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 shadow-xl border-t-2 border-t-primary">
                      {navigationData.bebe.links.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="font-black text-primary">
                        <Link href={navigationData.bebe.allHref}>Tous les produits Bébé</Link>
                      </DropdownMenuItem>
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
        )}

        {mounted && isMenuOpen && (
          <div className="lg:hidden bg-white border-t absolute w-full shadow-lg z-50 h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4 space-y-6">
              <div className="relative w-full">
                <Input placeholder="Rechercher..." className="rounded-full pr-10 h-12 border-2 border-accent" />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sante" className="border-b">
                  <AccordionTrigger className="text-lg font-black uppercase tracking-tight py-4">
                    {navigationData.sante.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-3 pl-4">
                      {navigationData.sante.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-slate-600 font-bold block" onClick={() => setIsMenuOpen(false)}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2">
                        <Link href={navigationData.sante.allHref} className="text-primary font-black block" onClick={() => setIsMenuOpen(false)}>
                          Tous les produits Santé
                        </Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="beaute" className="border-b">
                  <AccordionTrigger className="text-lg font-black uppercase tracking-tight py-4">
                    {navigationData.beaute.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-6 pl-4">
                      {navigationData.beaute.subCategories.map((sub) => (
                        <div key={sub.label}>
                          <p className="text-sm font-black text-secondary uppercase tracking-widest mb-3">{sub.label}</p>
                          <ul className="space-y-3 pl-2">
                            {sub.links.map((link) => (
                              <li key={link.href}>
                                <Link 
                                  href={link.href} 
                                  className={`block ${link.highlight ? "text-secondary font-black" : "text-slate-600 font-bold"}`}
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div>
                        <ul className="space-y-3">
                          {navigationData.beaute.links.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} className="text-slate-600 font-bold block" onClick={() => setIsMenuOpen(false)}>
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <li className="pt-2 list-none">
                        <Link href={navigationData.beaute.allHref} className="text-primary font-black block" onClick={() => setIsMenuOpen(false)}>
                          Tous les produits Beauté
                        </Link>
                      </li>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hygiene" className="border-b">
                  <AccordionTrigger className="text-lg font-black uppercase tracking-tight py-4">
                    {navigationData.hygiene.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-3 pl-4">
                      {navigationData.hygiene.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-slate-600 font-bold block" onClick={() => setIsMenuOpen(false)}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2">
                        <Link href={navigationData.hygiene.allHref} className="text-primary font-black block" onClick={() => setIsMenuOpen(false)}>
                          Tous les produits Hygiène
                        </Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bebe" className="border-b">
                  <AccordionTrigger className="text-lg font-black uppercase tracking-tight py-4">
                    {navigationData.bebe.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-3 pl-4">
                      {navigationData.bebe.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-slate-600 font-bold block" onClick={() => setIsMenuOpen(false)}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2">
                        <Link href={navigationData.bebe.allHref} className="text-primary font-black block" onClick={() => setIsMenuOpen(false)}>
                          Tous les produits Bébé
                        </Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <ul className="space-y-6 pt-4">
                <li><Link href="/marques" className="block text-lg font-black uppercase tracking-tight" onClick={() => setIsMenuOpen(false)}>Marques</Link></li>
                <li><Link href="/promotions" className="block text-lg font-black uppercase tracking-tight text-destructive" onClick={() => setIsMenuOpen(false)}>Promotions</Link></li>
                <li><Link href="/blog" className="block text-lg font-black uppercase tracking-tight" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
                <li><Link href="/contact" className="block text-lg font-black uppercase tracking-tight" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
              </ul>

              <div className="grid grid-cols-1 gap-3 pt-6 border-t">
                <Button asChild variant="outline" className="rounded-full border-primary text-primary font-black uppercase text-xs h-12 shadow-sm">
                  <Link href="/click-collect" onClick={() => setIsMenuOpen(false)}>
                    <Clock className="w-4 h-4 mr-2" />
                    Click & Collect
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-secondary text-secondary font-black uppercase text-xs h-12 shadow-sm">
                  <Link href="/scan-ordonnance" onClick={() => setIsMenuOpen(false)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Scan Ordonnance
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
