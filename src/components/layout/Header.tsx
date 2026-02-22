"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingCart, Menu, X, LayoutDashboard, ClipboardList, LogOut, Phone } from 'lucide-react';
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
  const isStaff = role === 'admin' || role === 'collaborator';
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

  const navLinks = [
    { label: 'Santé', href: '/categorie/sante' },
    { label: 'Beauté', href: '/categorie/beaute' },
    { label: 'Hygiène', href: '/categorie/hygiene' },
    { label: 'Bébé', href: '/categorie/bebe' },
    { label: 'Marques', href: '/marques' },
    { label: 'Promos', href: '/promotions', highlight: true },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary text-white py-1 text-center text-[8px] sm:text-[10px] font-black tracking-widest px-4 uppercase h-6 flex items-center justify-center shrink-0 z-[110]">
        <p>Retrait gratuit en 2h • Livraison offerte dès 49€</p>
      </div>

      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b shadow-sm h-14 sm:h-20 flex flex-col justify-center shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative w-8 h-8 lg:w-12 lg:h-12 rounded-xl overflow-hidden border-2 border-slate-100 p-0.5 bg-white shadow-soft transition-all group-hover:border-primary/20 shrink-0">
                <Image 
                  src="https://picsum.photos/seed/ph-logo/200/200" 
                  alt="Logo PNI" 
                  fill 
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 32px, 48px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] lg:text-[16px] font-black text-slate-900 leading-none tracking-tighter uppercase">Pharmacie Nouvelle</span>
                <span className="text-[7px] lg:text-[12px] font-bold text-primary uppercase tracking-[0.1em]">d'Ivry</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`transition-colors ${link.highlight ? 'text-destructive hover:text-destructive/80' : 'text-slate-600 hover:text-primary'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search (Desktop) - Hidden on small screens to avoid crowding */}
            <div className="hidden lg:flex flex-1 max-w-[200px] xl:max-w-xs mx-2">
              <div className="relative w-full group">
                <Input 
                  placeholder="Rechercher..." 
                  className="rounded-full pr-10 h-10 border-slate-200 focus-visible:ring-primary bg-slate-50/50 text-xs font-bold"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 text-slate-400">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex flex-col h-auto py-1 px-2 items-center text-slate-600 hover:text-primary transition-colors group">
                    <User className="h-5 w-5 mb-0.5" />
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest leading-none">Compte</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl border-slate-100">
                  {user ? (
                    <>
                      <div className="px-3 py-4 mb-1 bg-slate-50 rounded-xl">
                        <p className="text-[9px] font-black uppercase text-primary leading-none mb-1.5">Session Active</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-full tracking-widest">
                          Rôle : {role}
                        </span>
                      </div>
                      <DropdownMenuItem asChild className="rounded-lg py-2.5 font-bold cursor-pointer text-xs">
                        <Link href="/compte">Mon profil patient</Link>
                      </DropdownMenuItem>
                      
                      {isStaff && (
                        <>
                          <DropdownMenuSeparator />
                          <p className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Outils Officine</p>
                          <DropdownMenuItem asChild className="rounded-lg py-2.5 font-black text-secondary cursor-pointer text-xs">
                            <Link href="/collaborateur/dashboard">
                              <ClipboardList className="w-4 h-4 mr-2" /> Espace Préparateur
                            </Link>
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem asChild className="rounded-lg py-2.5 font-black text-primary cursor-pointer text-xs">
                              <Link href="/admin/dashboard">
                                <LayoutDashboard className="w-4 h-4 mr-2" /> Pilotage Admin
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      
                      {!isStaff && (
                        <DropdownMenuItem asChild className="rounded-lg py-2.5 font-bold cursor-pointer text-xs">
                          <Link href="/client/dashboard">Mes réservations</Link>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="rounded-lg py-2.5 font-bold text-destructive cursor-pointer text-xs">
                        <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg py-2.5 font-black text-primary cursor-pointer text-xs">
                        <Link href="/login">Se connecter</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg py-2.5 font-bold cursor-pointer text-xs">
                        <Link href="/register">Créer un compte</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Shopping Cart (Clients Only) */}
              {canShop && (
                <Button variant="ghost" size="sm" className="flex flex-col h-auto py-1 px-2 items-center text-slate-600 hover:text-primary relative transition-colors group" asChild>
                  <Link href="/panier">
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5 mb-0.5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-destructive text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-black shadow-sm">
                          {itemCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest leading-none">Panier</span>
                  </Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="xl:hidden rounded-full hover:bg-slate-50 h-10 w-10 shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mounted && isMenuOpen && (
          <div className="xl:hidden fixed inset-0 top-14 sm:top-20 bg-white z-[99] h-[calc(100vh-56px)] overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-8 flex flex-col h-full">
              <div className="mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Menu principal</p>
                <ul className="space-y-6">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href} 
                        className={`block text-xl font-black uppercase tracking-tighter ${link.highlight ? 'text-destructive' : 'text-slate-900'}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Besoin d'aide ?</p>
                <div className="flex flex-col gap-4">
                  <a href="tel:0146711234" className="flex items-center gap-4 text-slate-900 font-black uppercase text-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    01 46 71 12 34
                  </a>
                  <Button asChild className="rounded-full bg-slate-900 font-black uppercase tracking-widest text-[10px] h-12">
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Envoyer un message</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
