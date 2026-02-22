
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  Settings, 
  ClipboardList,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { suggestRestock } from '@/ai/flows/restock-suggestion-flow';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
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
    } else if (!isUserLoading && profile && profile.role !== 'admin') {
      router.push('/compte');
    }
  }, [user, isUserLoading, profile, router]);

  const productsQuery = useMemoFirebase(() => query(collection(db, 'products'), limit(20)), [db]);
  const { data: products, isLoading: isProductsLoading } = useCollection(productsQuery);

  const reservationsQuery = useMemoFirebase(() => query(collection(db, 'reservations'), orderBy('createdAt', 'desc'), limit(10)), [db]);
  const { data: reservations, isLoading: isReservationsLoading } = useCollection(reservationsQuery);

  const clientsQuery = useMemoFirebase(() => query(collection(db, 'userProfiles'), limit(10)), [db]);
  const { data: clients, isLoading: isClientsLoading } = useCollection(clientsQuery);

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
        description: `Commander ${result.suggestedQuantity} unités. Priorité: ${result.priority}.`,
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
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Administration
          </h1>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full font-bold uppercase text-[10px]">Exporter CSV</Button>
            <Button className="rounded-full bg-primary font-bold uppercase text-[10px]">Nouvel Utilisateur</Button>
          </div>
        </div>

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

        <Tabs defaultValue="reservations" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 flex w-full max-w-2xl mx-auto">
            <TabsTrigger value="reservations" className="flex-1 rounded-full font-black uppercase text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
              <ClipboardList className="w-3.5 h-3.5 mr-2" /> Réservations
            </TabsTrigger>
            <TabsTrigger value="products" className="flex-1 rounded-full font-black uppercase text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
              <Package className="w-3.5 h-3.5 mr-2" /> Stock & IA
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 rounded-full font-black uppercase text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="w-3.5 h-3.5 mr-2" /> Clients
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 rounded-full font-black uppercase text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
              <Settings className="w-3.5 h-3.5 mr-2" /> Rôles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <Card className="border-none shadow-soft">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest pl-6">Client</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest">Statut</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest">Total</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest">Type</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isReservationsLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : reservations?.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-bold pl-6">{r.clientId}</TableCell>
                        <TableCell><Badge className="bg-secondary">{r.status}</Badge></TableCell>
                        <TableCell>{r.totalPrice}€</TableCell>
                        <TableCell className="uppercase text-[10px] font-black">{r.deliveryOption}</TableCell>
                        <TableCell className="text-right pr-6"><Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 text-primary">Détails</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="border-none shadow-soft">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest pl-6">Produit</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest">Marque</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest">Stock</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-right pr-6">Action IA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isProductsLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : products?.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-bold pl-6">{p.name}</TableCell>
                        <TableCell className="text-xs uppercase font-medium">{p.brand}</TableCell>
                        <TableCell><Badge variant={p.stock < 10 ? "destructive" : "secondary"}>{p.stock} unités</Badge></TableCell>
                        <TableCell className="text-right pr-6">
                          <Button size="sm" variant="outline" className="rounded-full font-black text-[10px] uppercase border-primary/20 text-primary" onClick={() => handleAISuggest(p)}>Suggérer réappro</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-none shadow-soft">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest pl-6">Nom</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest">Email</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest">Rôle</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-right pr-6">Vérification</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isClientsLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : clients?.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-bold pl-6">{c.firstName} {c.lastName}</TableCell>
                        <TableCell className="text-xs">{c.email}</TableCell>
                        <TableCell><Badge variant="outline" className="uppercase text-[9px]">{c.role}</Badge></TableCell>
                        <TableCell className="text-right pr-6">
                          {c.verified ? <ShieldCheck className="h-5 w-5 text-primary ml-auto" /> : <Button size="sm" variant="ghost" className="text-destructive font-black text-[10px]">Vérifier</Button>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
