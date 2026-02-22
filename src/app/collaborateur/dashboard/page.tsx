
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ClipboardList, CheckCircle2, Clock } from 'lucide-react';

export default function CollaboratorDashboard() {
  const db = useFirestore();

  const reservationsQuery = useMemoFirebase(() => query(
    collection(db, 'reservations'), 
    where('status', 'in', ['pending', 'prepared']),
    orderBy('createdAt', 'desc'), 
    limit(20)
  ), [db]);
  
  const { data: reservations, isLoading } = useCollection(reservationsQuery);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Espace Préparateur</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-none shadow-soft bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">À préparer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">
                {reservations?.filter(r => r.status === 'pending').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft bg-secondary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-secondary">Prêts au retrait</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-secondary">
                {reservations?.filter(r => r.status === 'prepared').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-soft">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="uppercase tracking-tight flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Réservations en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-6">Réf</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Client</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Statut</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Type</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : reservations?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 font-bold">Aucune préparation en attente.</TableCell></TableRow>
                ) : reservations?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="px-6 font-mono text-[10px] font-bold text-slate-400 uppercase">{r.id.substring(0, 8)}</TableCell>
                    <TableCell className="font-bold text-slate-900">{r.clientId}</TableCell>
                    <TableCell>
                      <Badge className={r.status === 'pending' ? "bg-yellow-500" : "bg-primary"}>
                        {r.status === 'pending' ? 'Attente' : 'Préparé'}
                      </Badge>
                    </TableCell>
                    <TableCell className="uppercase text-[10px] font-black">{r.deliveryOption}</TableCell>
                    <TableCell className="text-right px-6">
                      <Button size="sm" variant="outline" className="rounded-full font-black text-[10px] uppercase border-primary/20 text-primary">
                        Détails
                      </Button>
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
