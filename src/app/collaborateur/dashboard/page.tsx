
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ClipboardList, Package, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CollaboratorDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    } else if (!isUserLoading && profile && (profile.role !== 'collaborator' && profile.role !== 'admin')) {
      router.push('/compte');
    }
  }, [user, isUserLoading, profile, router]);

  const reservationsQuery = useMemoFirebase(() => query(
    collection(db, 'reservations'), 
    where('status', 'in', ['pending', 'prepared']),
    orderBy('createdAt', 'desc'), 
    limit(20)
  ), [db]);
  
  const { data: reservations, isLoading: isReservationsLoading } = useCollection(reservationsQuery);

  const handleUpdateStatus = async (resId: string, newStatus: string) => {
    try {
      const resRef = doc(db, 'reservations', resId);
      await updateDoc(resRef, { status: newStatus });
      toast({
        title: "Statut mis à jour",
        description: `La réservation est désormais : ${newStatus}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (isUserLoading || isProfileLoading) {
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-secondary" />
            Espace Préparateur
          </h1>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">En direct de l'officine</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-none shadow-soft bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">À préparer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-primary">
                {reservations?.filter(r => r.status === 'pending').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft bg-secondary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-secondary">Prêts au retrait</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-secondary">
                {reservations?.filter(r => r.status === 'prepared').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Critique</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-4xl font-black text-slate-900">12</div>
              <Button size="sm" variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-widest h-8 px-4">Voir</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50 flex flex-row items-center justify-between py-6">
            <CardTitle className="uppercase tracking-tight text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              File de préparation
            </CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-slate-100 text-slate-400 border-none font-bold">Toutes</Badge>
              <Badge className="bg-primary/10 text-primary border-none font-bold">Urgent</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6">Réf / Heure</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Client</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Type</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Statut</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isReservationsLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : reservations?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 font-bold">Aucune préparation en attente.</TableCell></TableRow>
                ) : reservations?.map((r) => (
                  <TableRow key={r.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-black text-primary uppercase">#{r.id.substring(0, 8)}</span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center mt-1"><Clock className="w-3 h-3 mr-1" /> {new Date(r.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{r.clientId}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">3 articles</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase text-[9px] font-black tracking-widest py-0.5 border-slate-200">
                        {r.deliveryOption === 'click-and-collect' ? 'Collect' : 'Livraison'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={r.status === 'pending' ? "bg-yellow-500 text-white border-none" : "bg-primary text-white border-none"}>
                        {r.status === 'pending' ? 'À préparer' : 'Préparé'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex items-center justify-end gap-2">
                        {r.status === 'pending' && (
                          <Button size="sm" className="rounded-full bg-primary font-black text-[9px] uppercase tracking-widest h-8 px-4" onClick={() => handleUpdateStatus(r.id, 'prepared')}>
                            Terminer <CheckCircle2 className="w-3 h-3 ml-1.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white hover:text-secondary border border-transparent hover:border-slate-100">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
