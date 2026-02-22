
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Clock, MapPin, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
  const { user } = useUser();
  const db = useFirestore();

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
      default: return 'bg-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'prepared': return 'En préparation';
      case 'ready': return 'Prêt au retrait';
      case 'delivered': return 'Livré / Retiré';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mes Réservations</h1>
            <Button asChild className="rounded-full bg-secondary font-black uppercase text-xs h-10 px-6">
              <Link href="/scan-ordonnance">Nouvelle Ordonnance</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>
          ) : reservations?.length === 0 ? (
            <Card className="border-none shadow-soft p-12 text-center">
              <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium text-lg">Vous n'avez pas encore de réservations.</p>
              <Button variant="link" asChild className="text-primary font-black mt-4"><Link href="/shop">Découvrir nos produits</Link></Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {reservations?.map((res) => (
                <Card key={res.id} className="border-none shadow-soft overflow-hidden group">
                  <div className={`h-1.5 w-full ${getStatusColor(res.status)}`} />
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(res.status)} text-white border-none font-black text-[10px] uppercase px-3`}>
                            {getStatusLabel(res.status)}
                          </Badge>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Réf: {res.id.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                          {res.deliveryOption === 'click-and-collect' ? 'Retrait en pharmacie' : 'Livraison à domicile'}
                        </h3>
                        <div className="flex items-center text-sm text-slate-500 font-medium gap-4">
                          <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5 text-primary" /> {new Date(res.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5 text-secondary" /> {res.deliveryOption === 'click-and-collect' ? '40 Rue Marat' : 'Votre adresse'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="text-right mr-4">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total</p>
                          <p className="text-2xl font-black text-secondary">{res.totalPrice.toFixed(2)}€</p>
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-100 shadow-sm text-slate-400 hover:text-primary">
                          <MessageSquare className="h-5 w-5" />
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
