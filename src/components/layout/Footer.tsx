
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Send, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const db = useFirestore();

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        subscribedAt: serverTimestamp()
      });
      toast({
        title: "Inscription réussie",
        description: "Bienvenue dans notre newsletter ! Votre code promo arrive par mail.",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-muted text-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 lg:p-12 shadow-sm border mb-16 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-primary uppercase mb-4 tracking-tight">Inscrivez-vous à notre newsletter</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Recevez <span className="text-secondary font-bold">-10%*</span> sur votre prochain achat dès 40€ d'achat.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={handleNewsletter}>
            <Input 
              type="email" 
              placeholder="Votre adresse email" 
              className="rounded-full h-12 px-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "S'inscrire"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground mt-4">
            *Code envoyé par email après inscription. Hors promotions et frais de livraison.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-primary uppercase tracking-wider">Nos catégories</h4>
            <ul className="space-y-3">
              <li><Link href="/categorie/sante" className="text-muted-foreground hover:text-primary transition-colors">Santé</Link></li>
              <li><Link href="/categorie/beaute" className="text-muted-foreground hover:text-primary transition-colors">Beauté</Link></li>
              <li><Link href="/categorie/hygiene" className="text-muted-foreground hover:text-primary transition-colors">Hygiène</Link></li>
              <li><Link href="/categorie/bebe" className="text-muted-foreground hover:text-primary transition-colors">Bébé</Link></li>
              <li><Link href="/marques" className="text-muted-foreground hover:text-primary transition-colors">Toutes les marques</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-primary uppercase tracking-wider">Nos services</h4>
            <ul className="space-y-3">
              <li><Link href="/click-collect" className="text-muted-foreground hover:text-primary transition-colors">Click & Collect – Retrait 2h</Link></li>
              <li><Link href="/scan-ordonnance" className="text-muted-foreground hover:text-primary transition-colors">Scan Ordonnance</Link></li>
              <li><Link href="/livraison" className="text-muted-foreground hover:text-primary transition-colors">Livraison à domicile</Link></li>
              <li><Link href="/conseils" className="text-muted-foreground hover:text-primary transition-colors">Conseils personnalisés</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ / Aide</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-primary uppercase tracking-wider">À propos</h4>
            <ul className="space-y-3">
              <li><Link href="/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors">Mentions légales</Link></li>
              <li><Link href="/cgv" className="text-muted-foreground hover:text-primary transition-colors">Conditions Générales de Vente</Link></li>
              <li><Link href="/confidentialite" className="text-muted-foreground hover:text-primary transition-colors">Confidentialité</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Nous contacter</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-primary uppercase tracking-wider">Contactez-nous</h4>
            <div className="space-y-4 text-muted-foreground">
              <p className="font-medium text-foreground">Pharmacie Nouvelle d'Ivry</p>
              <p>40 Rue Marat<br />94200 Ivry-sur-Seine</p>
              <p>Tél : 01 46 71 12 34</p>
              <p>Lun - Sam : 09:00 - 20:00</p>
              <div className="flex space-x-4 pt-2">
                <Link href="#" className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6 text-muted-foreground">
             <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              <span className="text-xs font-medium">Paiement sécurisé</span>
            </div>
            <div className="flex space-x-3 opacity-50">
              <div className="w-8 h-5 bg-foreground/20 rounded"></div>
              <div className="w-8 h-5 bg-foreground/20 rounded"></div>
              <div className="w-8 h-5 bg-foreground/20 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Pharmacie Nouvelle d'Ivry – Tous droits réservés.
            </p>
            <span className="hidden md:block w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              Site créé par Yattara Ousmane
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
