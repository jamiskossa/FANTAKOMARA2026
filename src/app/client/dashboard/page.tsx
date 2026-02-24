
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
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  Truck,
  Info,
  Star,
  BarChart3,
  TrendingUp,
  History
} from 'lucide-react';
import Link from 'next/link';
import { ReviewSection } from '@/components/client/ReviewSection';

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
                                {new Date(res.createdAt).toLocaleDateString('fr-FR')}
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
                          {[
                            { status: 'pending', label: 'Reçue', icon: <AlertCircle className="w-3 h-3" /> },
                            { status: 'processing', label: 'Prépa', icon: <Clock className="w-3 h-3" /> },
                            { status: 'prepared', label: 'Prêt', icon: <CheckCircle2 className="w-3 h-3" /> },
                            { status: 'ready', label: 'Retrait', icon: <Package className="w-3 h-3" /> },
                            { status: 'delivered', label: 'Livré', icon: <Truck className="w-3 h-3" /> }
                          ].map((step, idx) => {
                            const statuses = ['pending', 'processing', 'prepared', 'ready', 'delivered'];
                            const isActive = statuses.indexOf(res.status) >= statuses.indexOf(step.status);
                            return (
                              <div key={step.status} className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black mb-1 transition-colors ${
                                  isActive ? getStatusColor(res.status) : 'bg-slate-200'
                                }`}>
                                  {step.icon}
                                </div>
                                <p className="text-[7px] font-black text-slate-600 text-center uppercase">{step.label}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-none shadow-soft rounded-2xl bg-white p-6">
                  <TrendingUp className="w-6 h-6 text-primary mb-3" />
                  <p className="text-[10px] font-black uppercase text-slate-400">Total Réservations</p>
                  <p className="text-3xl font-black text-slate-900">{reservations?.length || 0}</p>
                </Card>
                <Card className="border-none shadow-soft rounded-2xl bg-white p-6">
                  <History className="w-6 h-6 text-secondary mb-3" />
                  <p className="text-[10px] font-black uppercase text-slate-400">Dernière visite</p>
                  <p className="text-xl font-black text-slate-900">
                    {reservations?.[0] ? new Date(reservations[0].createdAt).toLocaleDateString() : 'Aucune'}
                  </p>
                </Card>
                <Card className="border-none shadow-soft rounded-2xl pharma-gradient p-6 text-white sm:col-span-2 lg:col-span-1">
                  <Star className="w-6 h-6 text-white/50 mb-3" />
                  <p className="text-[10px] font-black uppercase text-white/70">Avantages Fidélité</p>
                  <p className="text-xl font-black">Membre Premium</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="review">
              <ReviewSection />
            </TabsContent>

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
                <Card className="border-none shadow-soft rounded-[32px] bg-gradient-to-br from-primary/5 to-transparent p-8 border-l-4 border-l-primary">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Instructions Ordonnance</h3>
                      <p className="text-[9px] text-slate-500 font-medium mt-1">Conditions de retrait</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>Apportez l'original de votre ordonnance lors du retrait.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>N'oubliez pas votre Carte Vitale à jour.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>Présentez une pièce d'identité.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>Horaires : Lun-Ven 9h-19h, Sam 9h-13h</span>
                    </li>
                  </ul>
                </Card>

                <Card className="border-none shadow-soft rounded-[32px] bg-gradient-to-br from-secondary/5 to-transparent p-8 border-l-4 border-l-secondary">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Conseils Santé</h3>
                      <p className="text-[9px] text-slate-500 font-medium mt-1">À savoir</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <span>Consultez l'ordonnance avant de venir.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <span>Vérifiez les médicaments à la réception.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <span>Nos pharmaciens sont là pour vous conseiller.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <span>Appelez-nous pour toute question.</span>
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
