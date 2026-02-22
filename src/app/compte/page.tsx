
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useAuth } from '@/firebase';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Loader2, ShieldCheck, ShoppingBag, ClipboardList, Settings, User as UserIcon, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function AccountRouterPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const db = useFirestore();
  
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

  const handleSignOut = () => {
    signOut(auth);
    router.push('/');
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const role = profile?.role || 'client';
  const isStaff = role === 'admin' || role === 'collaborator';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 bg-white p-8 rounded-[32px] shadow-soft border border-slate-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <UserIcon className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : "Utilisateur Patient"}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-black uppercase text-[10px] px-3 py-1 rounded-full border-none">
                    {user.email}
                  </Badge>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${
                    isStaff ? 'bg-secondary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {isStaff ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    Rôle : {role}
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="rounded-full border-slate-100 text-slate-400 font-black uppercase text-[10px] h-12 px-6" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {!isStaff && (
            <div className="mb-12 bg-primary/5 p-6 rounded-[24px] border border-primary/10 flex gap-4 items-start animate-in fade-in slide-in-from-top-4 duration-500">
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-black text-sm text-primary uppercase tracking-tight">Note pour le personnel</h4>
                <p className="text-sm text-slate-600 font-medium">
                  Si vous êtes un collaborateur de la pharmacie, votre rôle doit être mis à jour par l'administrateur pour accéder aux outils de préparation. Actuellement, vous disposez des droits standard "Patient".
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {role === 'admin' && (
              <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[32px] overflow-hidden" asChild>
                <Link href="/admin/dashboard">
                  <CardHeader className="bg-primary/5">
                    <Settings className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="uppercase tracking-tight">Tableau de bord Admin</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-slate-500 font-medium">Gestion globale : stocks, statistiques de vente et administration des utilisateurs.</p>
                  </CardContent>
                </Link>
              </Card>
            )}

            {isStaff && (
              <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[32px] overflow-hidden" asChild>
                <Link href="/collaborateur/dashboard">
                  <CardHeader className="bg-secondary/5">
                    <ClipboardList className="h-8 w-8 text-secondary mb-2" />
                    <CardTitle className="uppercase tracking-tight">Espace Préparateur</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-slate-500 font-medium">Gérez les flux : préparation des ordonnances et suivi du Click & Collect.</p>
                  </CardContent>
                </Link>
              </Card>
            )}

            <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[32px] overflow-hidden" asChild>
              <Link href="/client/dashboard">
                <CardHeader className="bg-primary/5">
                  <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="uppercase tracking-tight">Mes Réservations</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-500 font-medium">Suivez l'état de vos commandes Click & Collect et vos livraisons en cours.</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group bg-white rounded-[32px] overflow-hidden" asChild>
              <Link href="/client/ordonnances">
                <CardHeader className="bg-secondary/5">
                  <ShieldCheck className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="uppercase tracking-tight">Mes Ordonnances</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-500 font-medium">Accédez à vos documents de santé sécurisés et chiffrés (norme HDS).</p>
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

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return <div className={className}>{children}</div>;
}
