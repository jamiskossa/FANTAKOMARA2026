
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Loader2, ShieldCheck, ShoppingBag, ClipboardList, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { doc } from 'firebase/firestore';

export default function AccountRouterPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  
  // On récupère le rôle de l'utilisateur depuis son profil Firestore
  const userProfileRef = React.useMemo(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const role = profile?.role || 'client';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mon Espace</h1>
            <p className="text-slate-500 font-medium">Bienvenue, {profile?.firstName || user?.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {role === 'admin' && (
              <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group" asChild>
                <Link href="/admin/dashboard">
                  <CardHeader>
                    <Settings className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="uppercase tracking-tight">Tableau de bord Admin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500">Gestion des stocks, statistiques et utilisateurs.</p>
                  </CardContent>
                </Link>
              </Card>
            )}

            {(role === 'admin' || role === 'collaborator') && (
              <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group" asChild>
                <Link href="/collaborateur/dashboard">
                  <CardHeader>
                    <ClipboardList className="h-8 w-8 text-secondary mb-2" />
                    <CardTitle className="uppercase tracking-tight">Espace Préparateur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500">Gérer les réservations et préparations d'ordonnances.</p>
                  </CardContent>
                </Link>
              </Card>
            )}

            <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group" asChild>
              <Link href="/client/dashboard">
                <CardHeader>
                  <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="uppercase tracking-tight">Mes Réservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">Suivre mes commandes Click & Collect et livraisons.</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group" asChild>
              <Link href="/client/ordonnances">
                <CardHeader>
                  <ShieldCheck className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="uppercase tracking-tight">Mes Ordonnances</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">Gérer mes documents de santé sécurisés.</p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
