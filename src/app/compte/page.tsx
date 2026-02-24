
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useAuth, useMemoFirebase } from '@/firebase';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Loader2, ShieldCheck, ShoppingBag, ClipboardList, Settings, User as UserIcon, LogOut, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';

export default function AccountRouterPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const db = useFirestore();
  
  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!isProfileLoading && profile) {
      if (profile.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (profile.role === 'collaborator') {
        router.push('/collaborateur/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    }
  }, [profile, isProfileLoading, router]);

  const handleSignOut = () => {
    signOut(auth);
    router.push('/');
  };

  if (isUserLoading || isProfileLoading || (user && profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Redirection vers votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const role = profile?.role || 'client';
  const isStaff = role === 'admin' || role === 'collaborator';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 bg-white p-8 rounded-[32px] shadow-soft border border-slate-100">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <UserIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : "Utilisateur"}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-black uppercase text-[8px] sm:text-[10px] px-3 py-1 rounded-full border-none">
                    {user.email}
                  </Badge>
                  <div className={`px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase flex items-center gap-2 ${
                    isStaff ? 'bg-secondary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {isStaff ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    Rôle : {role}
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="rounded-full border-slate-100 text-slate-400 font-black uppercase text-[9px] h-10 px-6" onClick={handleSignOut}>
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* No restriction message for clients as they redirect directly */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {role === 'admin' && (
              <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[32px] overflow-hidden" asChild>
                <Link href="/admin/dashboard">
                  <CardHeader className="bg-primary/5 p-6">
                    <Settings className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg uppercase tracking-tight">Pilotage Officine</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-sm text-slate-500 font-medium">Gestion globale : stocks, statistiques et annuaire clients.</p>
                  </CardContent>
                </Link>
              </Card>
            )}

            {(role === 'collaborator' || role === 'admin') && (
              <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[32px] overflow-hidden" asChild>
                <Link href="/collaborateur/dashboard">
                  <CardHeader className="bg-secondary/5 p-6">
                    <ClipboardList className="h-8 w-8 text-secondary mb-2" />
                    <CardTitle className="text-lg uppercase tracking-tight">Espace Préparateur</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-sm text-slate-500 font-medium">Gérez les flux : préparation des ordonnances et stocks produits.</p>
                  </CardContent>
                </Link>
              </Card>
            )}

            {role === 'client' && (
              <>
                <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[32px] overflow-hidden" asChild>
                  <Link href="/client/dashboard">
                    <CardHeader className="bg-primary/5 p-6">
                      <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg uppercase tracking-tight">Mes Réservations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-sm text-slate-500 font-medium">Suivez l'état de vos commandes Click & Collect en temps réel.</p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[32px] overflow-hidden" asChild>
                  <Link href="/client/ordonnances">
                    <CardHeader className="bg-secondary/5 p-6">
                      <ShieldCheck className="h-8 w-8 text-secondary mb-2" />
                      <CardTitle className="text-lg uppercase tracking-tight">Mes Ordonnances</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-sm text-slate-500 font-medium">Accédez à vos documents de santé sécurisés et chiffrés.</p>
                    </CardContent>
                  </Link>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
