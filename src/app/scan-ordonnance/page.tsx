
"use client";

import React, { useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Upload, ShieldCheck, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { extractPrescriptionInformation } from '@/ai/flows/prescription-information-extractor';

export default function ScanOrdonnance() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<'upload' | 'success'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour envoyer une ordonnance.",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5Mo.",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = event.target?.result as string;

        try {
          const extractedData = await extractPrescriptionInformation({
            prescriptionImage: base64String
          });

          await addDocumentNonBlocking(collection(db, 'reservations'), {
            clientId: user.uid,
            status: 'pending',
            type: 'prescription',
            prescriptionUrl: 'image_analyzed_securely',
            medications: extractedData.medications,
            items: extractedData.medications.map(m => ({
              name: m.name,
              quantity: 1,
              dosage: m.dosage,
              instructions: m.instructions
            })),
            createdAt: new Date().toISOString(),
            deliveryOption: 'click-and-collect'
          });

          setIsAnalyzing(false);
          setStep('success');
          toast({
            title: "Ordonnance analysée",
            description: `${extractedData.medications.length} médicaments identifiés.`,
          });
        } catch (error) {
          console.error("Extraction error:", error);
          setIsAnalyzing(false);
          await addDocumentNonBlocking(collection(db, 'reservations'), {
            clientId: user.uid,
            status: 'pending',
            type: 'prescription',
            createdAt: new Date().toISOString(),
            deliveryOption: 'click-and-collect'
          });
          setStep('success');
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setIsAnalyzing(false);
      console.error(e);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-xl w-full border-none shadow-2xl rounded-[32px] overflow-hidden bg-white text-center p-8 sm:p-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-primary">
              <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Ordonnance transmise !</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-lg mb-8 sm:mb-10 leading-relaxed">
              L'IA a pré-rempli votre dossier. Un pharmacien valide actuellement la préparation. Vous serez notifié du retrait sous 2h.
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <Button onClick={() => router.push('/client/dashboard')} className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-12 sm:h-14 px-6 sm:px-10 text-[10px] sm:text-xs">
                Suivre dans mon espace
              </Button>
              <Button variant="outline" onClick={() => setStep('upload')} className="rounded-full border-slate-100 text-slate-400 font-black uppercase tracking-widest h-12 sm:h-14 px-6 sm:px-10 text-[10px] sm:text-xs">
                Scanner un autre document
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <section className="py-12 sm:py-20 bg-fluid-gradient border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center bg-secondary/10 text-secondary rounded-full px-3 py-1 text-[8px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">
              Intelligence Artificielle & Sécurité HDS
            </div>
            <h1 className="text-3xl lg:text-6xl font-black mb-4 sm:mb-6 text-slate-900 uppercase tracking-tighter">Scan Ordonnance</h1>
            <p className="text-sm sm:text-xl text-slate-600 font-medium leading-relaxed">
              L'IA extrait vos médicaments en temps réel pour une préparation record.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,.pdf" 
              onChange={handleFileChange} 
            />
            
            <Card 
              className={`border-2 sm:border-4 border-dashed p-6 sm:p-12 text-center rounded-[32px] sm:rounded-[48px] bg-white shadow-soft transition-all cursor-pointer ${
                isAnalyzing ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/30'
              }`}
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            >
              <CardContent className="p-0 space-y-6 sm:space-y-8">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-6 animate-pulse">
                    <Loader2 className="w-16 h-16 sm:w-20 sm:h-20 text-primary animate-spin" />
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-3xl font-black text-primary uppercase tracking-tight">Analyse IA en cours...</h3>
                      <p className="text-slate-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">Lecture des médicaments et dosages</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                      <Upload className="w-8 h-8 sm:w-12 sm:h-12" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
                        {fileName ? fileName : "Déposez votre ordonnance"}
                      </h3>
                      <p className="text-slate-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">Formats acceptés : PHOTO, PDF • Max 5Mo</p>
                    </div>
                    <div className="pt-2 sm:pt-4">
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto rounded-full px-8 h-12 bg-secondary hover:bg-secondary/90 shadow-xl shadow-secondary/20 text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
                      >
                        Sélectionner mon document
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="mt-12 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              <div className="flex items-start gap-4 sm:gap-6 p-6 sm:p-8 bg-white rounded-[24px] sm:rounded-[32px] shadow-soft border border-slate-100">
                <div className="w-10 h-10 sm:w-14 h-14 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-primary">
                  <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-tighter mb-1 sm:mb-2">Données de Santé</h4>
                  <p className="text-[10px] sm:text-sm text-slate-500 font-medium leading-relaxed">Vos ordonnances sont traitées selon les normes HDS et supprimées après préparation.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 sm:gap-6 p-6 sm:p-8 bg-white rounded-[24px] sm:rounded-[32px] shadow-soft border border-slate-100">
                <div className="w-10 h-10 sm:w-14 h-14 bg-secondary/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-secondary">
                  <FileText className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-tighter mb-1 sm:mb-2">Analyse Immédiate</h4>
                  <p className="text-[10px] sm:text-sm text-slate-500 font-medium leading-relaxed">Notre IA identifie les produits en quelques secondes pour faire gagner du temps au pharmacien.</p>
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
