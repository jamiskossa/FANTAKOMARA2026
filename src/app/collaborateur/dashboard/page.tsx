
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  ClipboardList, 
  Play, 
  ShieldAlert, 
  MessageSquare, 
  Send,
  Camera,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { OrderPreparationModal } from '@/components/admin/OrderPreparationModal';
import Link from 'next/link';
import { suggestRestock } from '@/ai/flows/restock-suggestion-flow';

export default function CollaboratorDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [staffMessage, setStaffMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isSuggesting, setIsSuggesting] = useState<string | null>(null);
  const [filterStock, setFilterStock] = useState('all');

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

  // File active : À préparer ou en cours
  const activeOrdersQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'admin')) return null;
    return query(
      collection(db, 'reservations'), 
      where('status', 'in', ['pending', 'processing']),
      orderBy('createdAt', 'desc'), 
      limit(50)
    );
  }, [db, profile]);
  const { data: activeOrders } = useCollection(activeOrdersQuery);

  // Inventaire Produits
  const productsQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'admin')) return null;
    return query(collection(db, 'products'), limit(100));
  }, [db, profile]);
  const { data: products } = useCollection(productsQuery);

  // Chat Interne Staff
  const staffChatQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'admin')) return null;
    return query(collection(db, 'staffMessages'), orderBy('createdAt', 'asc'), limit(50));
  }, [db, profile]);
  const { data: staffMessages } = useCollection(staffChatQuery);

  const handleSendStaffMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffMessage.trim() || !user) return;
    
    addDocumentNonBlocking(collection(db, 'staffMessages'), {
      senderId: user.uid,
      senderName: profile?.firstName || user.email,
      text: staffMessage,
      createdAt: serverTimestamp()
    });
    setStaffMessage('');
  };

  const handleAISuggestRestock = async (product: any) => {
    setIsSuggesting(product.id);
    try {
      const suggestion = await suggestRestock({
        productName: product.name,
        currentStock: product.stockFinal || 0,
        salesHistory: [
          { date: '2026-02-01', quantity: 12 },
          { date: '2026-02-15', quantity: 8 }
        ]
      });
      
      toast({
        title: "IA : Conseil Restock",
        description: `Suggéré : +${suggestion.suggestedQuantity} unités. Raison : ${suggestion.reason}`,
      });
    } catch (e) {
      toast({ title: "Erreur IA", description: "Impossible de générer une suggestion.", variant: "destructive" });
    } finally {
      setIsSuggesting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return "bg-yellow-500";
      case 'processing': return "bg-blue-500";
      case 'prepared': return "bg-secondary";
      case 'ready': return "bg-primary";
      default: return "bg-slate-300";
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (!profile || (profile.role !== 'collaborator' && profile.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl rounded-[32px] overflow-hidden bg-white p-10 text-center">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Accès Opérateur Refusé</h1>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Votre compte est actuellement au statut **"Client"**. 
              Demandez à l'administrateur de passer votre profil en **"Collaborateur"** dans Firestore pour accéder à cet espace.
            </p>
            <Button asChild className="w-full rounded-full bg-primary font-black uppercase tracking-widest h-12">
              <Link href="/compte">Mon Profil</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white">
                  <ClipboardList className="h-5 w-5" />
                </div>
                Espace Préparateur
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Officine Nouvelle d'Ivry</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full h-9 px-4 font-black uppercase text-[9px] border-slate-200">
                <Camera className="w-3.5 h-3.5 mr-2" /> Visio Patient
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-none shadow-soft bg-white rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">À Préparer</p>
                    <p className="text-2xl font-black text-destructive mt-1">{activeOrders?.filter((o: any) => o.status === 'pending').length || 0}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-soft bg-white rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">En Cours</p>
                    <p className="text-2xl font-black text-primary mt-1">{activeOrders?.filter((o: any) => o.status === 'processing').length || 0}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-soft bg-white rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ruptures</p>
                    <p className="text-2xl font-black text-destructive mt-1">{products?.filter((p: any) => (p.stockFinal || 0) < 5).length || 0}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-soft bg-white rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Produits OK</p>
                    <p className="text-2xl font-black text-green-600 mt-1">{products?.filter((p: any) => (p.stockFinal || 0) >= 5).length || 0}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-green-600/10 flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 h-10 mb-4 overflow-x-auto w-full sm:w-fit">
                <TabsTrigger value="orders" className="rounded-full px-6 font-black uppercase text-[9px]">File Active</TabsTrigger>
                <TabsTrigger value="stock" className="rounded-full px-6 font-black uppercase text-[9px]">Gestion Stock</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card className="border-none shadow-soft rounded-[24px] overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="font-black uppercase text-[9px] pl-6">Client / Réf</TableHead>
                        <TableHead className="font-black uppercase text-[9px]">Statut</TableHead>
                        <TableHead className="font-black uppercase text-[9px]">Type</TableHead>
                        <TableHead className="font-black uppercase text-[9px] text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeOrders && activeOrders.length > 0 ? activeOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-black text-xs text-slate-900">{order.clientId.substring(0, 8)}</span>
                              <span className="text-[9px] font-mono text-slate-400 uppercase">#{order.id.substring(0, 6)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} text-white border-none font-black text-[8px] uppercase px-3 py-0.5 rounded-full`}>
                              {order.status === 'pending' ? 'À préparer' : 'En cours'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{order.type === 'prescription' ? 'Ordonnance' : 'Panier'}</span>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button 
                              size="sm" 
                              className="rounded-full bg-slate-900 hover:bg-secondary font-black text-[9px] uppercase tracking-widest h-8 px-4"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Play className="w-3 h-3 mr-1.5" /> Préparer
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase text-[10px]">
                            Aucune commande en attente
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="stock" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <div className="flex gap-2">
                    {[
                      { value: 'all', label: 'Tous' },
                      { value: 'critical', label: 'Critique' },
                      { value: 'low', label: 'Faible' },
                      { value: 'good', label: 'OK' }
                    ].map(f => (
                      <Button
                        key={f.value}
                        onClick={() => setFilterStock(f.value)}
                        variant={filterStock === f.value ? 'default' : 'outline'}
                        className="h-8 px-3 rounded-full text-[9px] font-black uppercase"
                      >
                        {f.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Card className="border-none shadow-soft rounded-[24px] overflow-hidden bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                    {products && products.length > 0 ? products
                      .filter((p: any) => {
                        if (filterStock === 'critical') return (p.stockFinal || 0) < 3;
                        if (filterStock === 'low') return (p.stockFinal || 0) >= 3 && (p.stockFinal || 0) < 5;
                        if (filterStock === 'good') return (p.stockFinal || 0) >= 5;
                        return true;
                      })
                      .map((p: any) => (
                        <Card key={p.id} className={`border-l-4 rounded-xl overflow-hidden ${(p.stockFinal || 0) < 5 ? 'border-l-destructive bg-destructive/5' : 'border-l-primary bg-primary/5'}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-black text-xs text-slate-900 uppercase">{p.name}</h4>
                                <p className="text-[8px] text-slate-400 font-medium mt-1">{p.brand}</p>
                              </div>
                              <Button 
                                size="icon"
                                variant="ghost" 
                                className="h-7 w-7 rounded-full text-primary hover:bg-primary/10"
                                onClick={() => handleAISuggestRestock(p)}
                                disabled={isSuggesting === p.id}
                              >
                                {isSuggesting === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                              </Button>
                            </div>
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Stock</p>
                                <p className={`text-xl font-black ${(p.stockFinal || 0) < 5 ? 'text-destructive' : 'text-green-600'}`}>
                                  {p.stockFinal || 0}
                                </p>
                              </div>
                              <Badge className={`text-[7px] uppercase px-2 py-0.5 rounded-full font-black ${(p.stockFinal || 0) < 5 ? 'bg-destructive text-white' : 'bg-green-600 text-white'}`}>
                                {(p.stockFinal || 0) < 3 ? 'Critique' : (p.stockFinal || 0) < 5 ? 'Faible' : 'OK'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                      : (
                        <div className="col-span-2 text-center py-20 text-slate-400 font-bold uppercase text-[10px]">
                          Inventaire vide ou en cours de chargement
                        </div>
                      )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-soft rounded-[24px] overflow-hidden bg-white flex flex-col h-[500px]">
              <CardHeader className="bg-slate-900 p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-black uppercase tracking-widest">Chat Équipe</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
                <ScrollArea className="flex-grow p-4 bg-slate-50/50">
                  <div className="space-y-4">
                    {staffMessages && staffMessages.length > 0 ? staffMessages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}>
                        <span className="text-[8px] font-black text-slate-400 uppercase mb-1 px-2">{msg.senderName}</span>
                        <div className={`max-w-[90%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${
                          msg.senderId === user?.uid 
                          ? 'bg-secondary text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    )) : (
                      <p className="text-center py-10 text-[10px] font-black uppercase text-slate-300">Début de la conversation</p>
                    )}
                  </div>
                </ScrollArea>
                <form onSubmit={handleSendStaffMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                  <Input 
                    placeholder="Message..." 
                    className="h-9 rounded-full text-[10px] border-slate-100 bg-slate-50 font-bold"
                    value={staffMessage}
                    onChange={(e) => setStaffMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="h-9 w-9 rounded-full bg-secondary shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-soft rounded-[24px] bg-slate-900 p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <TrendingUp className="w-8 h-8 text-primary mb-4 relative z-10" />
              <h3 className="text-xs font-black uppercase tracking-widest mb-2 relative z-10">Activité du jour</h3>
              <p className="text-3xl font-black tracking-tighter relative z-10">{activeOrders?.length || 0}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 relative z-10">Commandes à préparer</p>
            </Card>
          </div>
        </div>
      </main>

      <OrderPreparationModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />
      <Footer />
    </div>
  );
}
