
"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, useFirestore, useDoc } from '@/firebase';
import { initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { errorEmitter } from '../../firebase/error-emitter';
import Link from 'next/link';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userProfileRef = React.useMemo(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    const handleAuthError = () => {
      setIsSubmitting(false);
    };
    errorEmitter.on('auth-error', handleAuthError);
    return () => errorEmitter.off('auth-error', handleAuthError);
  }, []);

  // Smart Redirection based on role
  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (profile.role === 'collaborator' || profile.role === 'collaborateur') {
        router.push('/collaborateur/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    }
  }, [user, profile, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    initiateEmailSignIn(auth, email, password);
  };

  const handleGuestLogin = () => {
    initiateAnonymousSignIn(auth);
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center">
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-3">Ravi de vous revoir</h1>
            <p className="text-slate-500 font-medium text-lg">Accédez à vos services de santé personnalisés</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[48px] overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-10 pt-10 px-10">
              <CardTitle className="text-center uppercase tracking-tight flex items-center justify-center gap-3 text-xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Connexion Sécurisée
              </CardTitle>
              <CardDescription className="text-center font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-3">
                Données de santé protégées
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Identifiant (Email)</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="rounded-3xl h-14 px-6 border-slate-100 focus:border-primary transition-all bg-slate-50/50 font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-primary">Mot de passe</Label>
                    <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-slate-400 p-0 h-auto hover:text-primary">Oublié ?</Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="rounded-3xl h-14 px-6 border-slate-100 focus:border-primary transition-all bg-slate-50/50 font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] h-16 shadow-2xl shadow-primary/20 transition-all active:scale-95">
                  {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                    <>
                      Se connecter
                      <LogIn className="ml-3 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.4em]">
                  <span className="bg-white px-6 text-slate-300">Nouveau ici ?</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" className="w-full rounded-full border-slate-100 font-black uppercase tracking-widest h-14 text-xs hover:bg-slate-50 transition-all" asChild>
                  <Link href="/register">
                    Créer mon compte patient
                    <UserPlus className="ml-3 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full rounded-full font-black uppercase tracking-widest h-12 text-[10px] text-slate-400 hover:text-primary transition-colors" onClick={handleGuestLogin}>
                  Continuer sans compte <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
