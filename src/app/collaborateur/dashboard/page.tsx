
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc, addDocumentNonBlocking, useAuth } from '@/firebase';
import { collection, query, where, orderBy, limit, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
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
  Filter,
  BarChart3,
  Box,
  Truck,
  LogOut
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { OrderPreparationModal } from '@/components/admin/OrderPreparationModal';
import { StockManagement } from '@/components/admin/StockManagement';
import { DocumentPreview } from '@/components/admin/DocumentPreview';
import Link from 'next/link';
import { suggestRestock } from '@/ai/flows/restock-suggestion-flow';

export default function CollaboratorDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [staffMessage, setStaffMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isSuggesting, setIsSuggesting] = useState<string | null>(null);
  const [filterStock, setFilterStock] = useState('all');
  const [activeDoc, setActiveDoc] = useState<{type: string, data: any} | null>(null);
  const [showReplied, setShowReplied] = useState(false);
  const [sessionStartTime] = useState(new Date());

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // Log connection when the dashboard is opened
  useEffect(() => {
    if (user && profile && profile.role === 'collaborator') {
      const logSessionStart = async () => {
        try {
          await addDoc(collection(db, 'collaboratorSessions'), {
            collaboratorId: user.uid,
            collaboratorName: `${profile.firstName} ${profile.lastName}`,
            startTime: serverTimestamp(),
            type: 'connection'
          });
        } catch (e) {
          console.error("Error logging session start", e);
        }
      };
      logSessionStart();
    }
  }, [user, profile]);

  const handleEndSession = async () => {
    if (user && profile) {
      try {
        await addDoc(collection(db, 'collaboratorSessions'), {
          collaboratorId: user.uid,
          collaboratorName: `${profile.firstName} ${profile.lastName}`,
          startTime: sessionStartTime,
          endTime: serverTimestamp(),
          durationMinutes: Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000),
          type: 'full_session'
        });
        await signOut(auth);
        router.push('/login');
        toast({ title: "Session terminée", description: "Votre temps de travail a été enregistré." });
      } catch (e) {
        toast({ title: "Erreur", description: "Impossible de clore la session.", variant: "destructive" });
      }
    }
  };

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Messages de contact (accessibles au staff)
  const contactMessagesQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'admin')) return null;
    return query(collection(db, 'contactMessages'), orderBy('submissionDate', 'desc'), limit(50));
  }, [db, profile]);
  const { data: contactMessages } = useCollection(contactMessagesQuery);

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

  const handleWhatsApp = (phone?: string) => {
    if (!phone) return toast({ title: "Erreur", description: "Pas de numéro", variant: "destructive" });
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}`, '_blank');
  };

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
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Accès Restreint</h1>
            <p className="text-slate-500 font-medium mb-4 leading-relaxed">
              Cet espace est réservé au personnel de l'officine. 
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
              <p className="text-slate-600 text-sm font-medium">
                Si vous êtes un collaborateur de la pharmacie, votre rôle actuel est <span className="font-black text-primary">"{profile?.role || 'client'}"</span>. 
              </p>
              <p className="text-slate-500 text-[10px] mt-4 font-bold uppercase leading-tight">
                Vous devez contacter l'administrateur pour qu'il modifie votre rôle dans Firestore afin d'accéder aux outils de préparation et de gestion des stocks.
              </p>
            </div>
            <Button asChild className="w-full rounded-full bg-primary font-black uppercase tracking-widest h-12 shadow-xl shadow-primary/20">
              <Link href="/client/dashboard">Accéder à mon Dashboard Client</Link>
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
        <div className="mb-8 bg-white p-8 rounded-[40px] shadow-soft border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-secondary rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-secondary/30 transform hover:rotate-3 transition-transform">
                <ClipboardList className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">
                  Flux Officine
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-secondary text-white font-black uppercase text-[10px] px-4 py-1 rounded-full border-none">
                    Espace Préparateur
                  </Badge>
                  <div className="px-4 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Session : {sessionStartTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="destructive" 
                className="rounded-full h-14 px-8 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-destructive/20 active:scale-95 transition-all"
                onClick={handleEndSession}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Terminer le poste
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { label: 'À Préparer', val: activeOrders?.filter((o: any) => o.status === 'pending').length || 0, icon: AlertCircle, col: 'text-destructive', bg: 'bg-destructive/10' },
              { label: 'En Cours', val: activeOrders?.filter((o: any) => o.status === 'processing').length || 0, icon: Clock, col: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Ruptures', val: products?.filter((p: any) => (p.stockFinal || 0) < 5).length || 0, icon: Package, col: 'text-destructive', bg: 'bg-destructive/10' },
              { label: 'Produits OK', val: products?.filter((p: any) => (p.stockFinal || 0) >= 5).length || 0, icon: CheckCircle2, col: 'text-green-600', bg: 'bg-green-600/10' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50/50 p-4 rounded-[24px] border border-slate-100/50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.col}`}>{stat.val}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center ${stat.col}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 h-10 mb-4 overflow-x-auto w-full sm:w-fit">
                <TabsTrigger value="orders" className="rounded-full px-6 font-black uppercase text-[9px]">File Active</TabsTrigger>
                <TabsTrigger value="stock" className="rounded-full px-6 font-black uppercase text-[9px]">Inventaire</TabsTrigger>
                <TabsTrigger value="messages" className="rounded-full px-6 font-black uppercase text-[9px]">Messages Patients</TabsTrigger>
                <TabsTrigger value="docs" className="rounded-full px-6 font-black uppercase text-[9px]">Documents</TabsTrigger>
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
                <StockManagement />
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 rounded-full text-[9px] font-black uppercase"
                    onClick={() => setShowReplied(!showReplied)}
                  >
                    {showReplied ? <Eye className="w-3.5 h-3.5 mr-2" /> : <EyeOff className="w-3.5 h-3.5 mr-2" />}
                    {showReplied ? 'Masquer' : 'Afficher'} traités
                  </Button>
                </div>

                <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white">
                  <div className="divide-y divide-slate-100">
                    {contactMessages && contactMessages.length > 0 ? contactMessages
                      .filter(m => showReplied || !m.isReplied)
                      .map((m) => (
                        <div key={m.id} className={`p-4 hover:bg-slate-50/50 transition-colors border-l-4 ${!m.isReplied ? 'border-l-destructive bg-destructive/5' : 'border-l-green-600 bg-green-600/5'}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-black text-xs text-slate-900 uppercase">{m.senderName}</h4>
                                {!m.isReplied && <Badge className="bg-destructive text-white text-[7px] uppercase px-2 py-0.5">Urgent</Badge>}
                              </div>
                              <p className="text-[10px] text-slate-700 line-clamp-2 mb-2">{m.messageContent}</p>
                              <p className="text-[8px] text-slate-400 font-bold uppercase">{m.senderPhone}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-secondary" onClick={() => handleWhatsApp(m.senderPhone)} title="WhatsApp"><MessageSquare className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => setActiveDoc({type: 'letter', data: m})} title="Aperçu"><Printer className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        </div>
                      )) : (
                      <div className="text-center py-20 text-slate-400 font-bold uppercase text-[10px]">Aucun message patient</div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="docs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-none shadow-soft hover:shadow-md transition-all cursor-pointer rounded-2xl bg-white p-6" onClick={() => setActiveDoc({type: 'report', data: {}})}>
                    <BarChart3 className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-black uppercase text-xs mb-1">Inventaire du jour</h3>
                    <p className="text-[10px] text-slate-500 mb-4">Générer le rapport complet des stocks pour audit.</p>
                    <Button variant="outline" className="w-full h-9 rounded-xl text-[10px] font-black uppercase">Générer PDF</Button>
                  </Card>
                  <Card className="border-none shadow-soft hover:shadow-md transition-all cursor-pointer rounded-2xl bg-white p-6" onClick={() => setActiveDoc({type: 'report', data: {}})}>
                    <Box className="w-8 h-8 text-secondary mb-4" />
                    <h3 className="font-black uppercase text-xs mb-1">Bordereau Prépa</h3>
                    <p className="text-[10px] text-slate-500 mb-4">Liste des produits à préparer pour les tournées.</p>
                    <Button variant="outline" className="w-full h-9 rounded-xl text-[10px] font-black uppercase">Imprimer Liste</Button>
                  </Card>
                </div>
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
      <DocumentPreview 
        isOpen={!!activeDoc} 
        onClose={() => setActiveDoc(null)} 
        type={activeDoc?.type || ''} 
        data={activeDoc?.data} 
      />
      <Footer />
    </div>
  );
}
