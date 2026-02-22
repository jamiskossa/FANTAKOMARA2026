
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore, useUser, useDoc } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter } from 'next/navigation';
import { UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userProfileRef = React.useMemo(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);

  // Logic for redirection after registration and profile creation
  useEffect(() => {
    if (user && profile && isSubmitting) {
      toast({
        title: "Bienvenue !",
        description: "Votre compte patient a été créé avec succès.",
      });
      router.push('/client/dashboard');
    }
  }, [user, profile, router, isSubmitting]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      initiateEmailSignUp(auth, formData.email, formData.password);
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Impossible de créer le compte.",
      });
    }
  };

  // Create profile doc when user is created
  useEffect(() => {
    if (user && isSubmitting && !profile) {
      const userRef = doc(db, 'userProfiles', user.uid);
      
      const profileData = {
        id: user.uid,
        email: formData.email || user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'client',
        verified: false,
        createdAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(userRef, profileData, { merge: true });
    }
  }, [user, isSubmitting, db, formData, profile]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-3">Rejoignez-nous</h1>
            <p className="text-slate-500 font-medium text-lg">Créez votre compte patient en 1 minute</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[48px] overflow-hidden bg-white">
            <CardHeader className="bg-secondary/5 border-b border-secondary/10 pb-10 pt-10 px-10">
              <CardTitle className="text-center uppercase tracking-tight flex items-center justify-center gap-3 text-xl text-secondary">
                <ShieldCheck className="h-6 w-6" />
                Inscription Sécurisée
              </CardTitle>
              <CardDescription className="text-center font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-3">
                Hébergement Données de Santé (HDS)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Prénom</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Jean"
                      className="rounded-3xl h-14 px-6 border-slate-100 focus:border-secondary transition-all bg-slate-50/50 font-bold"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Nom</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Dupont"
                      className="rounded-3xl h-14 px-6 border-slate-100 focus:border-secondary transition-all bg-slate-50/50 font-bold"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Email de contact</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jean.dupont@exemple.fr" 
                    className="rounded-3xl h-14 px-6 border-slate-100 focus:border-secondary transition-all bg-slate-50/50 font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Mot de passe</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Minimum 8 caractères"
                    className="rounded-3xl h-14 px-6 border-slate-100 focus:border-secondary transition-all bg-slate-50/50 font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Confirmation</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••"
                    className="rounded-3xl h-14 px-6 border-slate-100 focus:border-secondary transition-all bg-slate-50/50 font-bold"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required 
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-[0.2em] h-16 shadow-2xl shadow-secondary/20 transition-all active:scale-95 mt-4">
                  {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                    <>
                      Créer mon compte patient
                      <UserPlus className="ml-3 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Déjà un compte santé ?{' '}
                  <Link href="/login" className="text-primary hover:underline">Se connecter ici</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
