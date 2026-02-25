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
  LogOut,
  Search,
  MessageCircle,
  Eye,
  EyeOff,
  Printer
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
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [collabReply, setCollabReply] = useState('');
  const [sessionStartTime] = useState(new Date());

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // Log connection when the dashboard is opened
  useEffect(() => {
    if (user && profile && (profile.role === 'collaborator' || profile.role === 'collaborateur')) {
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

  // Redirection client si non collaborateur
  useEffect(() => {
    if (!isUserLoading && user && !isProfileLoading && profile && profile.role !== 'collaborator' && profile.role !== 'collaborateur' && profile.role !== 'admin') {
      router.push('/client/dashboard');
    }
  }, [user, isUserLoading, profile, isProfileLoading, router]);

  // Messages de contact (accessibles au staff)
  const contactMessagesQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'collaborateur' && profile.role !== 'admin')) return null;
    return query(collection(db, 'contactMessages'), orderBy('submissionDate', 'desc'), limit(50));
  }, [db, profile]);
  const { data: contactMessages } = useCollection(contactMessagesQuery);

  // File active : À préparer ou en cours
  const activeOrdersQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'collaborateur' && profile.role !== 'admin')) return null;
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
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'collaborateur' && profile.role !== 'admin')) return null;
    return query(collection(db, 'products'), limit(100));
  }, [db, profile]);
  const { data: products } = useCollection(productsQuery);

  // Chat Interne Staff
  const staffChatQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'collaborateur' && profile.role !== 'admin')) return null;
    return query(collection(db, 'staffMessages'), orderBy('createdAt', 'asc'), limit(50));
  }, [db, profile]);
  const { data: staffMessages } = useCollection(staffChatQuery);

  // Profils Clients
  const clientsQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'collaborateur' && profile.role !== 'admin')) return null;
    return query(collection(db, 'userProfiles'), limit(100));
  }, [db, profile]);
  const { data: clients } = useCollection(clientsQuery);

  // Chat Support Clients
  const supportChatQuery = useMemoFirebase(() => {
    if (!profile || (profile.role !== 'collaborator' && profile.role !== 'collaborateur' && profile.role !== 'admin')) return null;
    return query(collection(db, 'supportMessages'), orderBy('createdAt', 'desc'), limit(100));
  }, [db, profile]);
  const { data: allSupportMessages } = useCollection(supportChatQuery);

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

  const handleSendCollabReply = async (clientId: string) => {
    if (!collabReply.trim() || !user) return;
    try {
      await addDoc(collection(db, 'supportMessages'), {
        clientId,
        senderId: user.uid,
        senderName: `Pharmacie (${profile?.firstName})`,
        text: collabReply,
        createdAt: new Date().toISOString()
      });
      setCollabReply('');
      toast({ title: "Réponse envoyée" });
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message.", variant: "destructive" });
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* --- Dashboard content (identique à ton composant actuel) --- */}
        {/* Garde toutes les sections : file active, stock, chat, messages, documents, etc. */}
        {/* ... */}
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