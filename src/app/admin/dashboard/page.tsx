
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';
import { suggestRestock } from '@/ai/flows/restock-suggestion-flow';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const db = useFirestore();

  const productsQuery = useMemoFirebase(() => query(collection(db, 'products'), limit(10)), [db]);
  const { data: products, isLoading: isProductsLoading } = useCollection(productsQuery);

  const reservationsQuery = useMemoFirebase(() => query(collection(db, 'reservations'), orderBy('createdAt', 'desc'), limit(5)), [db]);
  const { data: reservations, isLoading: isReservationsLoading } = useCollection(reservationsQuery);

  const handleAISuggest = async (product: any) => {
    try {
      const result = await suggestRestock({
        productName: product.name,
        currentStock: product.stock || 0,
        salesHistory: [
          { date: '2026-01-01', quantity: 5 },
          { date: '2026-01-15', quantity: 8 }
        ]
      });
      toast({
        title: `Suggestion IA pour ${product.name}`,
        description: `Commander ${result.suggestedQuantity} unités. Priorité: ${result.priority}. Raison: ${result.reason}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Tableau de Bord Admin</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Ventes du jour</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">1 245,00€</div>
              <p className="text-xs text-primary font-bold">+12% vs hier</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Nouveaux Clients</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">+24</div>
              <p className="text-xs text-slate-400 font-bold">Cette semaine</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Réservations</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">18</div>
              <p className="text-xs text-slate-400 font-bold">En attente</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft bg-destructive/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-destructive">Alertes Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-destructive">3</div>
              <p className="text-xs text-destructive font-bold">Produits épuisés</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock AI Assist */}
        <Card className="border-none shadow-soft mb-12">
          <CardHeader>
            <CardTitle className="uppercase tracking-tight flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Gestion Stock & IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Action IA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isProductsLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : products?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold">{p.name}</TableCell>
                    <TableCell>{p.brand}</TableCell>
                    <TableCell>
                      <Badge variant={p.stock < 10 ? "destructive" : "secondary"}>
                        {p.stock} unités
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="rounded-full font-black text-[10px] uppercase" onClick={() => handleAISuggest(p)}>
                        Suggérer commande
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dernières Réservations */}
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle className="uppercase tracking-tight">Dernières Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isReservationsLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : reservations?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-bold">{r.clientId}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary">{r.status}</Badge>
                    </TableCell>
                    <TableCell>{r.totalPrice}€</TableCell>
                    <TableCell className="uppercase text-[10px] font-black">{r.deliveryOption}</TableCell>
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
