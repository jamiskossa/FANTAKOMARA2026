
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  User, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronDown, 
  Clock, 
  FileText,
  LayoutDashboard,
  ClipboardList,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/providers/CartProvider';
import { useUser, useFirestore, useDoc, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  const auth = useAuth();
  const db = useFirestore();

  const userProfileRef = React.useMemo(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);
  const role = profile?.role || 'guest';
  const isStaff = role === 'admin' || role === 'collaborator' || role === 'collaborateur';
  const isAdmin = role === 'admin';
  const canShop = role === 'client' || role === 'guest';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleSignOut = () => {
    signOut(auth);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navigation = {
    sante: {
      label: 'Santé',
      href: '/categorie/sante',
      items: [
        { label: 'Compléments alimentaires', href: '/categorie/sante/complements' },
        { label: 'Forme & Vitalité', href: '/categorie/sante/forme' },
        { label: 'Sommeil & Stress', href: '/categorie/sante/sommeil' },
        { label: 'Digestion', href: '/categorie/sante/digestion' },
        { label: 'Articulations & Muscles', href: '/categorie/sante/articulations' },
        { label: 'Immunité', href: '/categorie/sante/immunite' },
        { label: 'Tous les produits Santé', href: '/categorie/sante' },
      ]
    },
    beaute: {
      label: 'Beauté',
      href: '/categorie/beaute',
      items: [
        { 
          label: 'Soins du visage', 
          href: '/categorie/beaute/visage',
          subItems: [
            { label: 'Anti-âge', href: '/categorie/beaute/visage/anti-age' },
            { label: 'Hydratation', href: '/categorie/beaute/visage/hydratation' },
            { label: 'Anti-imperfections', href: '/categorie/beaute/visage/imperfections' },
            { label: 'Tous les soins visage', href: '/categorie/beaute/visage' },
          ]
        },
        { label: 'Soins du corps', href: '/categorie/beaute/corps' },
        { label: 'Cheveux', href: '/categorie/beaute/cheveux' },
        { label: 'Solaires', href: '/categorie/beaute/solaires' },
        { label: 'Tous les produits Beauté', href: '/categorie/beaute' },
      ]
    },
    hygiene: {
      label: 'Hygiène',
      href: '/categorie/hygiene',
      items: [
        { label: 'Douche & Bain', href: '/categorie/hygiene/douche' },
        { label: 'Dentaire', href: '/categorie/hygiene/dentaire' },
        { label: 'Hygiène intime', href: '/categorie/hygiene/intime' },
        { label: 'Déodorants', href: '/categorie/hygiene/deodorants' },
        { label: 'Tous les produits Hygiène', href: '/categorie/hygiene' },
      ]
    },
    bebe: {
      label: 'Bébé',
      href: '/categorie/bebe',
      items: [
        { label: 'Lait infantile', href: '/categorie/bebe/lait' },
        { label: 'Soins bébé', href: '/categorie/bebe/soins' },
        { label: 'Soins maman', href: '/categorie/bebe/maman' },
        { label: 'Hygiène bébé', href: '/categorie/bebe/hygiene' },
        { label: 'Tous les produits Bébé', href: '/categorie/bebe' },
      ]
    }
  };

  return (
    <>
      {/* 1. Top Bar Légale */}
      <div className="bg-[#fff3cd] text-[#856404] py-2 text-center text-[9px] sm:text-[11px] font-bold tracking-wide px-4 z-[110] flex items-center justify-center gap-4">
        <p>⚠️ La réservation en ligne ne vaut pas délivrance. La dispensation est réalisée par un pharmacien diplômé en officine.</p>
        <a href="https://www.ansm.sante.fr" target="_blank" rel="noopener noreferrer" className="shrink-0">
          <Image 
            src="/images/logo-europeen.png" 
            alt="Logo européen pharmacie en ligne" 
            width={24} 
            height={24} 
            className="h-6 w-auto"
          />
        </a>
      </div>

      <header className="sticky top-0 z-[100] bg-white border-b shadow-sm">
        {/* 2. Main Header Bar */}
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group" onClick={closeMenu}>
              <div className="relative w-10 h-10 lg:w-14 lg:h-14">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo Pharmacie Nouvelle d'Ivry" 
                  fill 
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 40px, 56px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm lg:text-lg font-black text-slate-900 leading-none tracking-tighter uppercase">Pharmacie Nouvelle</span>
                <span className="text-[9px] lg:text-[13px] font-bold text-primary uppercase tracking-[0.1em]">d'Ivry</span>
              </div>
            </Link>

            {/* Barre de recherche centrale (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-2xl">
              <div className="relative w-full group">
                <Input 
                  placeholder="Rechercher un produit, une marque..." 
                  className="rounded-full pr-12 h-11 border-slate-200 focus-visible:ring-primary bg-slate-50/50 text-sm font-medium"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 text-slate-400">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Actions Icons (Compte, Panier, Services) */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Click & Collect Link (Desktop) */}
              <Link href="/click-collect" className="hidden xl:flex flex-col items-center group">
                <Clock className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500 mt-1">Click & Collect</span>
              </Link>

              {/* Scan Ordonnance Link (Desktop) */}
              <Link href="/scan-ordonnance" className="hidden xl:flex flex-col items-center group">
                <FileText className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500 mt-1">Ordonnance</span>
              </Link>

              {/* Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex flex-col h-auto py-1 px-2 items-center text-slate-600 hover:text-primary transition-colors group">
                    <User className="h-6 w-6 mb-0.5" />
                    <span className="text-[9px] font-bold uppercase tracking-tight leading-none hidden sm:block">Compte</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-xl border-slate-100">
                  {user ? (
                    <>
                      <div className="px-3 py-3 mb-1 bg-slate-50 rounded-lg">
                        <p className="text-[10px] font-black uppercase text-primary leading-none mb-1">Session Active</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                      </div>
                      <DropdownMenuItem asChild className="rounded-lg py-2 font-bold cursor-pointer text-xs">
                        <Link href="/compte">Mon profil patient</Link>
                      </DropdownMenuItem>
                      {isStaff && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="rounded-lg py-2 font-black text-secondary cursor-pointer text-xs">
                            <Link href="/collaborateur/dashboard">
                              <ClipboardList className="w-4 h-4 mr-2" /> Espace Préparateur
                            </Link>
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem asChild className="rounded-lg py-2 font-black text-primary cursor-pointer text-xs">
                              <Link href="/admin/dashboard">
                                <LayoutDashboard className="w-4 h-4 mr-2" /> Pilotage Admin
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="rounded-lg py-2 font-bold text-destructive cursor-pointer text-xs">
                        <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg py-2 font-black text-primary cursor-pointer text-xs">
                        <Link href="/login">Se connecter</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg py-2 font-black text-slate-600 cursor-pointer text-xs">
                        <Link href="/register">Créer un compte</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Panier */}
              {canShop && (
                <Link href="/panier" className="flex flex-col items-center text-slate-600 hover:text-primary relative transition-colors group px-2" onClick={closeMenu}>
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-destructive text-white text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-black shadow-sm">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-tight leading-none mt-1 hidden sm:block">Panier</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-slate-50 h-10 w-10 shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 3. Navigation Bar (Desktop) */}
        <nav className="hidden lg:block border-t bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-8 h-12">
              <Link href="/" className="text-[11px] font-black uppercase tracking-widest text-slate-700 hover:text-primary transition-colors">Accueil</Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-700 hover:text-primary transition-colors outline-none h-full border-b-2 border-transparent hover:border-primary">
                  Catalogue <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  {Object.entries(navigation).map(([key, cat]) => (
                    <DropdownMenuItem key={key} asChild className="rounded-lg py-2.5 font-bold text-slate-700 cursor-pointer text-xs">
                      <Link href={cat.href} onClick={closeMenu}>{cat.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/contact" className="text-[11px] font-black uppercase tracking-widest text-slate-700 hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </nav>

        {/* 4. Mobile Navigation Drawer */}
        {mounted && isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[100px] sm:top-[120px] bg-white z-[99] h-[calc(100vh-100px)] overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6 space-y-8 pb-20">
              {/* Barre de recherche mobile */}
              <div className="relative group mb-6">
                <Input 
                  placeholder="Rechercher..." 
                  className="rounded-full pr-10 h-10 border-slate-200 bg-slate-50 text-sm"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 text-slate-400">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Menu Accordion */}
              <Accordion type="single" collapsible className="w-full space-y-2">
                {Object.entries(navigation).map(([key, cat]) => (
                  <AccordionItem key={key} value={key} className="border-none">
                    <AccordionTrigger className="text-[12px] font-black uppercase tracking-tighter text-slate-900 py-3 hover:no-underline">
                      {cat.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pl-4 space-y-3">
                      {cat.items.map((item, i) => (
                        <div key={i} className="space-y-2">
                          <Link 
                            href={item.href} 
                            onClick={closeMenu}
                            className={`block text-[11px] font-bold ${'subItems' in item ? 'text-primary' : 'text-slate-600'}`}
                          >
                            {item.label}
                          </Link>
                          {('subItems' in item) && (
                            <div className="pl-4 space-y-2 border-l border-slate-100 mt-2">
                              {item.subItems?.map((sub, si) => (
                                <Link 
                                  key={si} 
                                  href={sub.href} 
                                  onClick={closeMenu}
                                  className="block text-[10px] font-medium text-slate-500 hover:text-primary"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Liens Directs Mobiles */}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                <Link href="/marques" onClick={closeMenu} className="text-[12px] font-black uppercase tracking-tighter text-slate-900">Marques</Link>
                <Link href="/promotions" onClick={closeMenu} className="text-[12px] font-black uppercase tracking-tighter text-destructive">Promotions</Link>
                <Link href="/blog" onClick={closeMenu} className="text-[12px] font-black uppercase tracking-tighter text-slate-900">Blog</Link>
                <Link href="/contact" onClick={closeMenu} className="text-[12px] font-black uppercase tracking-tighter text-slate-900">Contact</Link>
              </div>

              {/* Services Rapides Mobiles */}
              <div className="grid grid-cols-2 gap-3 pt-8">
                <Button asChild variant="outline" className="rounded-xl h-16 flex flex-col gap-1 border-slate-100 bg-slate-50 shadow-none">
                  <Link href="/click-collect" onClick={closeMenu}>
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black uppercase">Retrait 2h</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl h-16 flex flex-col gap-1 border-slate-100 bg-slate-50 shadow-none">
                  <Link href="/scan-ordonnance" onClick={closeMenu}>
                    <FileText className="h-5 w-5 text-secondary" />
                    <span className="text-[10px] font-black uppercase">Ordonnance</span>
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
