
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Package, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  Send,
  HeartPulse,
  AlertCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [newMessage, setNewMessage] = useState('');

  // Chargement du profil pour être sûr des droits avant de requêter
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

  // Query Réservations - Uniquement si profil chargé et user présent
  const reservationsQuery = useMemoFirebase(() => {
    if (!user || isProfileLoading) return null;
    return query(
      collection(db, 'reservations'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user, db, isProfileLoading]);

  const { data: reservations, isLoading: isReservationsLoading } = useCollection(reservationsQuery);

  // Query Chat (Support) - Uniquement si profil chargé et user présent
  const chatQuery = useMemoFirebase(() => {
    if (!user || isProfileLoading) return null;
    return query(
      collection(db, 'supportMessages'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );
  }, [user, db, isProfileLoading]);

  const { data: messages, isLoading: isChatLoading } = useCollection(chatQuery);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'supportMessages'), {
        clientId: user.uid,
        senderId: user.uid,
        senderName: profile?.firstName || user.displayName || user.email,
        text: newMessage,
        createdAt: serverTimestamp(),
        read: false
      });
      setNewMessage('');
    } catch (e) {
      console.error("Erreur lors de l'envoi du message:", e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'prepared': return 'bg-primary';
      case 'ready': return 'bg-primary';
      case 'delivered': return 'bg-slate-500';
      case 'canceled': return 'bg-destructive';
      default: return 'bg-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En préparation';
      case 'prepared': return 'Préparée';
      case 'ready': return 'Prêt au retrait';
      case 'delivered': return 'Récupérée';
      case 'canceled': return 'Annulée';
      default: return status;
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
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 lg:mb-12 gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter">Mon Espace Santé</h1>
              <p className="text-slate-500 font-medium mt-1">Gérez vos réservations et échangez avec nos pharmaciens.</p>
            </div>
            <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest h-12 lg:h-14 px-8 shadow-xl shadow-secondary/20 transition-all active:scale-95">
              <Link href="/scan-ordonnance">
                <Plus className="mr-2 h-5 w-5" />
                Nouvelle Ordonnance
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="reservations" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 flex w-full max-w-2xl mx-auto overflow-x-auto">
              <TabsTrigger value="reservations" className="flex-1 rounded-full font-black uppercase text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap">
                <Package className="w-3.5 h-3.5 mr-2" /> Réservations
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1 rounded-full font-black uppercase text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap">
                <MessageSquare className="w-3.5 h-3.5 mr-2" /> Messagerie
              </TabsTrigger>
              <TabsTrigger value="instructions" className="flex-1 rounded-full font-black uppercase text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap">
                <HeartPulse className="w-3.5 h-3.5 mr-2" /> Mes Instructions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reservations" className="space-y-6">
              {isReservationsLoading ? (
                <div className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>
              ) : !reservations || reservations.length === 0 ? (
                <Card className="border-none shadow-soft p-12 lg:p-20 text-center bg-white rounded-[40px]">
                  <Package className="h-16 w-16 lg:h-20 lg:w-20 text-slate-100 mx-auto mb-6" />
                  <p className="text-slate-400 font-bold text-lg">Vous n'avez pas encore de réservations.</p>
                  <Button variant="link" asChild className="mt-4 text-primary font-black uppercase tracking-widest">
                    <Link href="/categorie/sante">Découvrir nos produits</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {reservations.map((res) => (
                    <Card key={res.id} className="border-none shadow-soft overflow-hidden group bg-white rounded-[32px] hover:-translate-y-1 transition-all duration-300">
                      <div className={`h-2 w-full ${getStatusColor(res.status)}`} />
                      <CardContent className="p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Badge className={`${getStatusColor(res.status)} text-white border-none font-black text-[10px] uppercase px-4 py-1 rounded-full`}>
                                {getStatusLabel(res.status)}
                              </Badge>
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                #{res.id.substring(0, 8).toUpperCase()}
                              </span>
                            </div>
                            <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase tracking-tighter">
                              {res.deliveryOption === 'click-and-collect' ? 'Retrait Pharmacie' : 'Livraison Domicile'}
                            </h3>
                            <div className="flex flex-wrap items-center text-[10px] text-slate-500 font-bold gap-4 uppercase tracking-widest">
                              <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5 text-primary" /> {res.createdAt ? (typeof res.createdAt === 'string' ? new Date(res.createdAt).toLocaleDateString('fr-FR') : new Date(res.createdAt.seconds * 1000).toLocaleDateString('fr-FR')) : '...'}</span>
                              <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1.5 text-secondary" /> {res.deliveryOption === 'click-and-collect' ? 'Ivry' : 'Votre adresse'}</span>
                            </div>
                          </div>
                          <div className="text-right flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                              <p className="text-2xl lg:text-3xl font-black text-secondary tracking-tighter">{res.totalPrice?.toFixed(2).replace('.', ',')}€</p>
                            </div>
                            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-100 text-slate-400 hover:text-primary transition-all">
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat">
              <Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white h-[600px] flex flex-col">
                <CardHeader className="bg-primary/5 border-b border-slate-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight">Support Pharmacien</CardTitle>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Équipe disponible 09h - 20h</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-0 flex flex-col">
                  <ScrollArea className="flex-grow p-6">
                    <div className="space-y-6">
                      <div className="flex justify-start">
                        <div className="max-w-[80%] bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                          <p className="text-sm font-medium text-slate-700">Bonjour ! Comment pouvons-nous vous aider aujourd'hui ? Que ce soit pour une question sur un médicament ou le suivi de votre commande, nous sommes là.</p>
                          <span className="text-[9px] font-bold text-slate-400 mt-2 block uppercase">Système automatique</span>
                        </div>
                      </div>
                      
                      {messages?.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.senderId === user?.uid 
                            ? 'bg-secondary text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-700 rounded-tl-none'
                          }`}>
                            <p className="text-sm font-medium">{msg.text}</p>
                            <span className={`text-[9px] font-bold mt-2 block uppercase ${
                              msg.senderId === user?.uid ? 'text-white/60' : 'text-slate-400'
                            }`}>
                              {msg.createdAt ? (typeof msg.createdAt === 'object' && 'seconds' in msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})) : '...'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                    <Input 
                      placeholder="Votre message..." 
                      className="rounded-full h-12 bg-white border-slate-200"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" className="rounded-full h-12 w-12 bg-primary shadow-lg shadow-primary/20">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-soft rounded-[32px] bg-white p-8">
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">Urgence & Garde</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                    En dehors de nos horaires d'ouverture (09h-20h), contactez le 17 pour connaître la pharmacie de garde la plus proche ou appelez le 15 en cas d'urgence médicale.
                  </p>
                  <Button variant="outline" className="rounded-full w-full border-red-100 text-red-500 font-black uppercase text-[10px]">Voir pharmacies de garde</Button>
                </Card>

                <Card className="border-none shadow-soft rounded-[32px] bg-white p-8 border-l-4 border-l-primary">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">Instructions Ordonnance</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                      Apportez l'original de votre ordonnance lors du retrait.
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                      N'oubliez pas votre Carte Vitale à jour.
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                      Les médicaments réservés sont mis de côté pendant 48h.
                    </li>
                  </ul>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
