
"use client";

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ContactForm() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires (*).",
      });
      return;
    }

    setStatus('sending');

    try {
      // 1. Enregistrement dans la collection contactMessages pour suivi admin
      await addDoc(collection(db, 'contactMessages'), {
        senderName: formData.name,
        senderEmail: formData.email,
        senderPhone: formData.phone,
        subject: formData.subject || 'Question générale',
        messageContent: formData.message,
        submissionDate: serverTimestamp(),
        isReplied: false
      });

      // 2. Enregistrement dans la collection mail pour l'extension Trigger Email
      await addDoc(collection(db, 'mail'), {
        to: ['contact@pharmacienouvelledivry.fr'],
        replyTo: formData.email,
        message: {
          subject: `Nouveau message site - ${formData.subject || formData.name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2 style="color: #009688; border-bottom: 2px solid #009688; padding-bottom: 10px;">Nouveau message de contact</h2>
              <p><strong>Nom :</strong> ${formData.name}</p>
              <p><strong>Email :</strong> ${formData.email}</p>
              <p><strong>Téléphone :</strong> ${formData.phone || 'Non renseigné'}</p>
              <p><strong>Sujet :</strong> ${formData.subject || 'Général'}</p>
              <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #4caf50;">
                <p><strong>Message :</strong></p>
                <p style="white-space: pre-wrap;">${formData.message}</p>
              </div>
              <p style="font-size: 12px; color: #999; margin-top: 30px;">Ce message a été envoyé via le formulaire de contact du site Pharmacie Nouvelle d'Ivry.</p>
            </div>
          `,
        }
      });

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      toast({
        title: "Message envoyé !",
        description: "Nous reviendrons vers vous dans les plus brefs délais.",
      });

      // Retour à l'état initial après 5 secondes
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error('Erreur envoi contact:', error);
      setStatus('error');
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
      });
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-[40px] p-12 text-center border-2 border-primary/20 shadow-xl animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Message reçu !</h3>
        <p className="text-slate-500 font-medium text-lg mb-8 leading-relaxed">
          Merci de nous avoir contactés. Nos pharmaciens traiteront votre demande avec la plus grande attention.
        </p>
        <Button 
          onClick={() => setStatus('idle')}
          className="rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 px-10"
        >
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-primary/5 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Nom complet *</label>
          <Input 
            placeholder="Jean Dupont"
            className="rounded-2xl h-14 px-6 border-slate-100 focus:border-primary transition-all bg-slate-50/50"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Email *</label>
          <Input 
            type="email"
            placeholder="jean.dupont@exemple.com"
            className="rounded-2xl h-14 px-6 border-slate-100 focus:border-primary transition-all bg-slate-50/50"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Téléphone</label>
          <Input 
            type="tel"
            placeholder="06 12 34 56 78"
            className="rounded-2xl h-14 px-6 border-slate-100 focus:border-primary transition-all bg-slate-50/50"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Objet de votre demande</label>
          <Select 
            value={formData.subject} 
            onValueChange={(val) => setFormData({...formData, subject: val})}
          >
            <SelectTrigger className="rounded-2xl h-14 px-6 border-slate-100 focus:ring-primary transition-all bg-slate-50/50">
              <SelectValue placeholder="Choisir un sujet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Question sur un produit">Question sur un produit</SelectItem>
              <SelectItem value="Suivi de commande">Suivi de commande</SelectItem>
              <SelectItem value="Conseil santé/beauté">Conseil santé/beauté</SelectItem>
              <SelectItem value="Problème technique">Problème technique</SelectItem>
              <SelectItem value="Autre">Autre demande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 mb-10">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Message *</label>
        <Textarea 
          placeholder="Comment pouvons-nous vous aider ?"
          className="rounded-2xl min-h-[200px] p-6 border-slate-100 focus:border-primary transition-all bg-slate-50/50 text-lg"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
        />
      </div>

      <Button 
        type="submit" 
        disabled={status === 'sending'}
        className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-16 shadow-xl shadow-primary/20 transition-all active:scale-95 text-lg"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            Envoyer le message
            <Send className="ml-3 h-5 w-5" />
          </>
        )}
      </Button>

      {status === 'error' && (
        <div className="mt-6 flex items-center justify-center gap-2 text-destructive font-bold animate-pulse">
          <AlertCircle className="h-5 w-5" />
          <span>Une erreur est survenue. Veuillez nous contacter au 01 46 71 12 34.</span>
        </div>
      )}
    </form>
  );
}
