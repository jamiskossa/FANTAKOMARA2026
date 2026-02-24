
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AlertTriangle, Info, Calendar, ShieldCheck, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AlertesProPage() {
  const alertesPro = [
    {
      id: 1,
      title: "Rappel Lait Infantile - Lots 2026",
      date: "24 Février 2026",
      description: "Information de sécurité majeure : rappel préventif de certains lots de lait infantile en raison d'une suspicion de contamination croisée.",
      action: "Ne pas consommer les lots mentionnés et les rapporter en pharmacie.",
      severity: "high"
    },
    {
      id: 2,
      title: "Paracétamol - Information de Conditionnement",
      date: "15 Février 2026",
      description: "Certaines boîtes présentent un défaut d'impression sur la notice. Pas de risque thérapeutique.",
      action: "Vérifiez la notice ou contactez votre pharmacien.",
      severity: "low"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow">
        <section className="py-12 lg:py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-6 uppercase tracking-tighter">Information Rappel</h1>
            <p className="text-sm sm:text-xl text-white/90 font-medium leading-relaxed">
              Votre sécurité est notre priorité. Consultez ici les dernières alertes sanitaires et les rappels de produits officiels.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-6">
              {alertesPro.map((rappel) => (
                <Card key={rappel.id} className="border-none shadow-soft rounded-[32px] overflow-hidden bg-white">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                        rappel.severity === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={rappel.severity === 'high' ? 'destructive' : 'secondary'} className="uppercase text-[9px] font-black tracking-widest">
                            {rappel.severity === 'high' ? 'Alerte Majeure' : 'Information'}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {rappel.date}
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 uppercase mb-4">{rappel.title}</h2>
                        <p className="text-slate-600 font-medium mb-6 leading-relaxed">
                          {rappel.description}
                        </p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-600" /> Action requise
                          </h4>
                          <p className="text-slate-900 font-bold">{rappel.action}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 p-8 rounded-[32px] border border-blue-100 flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-black text-blue-900 uppercase mb-2">Besoin d'aide ?</h3>
                <p className="text-blue-800 text-sm font-medium leading-relaxed">
                  Si vous avez acheté un produit concerné par un rappel dans notre pharmacie, rapportez-le nous dès que possible. Nous procéderons au remboursement ou à l'échange immédiat. En cas de doute, contactez-nous directement via le chat ou par téléphone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
