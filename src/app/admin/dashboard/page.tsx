
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, doc, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  Settings, 
  ClipboardList,
  ShieldCheck,
  LayoutDashboard,
  Trash2,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Download,
  Share2,
  BookOpen,
  Plus,
  Search,
  Printer
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

  // Actions
  const handleDelete = (collectionName: string, id: string) => {
    if (confirm("Confirmer la suppression ?")) {
      deleteDocumentNonBlocking(doc(db, collectionName, id));
      toast({ title: "Supprimé", description: "L'élément a été retiré avec succès." });
    }
  };

  const handleWhatsApp = (phone?: string) => {
    if (!phone) return toast({ title: "Erreur", description: "Pas de numéro valide", variant: "destructive" });
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}`, '_blank');
  };

  const handleMail = (email?: string) => {
    if (!email) return toast({ title: "Erreur", description: "Pas d'email valide", variant: "destructive" });
    window.location.href = `mailto:${email}`;
  };

  const generateDoc = (type: string, data: any) => {
    setActiveDoc({ type, data });
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
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Admin
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full font-black uppercase text-[9px] h-8">
              <Printer className="w-3 h-3 mr-1" /> Imprimer Rapport
            </Button>
            <Button size="sm" className="rounded-full bg-slate-900 font-black uppercase text-[9px] h-8">
              <Plus className="w-3 h-3 mr-1" /> Stock
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-soft bg-white">
            <CardContent className="p-4">
              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Ventes (Est.)</p>
              <div className="text-xl font-black">2 450€</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft bg-white">
            <CardContent className="p-4">
              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Réservations</p>
              <div className="text-xl font-black text-primary">{reservations?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft bg-white">
            <CardContent className="p-4">
              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Stock Critique</p>
              <div className="text-xl font-black text-destructive">12</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft bg-white">
            <CardContent className="p-4">
              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Patients</p>
              <div className="text-xl font-black text-secondary">{clients?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-full shadow-soft border border-slate-100 w-full overflow-x-auto justify-start md:justify-center">
            <TabsTrigger value="reservations" className="rounded-full font-black uppercase text-[9px] px-4">Réservations</TabsTrigger>
            <TabsTrigger value="products" className="rounded-full font-black uppercase text-[9px] px-4">Stock Avancé</TabsTrigger>
            <TabsTrigger value="users" className="rounded-full font-black uppercase text-[9px] px-4">Clients</TabsTrigger>
            <TabsTrigger value="suppliers" className="rounded-full font-black uppercase text-[9px] px-4">Annuaire</TabsTrigger>
            <TabsTrigger value="docs" className="rounded-full font-black uppercase text-[9px] px-4">Admin Docs</TabsTrigger>
          </TabsList>

          {/* RESERVATIONS TAB */}
          <TabsContent value="reservations">
            <Card className="border-none shadow-soft">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="uppercase text-[9px] font-black px-6">Réf</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Statut</TableHead>
                      <TableHead className="uppercase text-[9px] font-black text-right pr-6">Actions & Documents</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations?.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-bold pl-6 text-xs">#{r.id.substring(0, 6)}</TableCell>
                        <TableCell><Badge className="bg-secondary text-[9px] uppercase">{r.status}</Badge></TableCell>
                        <TableCell className="text-right pr-6 space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => generateDoc('invoice', r)}><FileText className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-secondary" onClick={() => handleWhatsApp(r.phone)}><MessageCircle className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete('reservations', r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STOCK TAB */}
          <TabsContent value="products">
            <Card className="border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 py-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input placeholder="Filtrer stock..." className="h-8 pl-9 text-xs rounded-full border-slate-100" />
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-none">Alerte Réappro (12)</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="uppercase text-[9px] font-black pl-6">Code</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Produit</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Péremption</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Init / Final</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Écart</TableHead>
                      <TableHead className="uppercase text-[9px] font-black text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-[10px] pl-6">{p.code || 'SKU-001'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs">{p.name}</span>
                            <span className="text-[9px] uppercase text-slate-400">{p.brand}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{p.expiryDate || '2027-12'}</TableCell>
                        <TableCell className="text-xs font-bold">{p.stockInitial || 100} / {p.stockFinal || 88}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px] text-destructive">-{p.ecart || 12}</Badge></TableCell>
                        <TableCell className="text-right pr-6">
                          <Button size="icon" variant="ghost" className="h-7 w-7"><Settings className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CLIENTS TAB */}
          <TabsContent value="users">
            <Card className="border-none shadow-soft">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="uppercase text-[9px] font-black pl-6">Patient</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Contact</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Statut</TableHead>
                      <TableHead className="uppercase text-[9px] font-black text-right pr-6">Communication</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients?.filter(c => c.role === 'client').map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="pl-6 font-bold text-xs">{c.firstName} {c.lastName}</TableCell>
                        <TableCell className="text-xs text-slate-500">{c.email}</TableCell>
                        <TableCell>{c.verified ? <ShieldCheck className="h-4 w-4 text-primary" /> : <Badge variant="outline" className="text-[8px]">NON VÉRIFIÉ</Badge>}</TableCell>
                        <TableCell className="text-right pr-6 space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => handleWhatsApp(c.phone)}><MessageCircle className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-secondary" onClick={() => handleMail(c.email)}><Mail className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete('userProfiles', c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPPLIERS TAB */}
          <TabsContent value="suppliers">
            <Card className="border-none shadow-soft">
              <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-secondary" /> Annuaire Officine
                </CardTitle>
                <Button size="sm" className="h-7 rounded-full text-[9px] uppercase font-black bg-secondary">Ajouter Contact</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="uppercase text-[9px] font-black pl-6">Entité</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Type</TableHead>
                      <TableHead className="uppercase text-[9px] font-black">Téléphone</TableHead>
                      <TableHead className="uppercase text-[9px] font-black text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers?.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="pl-6 font-bold text-xs">{s.name}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[8px] uppercase">{s.type}</Badge></TableCell>
                        <TableCell className="text-xs">{s.phone}</TableCell>
                        <TableCell className="text-right pr-6 space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-secondary" onClick={() => handleWhatsApp(s.phone)}><MessageCircle className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete('suppliers', s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!suppliers || suppliers.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-slate-400 text-xs italic">
                          Exemple : CERP (Répartiteur), Pharmacie Marat (Confrère), Laboratoire Nuxe...
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADMIN DOCS TAB */}
          <TabsContent value="docs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Factures & Devis", desc: "Édition de justificatifs de paiement clients.", type: "invoice", icon: FileText },
                { title: "Rapports de Gestion", desc: "Analyses de stocks et rapports d'activité.", type: "report", icon: TrendingUp },
                { title: "Lettres Officielles", desc: "Modèles types pour confrères et ARS.", type: "letter", icon: BookOpen }
              ].map((item) => (
                <Card key={item.type} className="border-none shadow-soft hover:shadow-xl transition-all cursor-pointer group rounded-[24px]" onClick={() => generateDoc(item.type, {})}>
                  <CardContent className="p-6">
                    <item.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-black uppercase text-xs tracking-tight mb-2">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 mb-4">{item.desc}</p>
                    <Button variant="outline" className="w-full rounded-full text-[9px] font-black uppercase h-8">Générer</Button>
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
