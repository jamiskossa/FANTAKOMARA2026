
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, doc, addDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Loader2, 
  TrendingUp, 
  Users, 
  Package, 
  LayoutDashboard,
  Trash2,
  Mail,
  MessageCircle,
  FileText,
  BookOpen,
  Printer,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Share2,
  UserPlus,
  BarChart3,
  Box,
  Send,
  Search,
  Calendar
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DocumentPreview } from '@/components/admin/DocumentPreview';
import { CollaboratorManagement } from '@/components/admin/CollaboratorManagement';
import { StockManagement } from '@/components/admin/StockManagement';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [activeDoc, setActiveDoc] = useState<{type: string, data: any} | null>(null);
  const [showReplied, setShowReplied] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState('');

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    } else if (!isUserLoading && !isProfileLoading && profile && profile.role !== 'admin') {
      router.push('/compte');
    }
  }, [user, isUserLoading, isProfileLoading, profile, router]);

  // Dynamic Queries only when authorized and profile is fully loaded
  const reservationsQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'reservations'), orderBy('createdAt', 'desc'), limit(50));
  }, [db, profile]);
  const { data: reservations } = useCollection(reservationsQuery);

  const clientsQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'userProfiles'), limit(100));
  }, [db, profile]);
  const { data: clients } = useCollection(clientsQuery);

  const contactMessagesQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'contactMessages'), orderBy('submissionDate', 'desc'), limit(50));
  }, [db, profile]);
  const { data: contactMessages } = useCollection(contactMessagesQuery);

  const supportChatQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'supportMessages'), orderBy('createdAt', 'desc'), limit(100));
  }, [db, profile]);
  const { data: allSupportMessages } = useCollection(supportChatQuery);

  const newsletterQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'newsletter'), orderBy('subscribedAt', 'desc'), limit(100));
  }, [db, profile]);
  const { data: subscribers } = useCollection(newsletterQuery);

  const totalSales = React.useMemo(() => {
    if (!reservations) return 0;
    return reservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0);
  }, [reservations]);

  const groupedChats = React.useMemo(() => {
    if (!allSupportMessages) return {};
    const groups: any = {};
    allSupportMessages.forEach((msg: any) => {
      const cid = msg.clientId;
      if (!groups[cid]) groups[cid] = [];
      groups[cid].push(msg);
    });
    return groups;
  }, [allSupportMessages]);

  const handleSendAdminReply = async (clientId: string) => {
    if (!adminReply.trim() || !user) return;
    try {
      await addDoc(collection(db, 'supportMessages'), {
        clientId,
        senderId: user.uid,
        senderName: "Pharmacie (Admin)",
        text: adminReply,
        createdAt: new Date().toISOString()
      });
      setAdminReply('');
      toast({ title: "Réponse envoyée" });
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message.", variant: "destructive" });
    }
  };

  const handleDelete = (collectionName: string, id: string) => {
    if (confirm("Confirmer la suppression ?")) {
      deleteDocumentNonBlocking(doc(db, collectionName, id));
      toast({ title: "Supprimé", description: "L'élément a été retiré." });
    }
  };

  const markAsRead = (id: string) => {
    updateDocumentNonBlocking(doc(db, 'contactMessages', id), { isReplied: true });
    toast({ title: "Message traité", description: "Le statut a été mis à jour." });
  };

  const handleWhatsApp = (phone?: string) => {
    if (!phone) return toast({ title: "Erreur", description: "Pas de numéro", variant: "destructive" });
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}`, '_blank');
  };

  const handleEmail = (email?: string) => {
    if (!email) return toast({ title: "Erreur", description: "Pas d'email", variant: "destructive" });
    window.open(`mailto:${email}`, '_blank');
  };

  const handleShare = (data: any) => {
    const text = `Commande de ${data.clientId || 'Client'} - Montant: ${data.totalPrice || 0}€`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copié", description: "Détails copiés dans le presse-papier." });
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Accès Sécurisé...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Pilotage Officine</h1>
          </div>
          <Button variant="outline" size="sm" className="rounded-full font-black uppercase text-[10px] h-9 px-4" onClick={() => setActiveDoc({type: 'report', data: {}})}>
            <Printer className="w-3.5 h-3.5 mr-2" /> PDF Global
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-none shadow-soft bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ventes (est.)</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{totalSales.toLocaleString('fr-FR')}€</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Réservations</p>
                  <p className="text-2xl font-black text-primary mt-1">{reservations?.length || 0}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Package className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-none shadow-soft bg-white rounded-2xl overflow-hidden ${contactMessages?.filter(m => !m.isReplied).length ? 'ring-2 ring-destructive' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Messages À Répondre</p>
                  <p className={`text-2xl font-black mt-1 ${contactMessages?.filter(m => !m.isReplied).length ? 'text-destructive' : 'text-green-600'}`}>
                    {contactMessages?.filter(m => !m.isReplied).length || 0}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${contactMessages?.filter(m => !m.isReplied).length ? 'bg-destructive/10 text-destructive' : 'bg-green-600/10 text-green-600'}`}>
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Patients</p>
                  <p className="text-2xl font-black text-secondary mt-1">{clients?.filter(c => c.role === 'client').length || 0}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 flex w-fit overflow-x-auto">
            <TabsTrigger value="reservations" className="rounded-full font-black uppercase text-[9px] px-4">Flux Résas</TabsTrigger>
            <TabsTrigger value="stock" className="rounded-full font-black uppercase text-[9px] px-4">Inventaire</TabsTrigger>
            <TabsTrigger value="chat" className="rounded-full font-black uppercase text-[9px] px-4">Chat Direct</TabsTrigger>
            <TabsTrigger value="messages" className="rounded-full font-black uppercase text-[9px] px-4">Messages Clients</TabsTrigger>
            <TabsTrigger value="users" className="rounded-full font-black uppercase text-[9px] px-4">Patients</TabsTrigger>
            <TabsTrigger value="staff" className="rounded-full font-black uppercase text-[9px] px-4">Collaborateurs</TabsTrigger>
            <TabsTrigger value="newsletter" className="rounded-full font-black uppercase text-[9px] px-4">Newsletter</TabsTrigger>
            <TabsTrigger value="docs" className="rounded-full font-black uppercase text-[9px] px-4">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="uppercase text-[9px] font-black pl-6 py-2">Client / Réf</TableHead>
                    <TableHead className="uppercase text-[9px] font-black py-2">Statut</TableHead>
                    <TableHead className="uppercase text-[9px] font-black py-2">Montant</TableHead>
                    <TableHead className="uppercase text-[9px] font-black text-right pr-6 py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations && reservations.length > 0 ? reservations.map((r) => (
                    <TableRow key={r.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs">{r.clientId.substring(0, 8)}</span>
                          <span className="text-[9px] text-slate-400 font-mono">#{r.id.substring(0, 6).toUpperCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className={`${
                          r.status === 'pending' ? 'bg-yellow-500' : 
                          r.status === 'processing' ? 'bg-blue-500' : 
                          r.status === 'ready' ? 'bg-primary' : 'bg-green-600'
                        } text-[8px] uppercase px-2 py-0.5`}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 font-black text-xs">{r.totalPrice?.toFixed(2)}€</TableCell>
                      <TableCell className="text-right pr-6 py-2 space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-primary" onClick={() => setActiveDoc({type: 'invoice', data: r})}><Printer className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-secondary" onClick={() => setActiveDoc({type: 'invoice', data: r})}><Download className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-green-600" onClick={() => handleWhatsApp(clients?.find(c => c.id === r.clientId)?.phone)}><MessageCircle className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-blue-500" onClick={() => handleEmail(clients?.find(c => c.id === r.clientId)?.email)}><Mail className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-900" onClick={() => handleShare(r)}><Share2 className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete('reservations', r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">
                        Aucune réservation en attente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <StockManagement />
          </TabsContent>

          <TabsContent value="chat">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
              {/* Chat Sidebar */}
              <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Rechercher un patient..." className="pl-10 h-9 rounded-full bg-slate-50 border-none text-xs" />
                  </div>
                </div>
                <ScrollArea className="h-[calc(600px-70px)]">
                  <div className="p-2 space-y-1">
                    {Object.keys(groupedChats).length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-[10px] font-black uppercase">Aucun chat actif</div>
                    ) : Object.keys(groupedChats).map((cid) => {
                      const chatUser = clients?.find(c => c.id === cid);
                      const lastMsg = groupedChats[cid][0]; // Desc order
                      return (
                        <button 
                          key={cid}
                          onClick={() => setSelectedChatUser(cid)}
                          className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${selectedChatUser === cid ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50'}`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${selectedChatUser === cid ? 'bg-white text-primary' : 'bg-primary/10 text-primary'}`}>
                            {chatUser?.firstName?.[0] || 'P'}
                          </div>
                          <div className="flex-1 text-left overflow-hidden">
                            <p className="text-xs font-black uppercase truncate">{chatUser?.firstName} {chatUser?.lastName}</p>
                            <p className={`text-[10px] truncate ${selectedChatUser === cid ? 'text-white/70' : 'text-slate-400'}`}>
                              {lastMsg?.text}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </Card>

              {/* Chat Window */}
              <Card className="md:col-span-2 border-none shadow-soft rounded-2xl overflow-hidden bg-white flex flex-col">
                {selectedChatUser ? (
                  <>
                    <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs">
                          {clients?.find(c => c.id === selectedChatUser)?.firstName?.[0] || 'P'}
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-tight">
                          {clients?.find(c => c.id === selectedChatUser)?.firstName} {clients?.find(c => c.id === selectedChatUser)?.lastName}
                        </h3>
                      </div>
                    </div>
                    <ScrollArea className="flex-grow p-6">
                      <div className="space-y-4">
                        {[...groupedChats[selectedChatUser]].reverse().map((msg: any, i: number) => (
                          <div key={i} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${
                              msg.senderId === user?.uid 
                              ? 'bg-primary text-white rounded-tr-none' 
                              : 'bg-slate-100 text-slate-700 rounded-tl-none'
                            }`}>
                              <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                              <p className={`text-[8px] mt-2 font-bold uppercase opacity-50 ${msg.senderId === user?.uid ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-white">
                      <form 
                        className="flex gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendAdminReply(selectedChatUser);
                        }}
                      >
                        <Input 
                          placeholder="Écrire une réponse..." 
                          className="rounded-full h-12 bg-slate-50 border-none px-6 text-sm"
                          value={adminReply}
                          onChange={(e) => setAdminReply(e.target.value)}
                        />
                        <Button type="submit" size="icon" className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg shrink-0">
                          <Send className="w-5 h-5" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-slate-300 gap-4">
                    <MessageCircle className="w-16 h-16 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest">Sélectionnez une discussion</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staff">
            <CollaboratorManagement />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="flex items-center gap-2">
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
                  .sort((a, b) => (a.isReplied ? 1 : 0) - (b.isReplied ? 1 : 0))
                  .map((m) => (
                    <div key={m.id} className={`p-4 hover:bg-slate-50/50 transition-colors border-l-4 ${!m.isReplied ? 'border-l-destructive bg-destructive/5' : 'border-l-green-600 bg-green-600/5'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-black text-xs text-slate-900 uppercase">{m.senderName}</h4>
                            {!m.isReplied && (
                              <Badge className="bg-destructive text-white text-[7px] uppercase px-2 py-0.5">À répondre</Badge>
                            )}
                            {m.isReplied && (
                              <Badge className="bg-green-600 text-white text-[7px] uppercase px-2 py-0.5">Répondu</Badge>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium mb-3">
                            {m.submissionDate?.seconds ? new Date(m.submissionDate.seconds * 1000).toLocaleString('fr-FR') : '...'}
                          </p>
                          <p className="text-[11px] text-slate-700 leading-relaxed">{m.messageContent}</p>
                          {m.senderPhone && (
                            <p className="text-[9px] text-slate-500 mt-2 font-mono">📞 {m.senderPhone}</p>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {!m.isReplied && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full"
                              onClick={() => markAsRead(m.id)}
                              title="Marquer comme traité"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-secondary hover:bg-secondary/10 rounded-full"
                            onClick={() => handleWhatsApp(m.senderPhone)}
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full"
                            onClick={() => window.open(`mailto:${m.senderEmail}?subject=Contact Pharmacie`)}
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full"
                            onClick={() => setActiveDoc({type: 'letter', data: m})}
                            title="Imprimer"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => handleDelete('contactMessages', m.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                  : (
                    <div className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">
                      Aucun message client
                    </div>
                  )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="uppercase text-[9px] font-black pl-6">Patient</TableHead>
                    <TableHead className="uppercase text-[9px] font-black">Rôle</TableHead>
                    <TableHead className="uppercase text-[9px] font-black text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients && clients.length > 0 ? clients.map((c) => (
                    <TableRow key={c.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-2 font-bold text-xs">{c.firstName} {c.lastName}</TableCell>
                      <TableCell className="py-2"><Badge variant="outline" className="text-[8px] uppercase">{c.role}</Badge></TableCell>
                      <TableCell className="text-right pr-6 py-2 space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-secondary" onClick={() => handleWhatsApp(c.phone)}><MessageCircle className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-500" onClick={() => handleEmail(c.email)}><Mail className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete('userProfiles', c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">
                        Aucun patient enregistré
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="uppercase text-[9px] font-black pl-6 py-2">Email</TableHead>
                    <TableHead className="uppercase text-[9px] font-black py-2">Date d'inscription</TableHead>
                    <TableHead className="uppercase text-[9px] font-black text-right pr-6 py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers && subscribers.length > 0 ? subscribers.map((s: any) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-2 font-bold text-xs">{s.email}</TableCell>
                      <TableCell className="py-2 text-[10px] text-slate-500 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-2 space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => window.open(`mailto:${s.email}`)}><Mail className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete('newsletter', s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">
                        Aucun abonné newsletter
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="docs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Facture Client", desc: "Justificatif de paiement", type: "invoice", icon: FileText },
                { title: "Rapport Stock", desc: "Bilan des écarts", type: "report", icon: TrendingUp },
                { title: "Lettre Officielle", desc: "Modèle type ARS/CPAM", type: "letter", icon: BookOpen }
              ].map((item) => (
                <Card key={item.type} className="border-none shadow-soft hover:shadow-md transition-all cursor-pointer group rounded-2xl bg-white" onClick={() => setActiveDoc({type: item.type, data: {}})}>
                  <CardContent className="p-4">
                    <item.icon className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-black uppercase text-[10px] mb-1">{item.title}</h3>
                    <p className="text-[9px] text-slate-500 mb-3">{item.desc}</p>
                    <Button variant="outline" className="w-full h-7 rounded-lg text-[9px] font-black uppercase">Générer</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

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
