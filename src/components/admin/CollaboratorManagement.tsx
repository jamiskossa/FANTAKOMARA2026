
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Mail, Phone, User, Briefcase, Hash, MapPin, Loader2, MessageCircle } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export function CollaboratorManagement() {
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    matricule: '',
    contractType: 'CDI',
    role: 'collaborator'
  });

  const sendWhatsAppNotification = (phone: string, firstName: string, email: string, pass: string) => {
    const text = `Bonjour ${firstName}, votre accès à la Pharmacie Nouvelle d'Ivry a été créé.\n\n📧 Email : ${email}\n🔑 Mot de passe : ${pass}\n\n⚠️ Cet accès est sécurisé et non modifiable.\nAccès : https://pharmacienouvelledivryonline.netlify.app/login`;
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = `collab_${Date.now()}`;
      await setDoc(doc(db, 'userProfiles', userId), {
        ...formData,
        id: userId,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Collaborateur créé",
        description: `L'accès pour ${formData.firstName} a été configuré.`,
      });

      // Notify via WhatsApp
      if (formData.phone) {
        sendWhatsAppNotification(formData.phone, formData.firstName, formData.email, formData.password);
      }
      
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        matricule: '',
        contractType: 'CDI',
        role: 'collaborator'
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le collaborateur.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          Nouveau Collaborateur
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Prénom</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  className="pl-10 rounded-xl" 
                  placeholder="Jean" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Nom</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  className="pl-10 rounded-xl" 
                  placeholder="Dupont" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Email (Accès unique)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="email" 
                  className="pl-10 rounded-xl" 
                  placeholder="jean.dupont@pharma.fr" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Mot de passe provisoire</Label>
              <Input 
                type="password" 
                className="rounded-xl" 
                placeholder="********" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <p className="text-[8px] text-destructive font-black uppercase">* Ce mot de passe sera unique et non modifiable par le collaborateur.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  className="pl-10 rounded-xl" 
                  placeholder="06 12 34 56 78" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Matricule</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  className="pl-10 rounded-xl" 
                  placeholder="PH-2026-X" 
                  value={formData.matricule}
                  onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Type de Contrat</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
                <Select 
                  value={formData.contractType} 
                  onValueChange={(val) => setFormData({...formData, contractType: val})}
                >
                  <SelectTrigger className="pl-10 rounded-xl">
                    <SelectValue placeholder="Choisir un contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI - Temps plein</SelectItem>
                    <SelectItem value="CDD">CDD - Remplacement</SelectItem>
                    <SelectItem value="STAGE">Stage / Alternance</SelectItem>
                    <SelectItem value="INTERIM">Intérim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Adresse Complète</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  className="pl-10 rounded-xl" 
                  placeholder="Adresse, Ville, CP" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11 rounded-xl font-black uppercase tracking-widest text-[11px]" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Enregistrer le Collaborateur
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
