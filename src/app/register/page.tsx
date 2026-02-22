
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore, useUser } from '@/firebase';
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

  useEffect(() => {
    if (user && !isSubmitting) {
      router.push('/compte');
    }
  }, [user, router, isSubmitting]);

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

  useEffect(() => {
    if (user && isSubmitting) {
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
      
      toast({
        title: "Bienvenue !",
        description: "Votre compte a été créé avec succès.",
      });
      
      router.push('/compte');
    }
  }, [user, isSubmitting, db, formData, router]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Créer un compte</h1>
            <p className="text-slate-500 font-medium">Rejoignez la Pharmacie Nouvelle d'Ivry</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="bg-secondary/5 border-b border-secondary/10 pb-8 pt-8">
              <CardTitle className="text-center uppercase tracking-tight flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                Inscription Sécurisée
              </CardTitle>
              <CardDescription className="text-center font-bold text-xs uppercase tracking-widest text-slate-400 mt-2">
                Vos données de santé sont protégées
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Prénom</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Jean"
                      className="rounded-2xl h-12 px-4 border-slate-100 focus:border-secondary transition-all bg-slate-50/50"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Dupont"
                      className="rounded-2xl h-12 px-4 border-slate-100 focus:border-secondary transition-all bg-slate-50/50"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="rounded-2xl h-12 px-4 border-slate-100 focus:border-secondary transition-all bg-slate-50/50"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="rounded-2xl h-12 px-4 border-slate-100 focus:border-secondary transition-all bg-slate-50/50"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirmer</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    className="rounded-2xl h-12 px-4 border-slate-100 focus:border-secondary transition-all bg-slate-50/50"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required 
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest h-14 shadow-xl shadow-secondary/20 transition-all active:scale-95 mt-4">
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>
                      Créer mon compte
                      <UserPlus className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-primary hover:underline">Se connecter</Link>
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
