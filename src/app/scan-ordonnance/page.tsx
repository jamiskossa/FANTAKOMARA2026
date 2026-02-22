
"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileText, Upload, ShieldCheck, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function ScanOrdonnance() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'upload' | 'success'>('upload');

  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour envoyer une ordonnance.",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    setIsUploading(true);
    
    // Simulation du temps d'upload et traitement OCR
    setTimeout(async () => {
      try {
        await addDocumentNonBlocking(collection(db, 'reservations'), {
          clientId: user.uid,
          status: 'pending',
          type: 'prescription',
          prescriptionUrl: 'https://placeholder-url.com/ordonnance.pdf', // Simulation Storage
          createdAt: new Date().toISOString(),
          items: [], // Sera rempli par le pharmacien après analyse
          deliveryOption: 'click-and-collect'
        });

        setIsUploading(false);
        setStep('success');
        toast({
          title: "Ordonnance transmise",
          description: "Nos pharmaciens vont l'analyser et préparer vos produits.",
        });
      } catch (e) {
        setIsUploading(false);
        console.error(e);
      }
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-xl w-full border-none shadow-2xl rounded-[48px] overflow-hidden bg-white text-center p-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Ordonnance reçue !</h1>
            <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed">
              Votre pharmacien analyse actuellement votre document. Vous recevrez une notification dès que votre traitement sera prêt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push('/client/dashboard')} className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 px-10">
                Suivre l'avancement
              </Button>
              <Button variant="outline" onClick={() => setStep('upload')} className="rounded-full border-slate-100 text-slate-400 font-black uppercase tracking-widest h-14 px-10">
                Envoyer un autre document
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-fluid-gradient border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center bg-secondary/10 text-secondary rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest mb-6">
              Service Sécurisé HDS
            </div>
            <h1 className="text-4xl lg:text-6xl font-black mb-6 text-slate-900 uppercase tracking-tighter">Scan Ordonnance</h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Gagnez du temps : envoyez-nous votre ordonnance de manière sécurisée et venez retirer vos médicaments dès notification.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-4 border-dashed border-slate-200 p-12 text-center rounded-[48px] bg-white shadow-soft transition-all hover:border-primary/30">
              <CardContent className="space-y-8">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                  <Upload className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Déposez votre scan</h3>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Formats acceptés : PDF, JPG, PNG • Max 5Mo</p>
                </div>
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="rounded-full px-12 h-16 bg-secondary hover:bg-secondary/90 shadow-xl shadow-secondary/20 text-white font-black uppercase tracking-widest text-sm transition-all active:scale-95"
                    onClick={handleUpload} 
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Traitement en cours...</>
                    ) : (
                      "Sélectionner mon ordonnance"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex items-start gap-6 p-8 bg-white rounded-[32px] shadow-soft">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-2">100% Sécurisé</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Vos documents sont chiffrés et stockés sur des serveurs certifiés données de santé (HDS).</p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-8 bg-white rounded-[32px] shadow-soft">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0 text-secondary">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-2">Préparation Rapide</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Notre équipe traite votre demande dès réception. Retrait possible sous 2h ouvrées.</p>
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
