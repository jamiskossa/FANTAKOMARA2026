
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingCart, Menu, X, LayoutDashboard, ClipboardList, LogOut } from 'lucide-react';
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

  return (
    <>
      <div className="bg-secondary text-white py-1 text-center text-[8px] sm:text-[10px] font-black tracking-widest px-4 uppercase h-6 flex items-center justify-center shrink-0">
        <p>Retrait gratuit en 2h • Livraison offerte dès 49€</p>
      </div>

      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b shadow-sm h-14 sm:h-16 flex items-center shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-2 h-full">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-xl overflow-hidden border-2 border-slate-100 p-0.5 bg-white shadow-soft transition-all group-hover:border-primary/20 shrink-0">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo PNI" 
                  fill 
                  className="object-contain"
                  priority
                  sizes="40px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://picsum.photos/seed/ph-logo/200/200";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] lg:text-[13px] font-black text-slate-900 leading-none tracking-tighter uppercase">Pharmacie Nouvelle</span>
                <span className="text-[6px] lg:text-[10px] font-bold text-primary uppercase tracking-[0.1em]">d'Ivry</span>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full group">
                <Input 
                  placeholder="Produit, marque..." 
                  className="rounded-full pr-10 h-9 border-slate-200 focus-visible:ring-primary bg-slate-50/50 text-xs"
                />
                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-7 w-7 text-slate-400">
                  <Search className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex flex-col h-auto py-1 px-2 items-center text-slate-600 hover:text-primary transition-colors group">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5" />
                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest leading-none">Compte</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100">
                  {user ? (
                    <>
                      <div className="px-2 py-3 mb-1 bg-slate-50 rounded-xl">
                        <p className="text-[9px] font-black uppercase text-primary leading-none mb-1">Session Active</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-full tracking-widest">
                          {role}
                        </span>
                      </div>
                      <DropdownMenuItem asChild className="rounded-lg py-2 font-bold cursor-pointer text-xs">
                        <Link href="/compte">Mon profil</Link>
                      </DropdownMenuItem>
                      
                      {isStaff && (
                        <>
                          <DropdownMenuSeparator />
                          <p className="px-2 py-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Outils Officine</p>
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
                      
                      {!isStaff && (
                        <DropdownMenuItem asChild className="rounded-lg py-2 font-bold cursor-pointer text-xs">
                          <Link href="/client/dashboard">Mes réservations</Link>
                        </DropdownMenuItem>
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
                      <DropdownMenuItem asChild className="rounded-lg py-2 font-bold cursor-pointer text-xs">
                        <Link href="/register">Créer un compte</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {canShop && (
                <Button variant="ghost" size="sm" className="flex flex-col h-auto py-1 px-2 items-center text-slate-600 hover:text-primary relative transition-colors group" asChild>
                  <Link href="/panier">
                    <div className="relative">
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-white text-[7px] rounded-full h-3 w-3 flex items-center justify-center font-black">
                          {itemCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest leading-none">Panier</span>
                  </Link>
                </Button>
              )}

              <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-slate-50 h-8 w-8 shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {mounted && isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-14 bg-white z-[99] h-[calc(100vh-56px)] overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6 space-y-6">
              <ul className="space-y-6 pt-4">
                <li><Link href="/categorie/sante" className="block text-[10px] font-black uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Santé</Link></li>
                <li><Link href="/categorie/beaute" className="block text-[10px] font-black uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Beauté</Link></li>
                <li><Link href="/marques" className="block text-[10px] font-black uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Nos Marques</Link></li>
                <li><Link href="/promotions" className="block text-[10px] font-black uppercase tracking-widest text-destructive" onClick={() => setIsMenuOpen(false)}>Promotions</Link></li>
                <li><Link href="/contact" className="block text-[10px] font-black uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
              </ul>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
