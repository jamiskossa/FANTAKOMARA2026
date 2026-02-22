
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Plus,
  Search,
  Printer,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { DocumentPreview } from '@/components/admin/DocumentPreview';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [activeDoc, setActiveDoc] = useState<{type: string, data: any} | null>(null);

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

  // Dynamic Queries
  const productsQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'products'), limit(50));
  }, [db, profile]);
  const { data: products } = useCollection(productsQuery);

  const reservationsQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'reservations'), orderBy('createdAt', 'desc'), limit(20));
  }, [db, profile]);
  const { data: reservations } = useCollection(reservationsQuery);

  const clientsQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'userProfiles'), limit(100));
  }, [db, profile]);
  const { data: clients } = useCollection(clientsQuery);

  const suppliersQuery = useMemoFirebase(() => {
    if (!profile || profile.role !== 'admin') return null;
    return query(collection(db, 'suppliers'), limit(50));
  }, [db, profile]);
  const { data: suppliers } = useCollection(suppliersQuery);

  const handleDelete = (collectionName: string, id: string) => {
    if (confirm("Confirmer la suppression ?")) {
      deleteDocumentNonBlocking(doc(db, collectionName, id));
      toast({ title: "Supprimé", description: "L'élément a été retiré." });
    }
  };

  const handleWhatsApp = (phone?: string) => {
    if (!phone) return toast({ title: "Erreur", description: "Pas de numéro", variant: "destructive" });
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}`, '_blank');
  };

  const handleMail = (email?: string) => {
    if (!email) return toast({ title: "Erreur", description: "Pas d'email", variant: "destructive" });
    window.location.href = `mailto:${email}`;
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Header Compact */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
              Pilotage Officine
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full font-black uppercase text-[10px] h-9 px-4">
              <Printer className="w-3.5 h-3.5 mr-2" /> PDF Global
            </Button>
            <Button size="sm" className="rounded-full bg-slate-900 font-black uppercase text-[10px] h-9 px-4">
              <Plus className="w-3.5 h-3.5 mr-2" /> Nouveau
            </Button>
          </div>
        </div>

        {/* Quick Stats Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Ventes (est.)", val: "2 450€", icon: TrendingUp, color: "text-slate-900" },
            { label: "Réservations", val: reservations?.length || 0, icon: Package, color: "text-primary" },
            { label: "Stock Alerte", val: "12", icon: ShieldCheck, color: "text-destructive" },
            { label: "Patients", val: clients?.filter(c => c.role === 'client').length || 0, icon: Users, color: "text-secondary" }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-soft bg-white">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400 leading-none mb-1">{stat.label}</p>
                  <p className={`text-sm font-black ${stat.color}`}>{stat.val}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 flex w-fit overflow-x-auto">
            <TabsTrigger value="reservations" className="rounded-full font-black uppercase text-[9px] px-4">Flux Résas</TabsTrigger>
            <TabsTrigger value="products" className="rounded-full font-black uppercase text-[9px] px-4">Stock</TabsTrigger>
            <TabsTrigger value="users" className="rounded-full font-black uppercase text-[9px] px-4">Patients</TabsTrigger>
            <TabsTrigger value="suppliers" className="rounded-full font-black uppercase text-[9px] px-4">Annuaire</TabsTrigger>
            <TabsTrigger value="docs" className="rounded-full font-black uppercase text-[9px] px-4">Documents</TabsTrigger>
          </TabsList>

          {/* RESERVATIONS */}
          <TabsContent value="reservations">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
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
                  {reservations?.map((r) => (
                    <TableRow key={r.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs">{r.clientId.substring(0, 8)}</span>
                          <span className="text-[9px] text-slate-400 font-mono">#{r.id.substring(0, 6).toUpperCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2"><Badge className="bg-secondary text-[8px] uppercase px-2 py-0.5">{r.status}</Badge></TableCell>
                      <TableCell className="py-2 font-black text-xs">{r.totalPrice?.toFixed(2)}€</TableCell>
                      <TableCell className="text-right pr-6 py-2 space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => setActiveDoc({type: 'invoice', data: r})}><FileText className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-secondary" onClick={() => handleWhatsApp(r.phone)}><MessageCircle className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete('reservations', r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* STOCK */}
          <TabsContent value="products">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
              <div className="p-3 bg-white border-b border-slate-50 flex items-center justify-between">
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <Input placeholder="Filtrer..." className="h-7 pl-8 text-[10px] rounded-lg bg-slate-50 border-none" />
                </div>
                <Badge variant="outline" className="bg-destructive/5 text-destructive border-none text-[8px]">12 alertes</Badge>
              </div>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="uppercase text-[9px] font-black pl-6">Produit</TableHead>
                    <TableHead className="uppercase text-[9px] font-black">Stock (I/F)</TableHead>
                    <TableHead className="uppercase text-[9px] font-black">Péremption</TableHead>
                    <TableHead className="uppercase text-[9px] font-black text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs">{p.name}</span>
                          <span className="text-[8px] uppercase text-slate-400">{p.brand}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-xs font-bold">{p.stockInitial || 0} / {p.stockFinal || 0}</TableCell>
                      <TableCell className="py-2 text-xs">{p.expiryDate || '-'}</TableCell>
                      <TableCell className="text-right pr-6 py-2">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Settings className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* PATIENTS */}
          <TabsContent value="users">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="uppercase text-[9px] font-black pl-6">Patient</TableHead>
                    <TableHead className="uppercase text-[9px] font-black">Contact</TableHead>
                    <TableHead className="uppercase text-[9px] font-black text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients?.filter(c => c.role === 'client').map((c) => (
                    <TableRow key={c.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-2 font-bold text-xs">{c.firstName} {c.lastName}</TableCell>
                      <TableCell className="py-2 text-[10px] text-slate-500">{c.email}</TableCell>
                      <TableCell className="text-right pr-6 py-2 space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-secondary" onClick={() => handleWhatsApp(c.phone)}><MessageCircle className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => handleMail(c.email)}><Mail className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete('userProfiles', c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* ANNUAIRE */}
          <TabsContent value="suppliers">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="uppercase text-[9px] font-black pl-6">Entité</TableHead>
                    <TableHead className="uppercase text-[9px] font-black">Type</TableHead>
                    <TableHead className="uppercase text-[9px] font-black text-right pr-6">Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers?.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-2 font-bold text-xs">{s.name}</TableCell>
                      <TableCell className="py-2"><Badge variant="secondary" className="text-[8px] uppercase">{s.type}</Badge></TableCell>
                      <TableCell className="text-right pr-6 py-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => handleWhatsApp(s.phone)}>Appeler</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!suppliers || suppliers.length === 0) && (
                    <TableRow><TableCell colSpan={3} className="text-center py-10 text-slate-400 text-[10px]">Aucun contact fournisseur.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* DOCUMENTS */}
          <TabsContent value="docs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Facture Client", desc: "Justificatif de paiement", type: "invoice", icon: FileText },
                { title: "Rapport Stock", desc: "Bilan des écarts", type: "report", icon: TrendingUp },
                { title: "Lettre Officielle", desc: "Modèle type ARS/CPAM", type: "letter", icon: BookOpen }
              ].map((item) => (
                <Card key={item.type} className="border-none shadow-soft hover:shadow-md transition-all cursor-pointer group rounded-2xl" onClick={() => setActiveDoc({type: item.type, data: {}})}>
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
