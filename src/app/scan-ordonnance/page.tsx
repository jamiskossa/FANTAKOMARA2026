"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileText, Upload, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ScanOrdonnance() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Ordonnance envoyée !",
        description: "Nous traiterons votre demande dans les plus brefs délais.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-fluid-gradient">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-slate-900 tracking-tight">Scan Ordonnance</h1>
            <p className="text-xl text-slate-600 mb-10">Gagnez du temps : envoyez-nous votre ordonnance de manière sécurisée et venez retirer vos médicaments préparés.</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-2 border-dashed border-accent p-12 text-center rounded-3xl">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto text-secondary mb-4">
                  <Upload className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Déposez votre ordonnance</h3>
                <p className="text-slate-500">Formats acceptés : PDF, JPG, PNG. Poids max : 5Mo.</p>
                <div className="pt-4">
                  <Button size="lg" className="rounded-full px-10 bg-secondary" onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Envoi en cours..." : "Sélectionner un fichier"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-16 grid grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">100% Sécurisé</h4>
                  <p className="text-sm text-slate-500">Données chiffrées et conformes RGPD santé.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">Préparation rapide</h4>
                  <p className="text-sm text-slate-500">Notification par SMS dès que c'est prêt.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}