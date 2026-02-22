
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Upload, FileText, Lock } from 'lucide-react';
import Link from 'next/link';

export default function OrdonnancesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mes Ordonnances</h1>
              <p className="text-slate-500 font-medium">Documents de santé sécurisés et chiffrés</p>
            </div>
            <Button asChild className="rounded-full bg-primary font-black uppercase text-xs h-12 px-8">
              <Link href="/scan-ordonnance">
                <Upload className="mr-2 h-4 w-4" />
                Envoyer
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-none shadow-soft bg-white p-6 flex flex-col items-center text-center rounded-[32px]">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-black uppercase text-xs tracking-widest mb-2">Sécurité RGPD</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Hébergement certifié données de santé (HDS).</p>
            </Card>
            <Card className="border-none shadow-soft bg-white p-6 flex flex-col items-center text-center rounded-[32px]">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black uppercase text-xs tracking-widest mb-2">Confidentialité</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Seul votre pharmacien peut consulter ces documents.</p>
            </Card>
            <Card className="border-none shadow-soft bg-white p-6 flex flex-col items-center text-center rounded-[32px]">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-secondary mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-black uppercase text-xs tracking-widest mb-2">Historique</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Conservez vos prescriptions pendant 2 ans.</p>
            </Card>
          </div>

          <Card className="border-none shadow-soft p-20 text-center bg-white rounded-[40px]">
            <FileText className="h-16 w-16 text-slate-100 mx-auto mb-6" />
            <p className="text-slate-400 font-bold text-lg">Aucune ordonnance archivée pour le moment.</p>
            <Button variant="link" asChild className="mt-4 text-primary font-black uppercase">
              <Link href="/scan-ordonnance">Déposer ma première ordonnance</Link>
            </Button>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
