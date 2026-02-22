
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
  Send,
  HeartPulse
} from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [newMessage, setNewMessage] = useState('');

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

  const reservationsQuery = useMemoFirebase(() => {
    if (!user || !profile) return null;
    return query(
      collection(db, 'reservations'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user, db, profile]);

  const { data: reservations, isLoading: isReservationsLoading } = useCollection(reservationsQuery);

  const chatQuery = useMemoFirebase(() => {
    if (!user || !profile) return null;
    return query(
      collection(db, 'supportMessages'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );
  }, [user, db, profile]);

  const { data: messages } = useCollection(chatQuery);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, 'supportMessages'), {
      clientId: user.uid,
      senderId: user.uid,
      text: newMessage,
      createdAt: new Date().toISOString()
    });
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'prepared': return 'bg-primary';
      case 'ready': return 'bg-primary';
      case 'delivered': return 'bg-slate-500';
      default: return 'bg-slate-300';
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter">Mon Espace Santé</h1>
              <p className="text-slate-500 font-medium mt-1">Suivez vos réservations et échangez avec nous.</p>
            </div>
            <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest h-12 sm:h-14 px-8 shadow-xl shadow-secondary/20 text-[10px] sm:text-xs">
              <Link href="/scan-ordonnance">
                <Plus className="mr-2 h-5 w-5" />
                Nouvelle Ordonnance
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="reservations" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 flex w-full max-w-2xl mx-auto overflow-x-auto">
              <TabsTrigger value="reservations" className="flex-1 rounded-full font-black uppercase text-[9px] sm:text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                <Package className="w-3.5 h-3.5 mr-2" /> Réservations
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1 rounded-full font-black uppercase text-[9px] sm:text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                <MessageSquare className="w-3.5 h-3.5 mr-2" /> Messagerie
              </TabsTrigger>
              <TabsTrigger value="instructions" className="flex-1 rounded-full font-black uppercase text-[9px] sm:text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                <HeartPulse className="w-3.5 h-3.5 mr-2" /> Instructions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reservations" className="space-y-6">
              {isReservationsLoading ? (
                <div className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>
              ) : reservations?.length === 0 ? (
                <Card className="border-none shadow-soft p-12 lg:p-20 text-center bg-white rounded-[40px]">
                  <Package className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                  <p className="text-slate-400 font-bold text-lg">Aucune réservation pour le moment.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {reservations?.map((res) => (
                    <Card key={res.id} className="border-none shadow-soft overflow-hidden bg-white rounded-[32px] hover:-translate-y-1 transition-all">
                      <div className={`h-2 w-full ${getStatusColor(res.status)}`} />
                      <CardContent className="p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Badge className={`${getStatusColor(res.status)} text-white border-none font-black text-[10px] uppercase px-4 py-1 rounded-full`}>
                                {res.status}
                              </Badge>
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">#{res.id.substring(0, 8).toUpperCase()}</span>
                            </div>
                            <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase tracking-tighter">
                              {res.type === 'prescription' ? 'Ordonnance' : 'Retrait Click & Collect'}
                            </h3>
                            <div className="flex items-center text-[10px] text-slate-500 font-bold gap-4 uppercase tracking-widest">
                              <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5 text-primary" /> {new Date(res.createdAt).toLocaleDateString()}</span>
                              <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1.5 text-secondary" /> Ivry-sur-Seine</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-2xl lg:text-3xl font-black text-secondary tracking-tighter">{res.totalPrice?.toFixed(2) || '0,00'}€</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat">
              <Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white h-[500px] sm:h-[600px] flex flex-col">
                <CardHeader className="bg-primary/5 border-b border-slate-100 p-6 text-center">
                  <CardTitle className="text-sm sm:text-lg font-black uppercase tracking-tight">Conseils Pharmaciens</CardTitle>
                  <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest">Réponse rapide de notre équipe</p>
                </CardHeader>
                <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-grow p-4 sm:p-6">
                    <div className="space-y-6">
                      <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[80%] bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                          <p className="text-xs sm:text-sm font-medium text-slate-700">Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?</p>
                        </div>
                      </div>
                      {messages?.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl ${
                            msg.senderId === user?.uid 
                            ? 'bg-secondary text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-700 rounded-tl-none'
                          }`}>
                            <p className="text-xs sm:text-sm font-medium">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <form onSubmit={handleSendMessage} className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                    <Input 
                      placeholder="Votre message..." 
                      className="rounded-full h-10 sm:h-12 bg-white text-xs sm:text-sm"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-primary shrink-0">
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-soft rounded-[32px] bg-white p-8 border-l-4 border-l-primary">
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
