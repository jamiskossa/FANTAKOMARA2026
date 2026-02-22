
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Clock, MapPin, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const reservationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'reservations'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user, db]);

  const { data: reservations, isLoading } = useCollection(reservationsQuery);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'prepared': return 'bg-blue-500';
      case 'ready': return 'bg-primary';
      case 'delivered': return 'bg-slate-500';
      case 'canceled': return 'bg-destructive';
      default: return 'bg-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'prepared': return 'En préparation';
      case 'ready': return 'Prêt au retrait';
      case 'delivered': return 'Récupérée';
      case 'canceled': return 'Annulée';
      default: return status;
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Mon Espace Santé</h1>
              <p className="text-slate-500 font-medium mt-1">Suivez vos réservations et vos documents médicaux</p>
            </div>
            <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest h-14 px-8 shadow-xl shadow-secondary/20 transition-all active:scale-95">
              <Link href="/scan-ordonnance">
                <Plus className="mr-2 h-5 w-5" />
                Nouvelle Ordonnance
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="border-none shadow-soft bg-white p-8 rounded-[32px] flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">{reservations?.length || 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Réservations totales</p>
                </div>
              </div>
              <ArrowRight className="text-slate-200 group-hover:text-primary transition-colors" />
            </Card>
            <Card className="border-none shadow-soft bg-white p-8 rounded-[32px] flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">
                    {reservations?.filter(r => r.status === 'pending' || r.status === 'prepared').length || 0}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">En cours</p>
                </div>
              </div>
              <ArrowRight className="text-slate-200 group-hover:text-secondary transition-colors" />
            </Card>
          </div>

          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Mes Réservations récentes</h2>

          {isLoading ? (
            <div className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>
          ) : !reservations || reservations.length === 0 ? (
            <Card className="border-none shadow-soft p-20 text-center bg-white rounded-[40px]">
              <Package className="h-20 w-20 text-slate-100 mx-auto mb-6" />
              <p className="text-slate-400 font-bold text-lg">Vous n'avez pas encore de réservations.</p>
              <Button variant="link" asChild className="mt-4 text-primary font-black uppercase tracking-widest">
                <Link href="/categorie/sante">Découvrir nos produits</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {reservations.map((res) => (
                <Card key={res.id} className="border-none shadow-soft overflow-hidden group bg-white rounded-[32px] hover:-translate-y-1 transition-all duration-300">
                  <div className={`h-2 w-full ${getStatusColor(res.status)}`} />
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Badge className={`${getStatusColor(res.status)} text-white border-none font-black text-[10px] uppercase px-4 py-1 rounded-full shadow-sm`}>
                            {getStatusLabel(res.status)}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                            REF: {res.id.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                          {res.deliveryOption === 'click-and-collect' ? 'Retrait en pharmacie' : 'Livraison à domicile'}
                        </h3>
                        <div className="flex flex-wrap items-center text-xs text-slate-500 font-bold gap-6">
                          <span className="flex items-center uppercase tracking-widest"><Clock className="h-4 w-4 mr-2 text-primary" /> {new Date(res.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                          <span className="flex items-center uppercase tracking-widest"><MapPin className="h-4 w-4 mr-2 text-secondary" /> {res.deliveryOption === 'click-and-collect' ? '40 Rue Marat, Ivry' : 'Votre domicile'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 border-t md:border-t-0 pt-6 md:pt-0">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant total</p>
                          <p className="text-3xl font-black text-secondary tracking-tighter">{res.totalPrice.toFixed(2).replace('.', ',')}€</p>
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full h-14 w-14 border-slate-100 shadow-sm text-slate-400 hover:text-primary hover:border-primary transition-all">
                          <MessageSquare className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
