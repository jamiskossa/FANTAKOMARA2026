"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, MapPin, Phone, ShieldCheck, Truck, Headphones, Mail } from 'lucide-react';

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0-9'];

const brandsByLetter: Record<string, string[]> = {
  A: ['A-DERMA', 'A-LAB', 'ABOCA', 'ACM', 'ACTIPOCHE', 'ACUVUE', 'AIR COOLER', 'AKILDIA', 'AKILEÏNE', 'AKILENJUR', 'ALGOLOGIE', 'ALODONT', 'ALPHANOVA', 'ALPINE', 'ALVADIEM', 'ALVEOLYS', 'ALVITYL', 'ALWAYS', 'AMILAB', 'ANTIPODES', 'ANUA', 'APAISYL', 'APHTAVÉA', 'APIVITA', 'ARAGAN', 'ARGILETZ', 'ARKOPHARMA', 'ARNICAN', 'ARNIDOL', 'ARRÊBUM', 'ARTERIN', 'ARTHRODONT', 'ASCAFLASH', 'ASSANIS', 'ASSY 2000', 'AUDISTIM', 'AVÈNE', 'AVENT', 'AVRIL'],
  B: ['B.SLIM', 'BABYBIO', 'BABYLENA', 'BAILLEUL', 'BAUME DU TIGRE', 'BAUSCH + LOMB', 'BCOMBIO', 'BEAUTERRA', 'BEAUTY OF JOSEON', 'BELLA BABY', 'BELLOC', 'BEPANTHEN', 'BEROCCA', 'BESINS HEALTHCARE', 'BI-OIL', 'BIOCYTE', 'BIODANCE', 'BIODERMA', 'BIOFLORAL', 'BIOFREEZE', 'BIOGAIA', 'BION3', 'BIOSTIME', 'BIOSYNEX', 'BIOTHERM', 'BIOTRUE', 'BLÉDINA', 'BOIRON', 'BONJOUR DRINK', 'BOSTON', 'BOTOT', 'BRAUN', 'BREATH RIGHT', 'BYOMAG'],
  C: ['CALMOSINE', 'CAPSTAR', 'CARMEX', 'CASSANDRA', 'CATTIER', 'CAUDALIE', 'CAVAILLÈS', 'CB12', 'CELLULYSSE', 'CERAVE', 'CETAPHIL', 'CEVA', 'CHRONODORM', 'CIBLE SKIN', 'CICABIAFINE', 'CICADIANE', 'CICALEÏNE', 'CICAMANUKA', 'CICATRIDINE', 'CICATRYL', 'CINQ SUR CINQ', 'CLARINS', 'CLEARBLUE', 'CLEDIST', 'CLÉMENT THÉKAN', 'CLINIQUE', 'CLINOMYN', 'CODIFRA', 'COLGATE', 'COLLINES DE PROVENCE', 'COMPEED', 'CONDENSÉ PARIS', 'COOPER', 'COREGA', 'CORVITEC', 'COSRX', 'COTOCOUCHE', 'COTTONY', 'COUP D\'ECLAT', 'CRINEX', 'CURAPROX', 'CYSTIPHANE'],
  D: ['DARPHIN', 'DASIQUE', 'DELABARRE', 'DEMAK UP', 'DENSMORE', 'DENTARGILE', 'DENTISMILE', 'DÉOROCHE', 'DEPARAZ', 'DERGAM', 'DERMACEUTIC', 'DERMAGOR', 'DERMATIX', 'DERMINA', 'DERMOPHIL', 'DEVA', 'DEXERYL', 'DEXSIL', 'DIELEN', 'DIETWORLD', 'DIM', 'DIOPTEC', 'DISSOLVUROL', 'DOCTEUR B', 'DOCTEUR VALNET', 'DODIE', 'DONACLIM', 'DONALIS', 'DR JART', 'DR. HAUSCHKA', 'DRONTAL', 'DUCRAY', 'DULCOSOFT', 'DUNLOP TRAVEL', 'DUO LP-PRO', 'DUOFILM', 'DUREX'],
  // Placeholders pour les autres lettres
  E: ['Eucerin', 'Elgydium', 'Erborian'],
  F: ['Filorga', 'Furterer'],
  G: ['Garancia', 'Gallia'],
  L: ['La Roche-Posay', 'Lierac'],
  N: ['Nuxe', 'Noreva'],
  S: ['SVR', 'Sanoflore'],
  U: ['Uriage', 'Ucerin'],
  V: ['Vichy', 'Valnet'],
  W: ['Weleda', 'Waterwipes'],
};

