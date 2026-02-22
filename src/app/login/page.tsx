
"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    initiateEmailSignIn(auth, email, password);
    router.push('/compte');
  };

  const handleGuestLogin = () => {
    initiateAnonymousSignIn(auth);
    router.push('/compte');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Connexion</h1>
            <p className="text-slate-500 font-medium">Accédez à votre espace santé sécurisé</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-8 pt-8">
              <CardTitle className="text-center uppercase tracking-tight flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Espace Sécurisé
              </CardTitle>
              <CardDescription className="text-center font-bold text-xs uppercase tracking-widest text-slate-400 mt-2">
                Pharmacie Nouvelle d'Ivry
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="rounded-2xl h-12 px-4 border-slate-100 focus:border-primary transition-all bg-slate-50/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe</Label>
                    <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-primary p-0 h-auto">Oublié ?</Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    className="rounded-2xl h-12 px-4 border-slate-100 focus:border-primary transition-all bg-slate-50/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 shadow-xl shadow-primary/20 transition-all active:scale-95">
                  Se connecter
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                  <span className="bg-white px-4 text-slate-300">Ou</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" className="w-full rounded-full border-slate-100 font-black uppercase tracking-widest h-12 text-xs" onClick={() => router.push('/register')}>
                  Créer un compte
                  <UserPlus className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full rounded-full font-black uppercase tracking-widest h-12 text-[10px] text-slate-400" onClick={handleGuestLogin}>
                  Continuer en tant qu'invité
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
