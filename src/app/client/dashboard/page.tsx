"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, orderBy, limit, startAfter, addDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, Package, Clock, MapPin, MessageSquare, Plus, Send,
  HeartPulse, CheckCircle2, AlertCircle, Truck, Info, Star,
  BarChart3, TrendingUp, History
} from 'lucide-react';
import Link from 'next/link';
import { ReviewSection } from '@/components/client/ReviewSection';

export default function ClientDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [newMessage, setNewMessage] = useState('');
  const [reservationsLimit, setReservationsLimit] = useState(5); // lazy load
  const scrollRef = useRef<HTMLDivElement>(null);

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // Redirection selon rôle
  useEffect(() => {
    if (!isUserLoading && !user) router.push('/login');
    else if (!isProfileLoading && profile) {
      if (profile.role === 'admin') router.push('/admin/dashboard');
      else if (['collaborator', 'collaborateur'].includes(profile.role)) router.push('/collaborateur/dashboard');
    }
  }, [user, isUserLoading, profile, isProfileLoading, router]);

  // Réservations avec lazy load
  const reservationsQuery = useMemoFirebase(() => {
    if (!user || !profile) return null;
    return query(
      collection(db, 'reservations'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(reservationsLimit)
    );
  }, [user, db, profile, reservationsLimit]);

  const { data: reservations, isLoading: isReservationsLoading } = useCollection(reservationsQuery);

  const chatQuery = useMemoFirebase(() => {
    if (!user || !profile) return null;
    return query(
      collection(db, 'supportMessages'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [user, db, profile]);

  const { data: messages } = useCollection(chatQuery);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  // Couleurs et icônes statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'prepared': 
      case 'ready': return 'bg-primary';
      case 'delivered': return 'bg-slate-500';
      default: return 'bg-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-5 h-5" />;
      case 'processing': return <Clock className="w-5 h-5" />;
      case 'prepared': return <CheckCircle2 className="w-5 h-5" />;
      case 'ready': return <Package className="w-5 h-5" />;
      case 'delivered': return <Truck className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En préparation';
      case 'prepared': return 'Préparé';
      case 'ready': return 'Prêt au retrait';
      case 'delivered': return 'Livré';
      default: return status;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Votre commande a été reçue';
      case 'processing': return 'Notre équipe prépare votre commande';
      case 'prepared': return 'Votre commande est en cours de finition';
      case 'ready': return 'Votre commande est prête au retrait';
      case 'delivered': return 'Commande livrée';
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateStr));
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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

          {/* Tabs */}
          <Tabs defaultValue="reservations" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 flex w-full max-w-3xl mx-auto overflow-x-auto">
              <TabsTrigger value="reservations" className="flex-1 rounded-full font-black uppercase text-[8px] sm:text-[9px] data-[state=active]:bg-primary data-[state=active]:text-white h-10">
                <Package className="w-3.5 h-3.5 mr-1.5" /> Suivi
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1 rounded-full font-black uppercase text-[8px] sm:text-[9px] data-[state=active]:bg-primary data-[state=active]:text-white h-10">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Chat
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1 rounded-full font-black uppercase text-[8px] sm:text-[9px] data-[state=active]:bg-primary data-[state=active]:text-white h-10">
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Mon Bilan
              </TabsTrigger>
              <TabsTrigger value="review" className="flex-1 rounded-full font-black uppercase text-[8px] sm:text-[9px] data-[state=active]:bg-primary data-[state=active]:text-white h-10">
                <Star className="w-3.5 h-3.5 mr-1.5" /> Donner mon avis
              </TabsTrigger>
              <TabsTrigger value="instructions" className="flex-1 rounded-full font-black uppercase text-[8px] sm:text-[9px] data-[state=active]:bg-primary data-[state=active]:text-white h-10">
                <HeartPulse className="w-3.5 h-3.5 mr-1.5" /> Guide
              </TabsTrigger>
            </TabsList>

            {/* Reservations */}
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
                      <div className={`h-3 w-full ${getStatusColor(res.status)}`} />
                      <CardContent className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${getStatusColor(res.status)}`}>
                                {getStatusIcon(res.status)}
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase">{getStatusLabel(res.status)}</h4>
                                <p className="text-[8px] text-slate-500">{getStatusDescription(res.status)}</p>
                              </div>
                            </div>
                            <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase tracking-tighter mt-2">
                              {res.type === 'prescription' ? '💊 Ordonnance' : '🛍️ Retrait Click & Collect'}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                              <span className="flex items-center text-[10px] text-slate-600 font-bold">
                                <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
                                {formatDate(res.createdAt)}
                              </span>
                              <span className="flex items-center text-[10px] text-slate-600 font-bold">
                                <MapPin className="h-3.5 w-3.5 mr-1.5 text-secondary" /> 
                                Ivry-sur-Seine
                              </span>
                              <span className="flex items-center text-[10px] text-slate-600 font-bold">
                                <Package className="h-3.5 w-3.5 mr-1.5" /> 
                                #{res.id.substring(0, 8).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="md:text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Montant Total</p>
                            <p className="text-3xl lg:text-4xl font-black text-secondary tracking-tighter">{res.totalPrice?.toFixed(2) || '0,00'}€</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2 pt-4 border-t border-slate-100">
                          {['pending','processing','prepared','ready','delivered'].map((stepStatus) => {
                            const statuses = ['pending','processing','prepared','ready','delivered'];
                            const isActive = statuses.indexOf(res.status) >= statuses.indexOf(stepStatus);
                            const iconsMap: Record<string, React.ReactNode> = {
                              pending: <AlertCircle className="w-3 h-3" />,
                              processing: <Clock className="w-3 h-3" />,
                              prepared: <CheckCircle2 className="w-3 h-3" />,
                              ready: <Package className="w-3 h-3" />,
                              delivered: <Truck className="w-3 h-3" />
                            };
                            const labelMap: Record<string,string> = {
                              pending: 'Reçue',
                              processing: 'Prépa',
                              prepared: 'Prêt',
                              ready: 'Retrait',
                              delivered: 'Livré'
                            };
                            return (
                              <div key={stepStatus} className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black mb-1 transition-colors ${
                                  isActive ? getStatusColor(res.status) : 'bg-slate-200'
                                }`}>
                                  {iconsMap[stepStatus]}
                                </div>
                                <p className="text-[7px] font-black text-slate-600 text-center uppercase">{labelMap[stepStatus]}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Lazy load button */}
                  {(reservations?.length || 0) >= reservationsLimit && (
                    <div className="text-center mt-4">
                      <Button onClick={() => setReservationsLimit(prev => prev + 5)} variant="outline">Voir plus</Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Stats, Review, Chat, Instructions */}
            <TabsContent value="stats" className="space-y-6">{/* ...identique à ton code actuel */}</TabsContent>
            <TabsContent value="review"><ReviewSection /></TabsContent>
            <TabsContent value="chat">
              <Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white h-[500px] sm:h-[600px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-slate-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm sm:text-lg font-black uppercase tracking-tight">Conseils Pharmaciens</CardTitle>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Réponse rapide de notre équipe</p>
                      </div>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse"></div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-grow p-4 sm:p-6" ref={scrollRef}>
                    <div className="space-y-6">
                      <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[80%] bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                          <p className="text-xs sm:text-sm font-medium text-slate-700">Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?</p>
                        </div>
                      </div>
                      {messages?.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl ${
                            msg.senderId === user?.uid ? 'bg-secondary text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'
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
                                            <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-6">
              <Card className="p-6 lg:p-8 bg-white rounded-[32px] shadow-soft border-none">
                <h3 className="text-xl font-black text-slate-900 uppercase mb-4">Guide d'utilisation</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                  <li>Suivez vos réservations en temps réel depuis l'onglet Suivi.</li>
                  <li>Discutez avec notre équipe via le chat pour toute question.</li>
                  <li>Donnez votre avis pour nous aider à améliorer le service.</li>
                  <li>Consultez vos statistiques pour suivre votre activité.</li>
                  <li>Créez une nouvelle ordonnance rapidement avec le bouton dédié.</li>
                </ul>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}