export function MarquesSection() {
  const [activeLetter, setActiveLetter] = useState<string | null>('A');

  return (
    <section className="py-24 bg-fluid-gradient border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            Retrouvez toutes vos marques préférées
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            Votre Pharmacie Nouvelle d'Ivry vous propose les plus grandes marques de parapharmacie en Santé, Beauté, Hygiène et Bébé
          </p>
        </div>

        <div className="bg-white rounded-[40px] p-8 lg:p-16 shadow-2xl shadow-primary/5 border border-slate-100">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2 block">Index alphabétique</span>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              RECHERCHER PARMI NOS <span className="text-primary">594 MARQUES</span>
            </h3>
          </div>

          {/* Index alphabétique */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  activeLetter === letter 
                  ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' 
                  : 'bg-slate-50 text-slate-400 hover:bg-accent hover:text-primary'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Liste des marques par lettre */}
          <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeLetter && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4">
                <div className="col-span-full border-b border-slate-100 pb-4 mb-8">
                  <h4 className="text-4xl font-black text-primary">{activeLetter}</h4>
                </div>
                {brandsByLetter[activeLetter]?.length > 0 ? (
                  brandsByLetter[activeLetter].map(brand => (
                    <Link 
                      key={brand} 
                      href={`/marques#${brand.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-slate-600 hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-slate-200 rounded-full mr-3 group-hover:bg-primary transition-colors"></span>
                      {brand}
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full text-slate-400 font-medium italic">Aucune marque répertoriée pour cette lettre actuellement.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Services Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
          {[
            { icon: Clock, title: "Retrait en pharmacie en 2h", desc: "Service Click & Collect gratuit" },
            { icon: Truck, title: "Livraison à domicile", desc: "Expédition rapide dans toute la France" },
            { icon: ShieldCheck, title: "Paiement 100% sécurisé", desc: "Protection 3D Secure & SSL" },
            { icon: Headphones, title: "Conseils d'experts", desc: "Pharmaciens à votre écoute" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-8 bg-white rounded-[32px] border border-slate-100 shadow-soft">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-secondary mb-6">
                <item.icon className="w-8 h-8" />
              </div>
              <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-2">{item.title}</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer-like Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-24 pt-24 border-t border-slate-100">
          <div className="space-y-8">
            <div>
              <h4 className="text-primary font-black uppercase tracking-widest text-sm mb-6 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> MA PHARMACIE
              </h4>
              <div className="space-y-2 text-slate-600 font-bold">
                <p className="text-lg text-slate-900">Pharmacie Nouvelle d'Ivry</p>
                <p>40 Rue Marat</p>
                <p>94200 Ivry-sur-Seine</p>
              </div>
            </div>
            <div>
              <h4 className="text-primary font-black uppercase tracking-widest text-sm mb-6 flex items-center">
                <Phone className="w-4 h-4 mr-2" /> CONTACT
              </h4>
              <p className="text-slate-600 font-bold">
                Je souhaite contacter mon pharmacien : <br />
                <span className="text-2xl text-slate-900 font-black">01 46 71 12 34</span>
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-primary font-black uppercase tracking-widest text-sm mb-6 flex items-center">
              <Clock className="w-4 h-4 mr-2" /> HORAIRES
            </h4>
            <ul className="space-y-3">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => (
                <li key={day} className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">{day}</span>
                  <span className="text-slate-900">08:00 - 20:00</span>
                </li>
              ))}
              <li className="flex justify-between items-center text-sm font-bold">
                <span className="text-destructive uppercase tracking-widest">Dimanche</span>
                <span className="text-destructive">Fermé</span>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-primary font-black uppercase tracking-widest text-sm mb-6 flex items-center">
              <Mail className="w-4 h-4 mr-2" /> NEWSLETTER
            </h4>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              Recevez nos dernières nouveautés et promotions directement dans votre boîte mail.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Votre adresse électronique" 
                className="rounded-full h-12 px-6 border-slate-200 focus:border-primary"
              />
              <Button className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs">
                S'inscrire
              </Button>
            </form>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
              Votre adresse électronique est uniquement destinée à vous envoyer la lettre d'information de la Pharmacie Nouvelle d'Ivry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
