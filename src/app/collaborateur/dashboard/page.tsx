
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
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
  Package, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Send,
  Camera,
  Search,
  AlertCircle,
  FileSearch,
  Play,
  Mail,
  Trash2,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { OrderPreparationModal } from '@/components/admin/OrderPreparationModal';
import Link from 'next/link';

export default function CollaboratorDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [staffMessage, setStaffMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

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
  const { data: activeOrders, isLoading: isOrdersLoading } = useCollection(activeOrdersQuery);

  // Chat Interne Staff
  const staffChatQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'admin')) return null;
    return query(collection(db, 'staffMessages'), orderBy('createdAt', 'asc'), limit(50));
  }, [db, profile]);
  const { data: staffMessages } = useCollection(staffChatQuery);

  // Messages de contact clients
  const contactMessagesQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'admin')) return null;
    return query(collection(db, 'contactMessages'), orderBy('submissionDate', 'desc'), limit(50));
  }, [db, profile]);
  const { data: contactMessages } = useCollection(contactMessagesQuery);

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

  const markMessageAsProcessed = (id: string) => {
    updateDocumentNonBlocking(doc(db, 'contactMessages', id), { isReplied: true });
    toast({ title: "Message traité", description: "Le statut a été mis à jour." });
  };

  const handleWhatsApp = (phone?: string) => {
    if (!phone) return toast({ title: "Erreur", description: "Pas de numéro", variant: "destructive" });
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}`, '_blank');
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Vérification de rôle explicite au rendu
  if (!profile || (profile.role !== 'collaborator' && profile.role !== 'admin')) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-none shadow-2xl rounded-[32px] overflow-hidden bg-white p-10 text-center">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Accès Refusé</h1>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Votre compte actuel ({profile?.role || 'sans rôle'}) n'a pas les autorisations nécessaires pour accéder à l'espace préparateur. 
              Contactez l'administrateur pour mettre à jour vos droits.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full rounded-full bg-primary font-black uppercase tracking-widest h-12">
                <Link href="/compte">Vérifier mon profil</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full rounded-full text-slate-400 font-black uppercase text-[10px]">
                <Link href="/"><ArrowLeft className="w-3 h-3 mr-2" /> Retour à l'accueil</Link>
              </Button>
            </div>
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
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white">
                <ClipboardList className="h-5 w-5" />
              </div>
              Espace Préparateur
            </h1>
            <p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest">
              Gestion des flux • Pharmacie Nouvelle d'Ivry
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full h-10 px-6 font-black uppercase text-[10px] border-slate-200">
              <Camera className="w-3.5 h-3.5 mr-2" /> Visio Patient
            </Button>
            <div className="bg-white px-4 py-2 rounded-full shadow-soft border border-slate-100 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Service Actif</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="orders" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 h-10">
                  <TabsTrigger value="orders" className="rounded-full px-6 font-black uppercase text-[9px]">File Active</TabsTrigger>
                  <TabsTrigger value="client-messages" className="rounded-full px-6 font-black uppercase text-[9px]">Messages Clients</TabsTrigger>
                  <TabsTrigger value="stock" className="rounded-full px-6 font-black uppercase text-[9px]">Alerte Stock</TabsTrigger>
                </TabsList>
              </div>

              {/* FILE ACTIVE COMMANDES */}
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
                      {isOrdersLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                      ) : activeOrders?.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase text-[10px]">Aucune commande en attente</TableCell></TableRow>
                      ) : activeOrders?.map((order) => (
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
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{order.deliveryOption === 'click-and-collect' ? 'Collect' : 'Livraison'}</span>
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
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              {/* MESSAGES CLIENTS (Formulaire contact) */}
              <TabsContent value="client-messages">
                <Card className="border-none shadow-soft rounded-[24px] overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="font-black uppercase text-[9px] pl-6">Client / Sujet</TableHead>
                        <TableHead className="font-black uppercase text-[9px]">Message</TableHead>
                        <TableHead className="font-black uppercase text-[9px] text-right pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactMessages?.map((msg) => (
                        <TableRow key={msg.id} className={`hover:bg-slate-50/50 ${!msg.isReplied ? 'bg-primary/5' : ''}`}>
                          <TableCell className="pl-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-black text-xs text-slate-900">{msg.senderName}</span>
                              <Badge variant="outline" className="text-[7px] uppercase w-fit mt-1">{msg.subject}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-[11px] text-slate-600 line-clamp-2 max-w-sm">{msg.messageContent}</p>
                          </TableCell>
                          <TableCell className="text-right pr-6 space-x-1">
                            {!msg.isReplied && (
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => markMessageAsProcessed(msg.id)}>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-secondary" onClick={() => handleWhatsApp(msg.senderPhone)}>
                              <MessageCircle className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!contactMessages || contactMessages.length === 0) && (
                        <TableRow><TableCell colSpan={3} className="text-center py-10 text-slate-400 text-[10px]">Aucun message client.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="stock">
                <Card className="border-none shadow-soft rounded-[24px] p-12 text-center bg-white">
                  <Package className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase text-slate-400">Section stock en cours de synchronisation</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Chat Staff */}
          <div className="space-y-6">
            <Card className="border-none shadow-soft rounded-[24px] overflow-hidden bg-white flex flex-col h-[600px]">
              <CardHeader className="bg-slate-900 p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-black uppercase tracking-widest">Chat Interne Équipe</CardTitle>
                    <p className="text-[8px] font-bold opacity-60 uppercase">Coordination</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
                <ScrollArea className="flex-grow p-4 bg-slate-50/50">
                  <div className="space-y-4">
                    {staffMessages?.map((msg) => (
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
                    ))}
                  </div>
                </ScrollArea>
                <form onSubmit={handleSendStaffMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                  <Input 
                    placeholder="Écrire à l'équipe..." 
                    className="h-10 rounded-full text-xs border-slate-100 bg-slate-50"
                    value={staffMessage}
                    onChange={(e) => setStaffMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="h-10 w-10 rounded-full bg-secondary shadow-lg shadow-secondary/20">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-soft rounded-[24px] p-6 bg-primary/5 border-l-4 border-l-primary">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Rappel picking</h4>
              </div>
              <ul className="space-y-3">
                {['Vérifier quantités', 'Vérifier péremption', 'Intégrité emballage'].map((text, i) => (
                  <li key={i} className="text-[10px] font-bold text-slate-500 uppercase flex gap-2">
                    <span className="text-primary">•</span> {text}
                  </li>
                ))}
              </ul>
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
