
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapPin, Phone, Clock, Mail, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    { 
      icon: MapPin, 
      title: "Notre officine", 
      details: ["Pharmacie Nouvelle d'Ivry", "40 Rue Marat", "94200 Ivry-sur-Seine"],
      color: "bg-primary/10 text-primary"
    },
    { 
      icon: Phone, 
      title: "Par téléphone", 
      details: ["01 46 71 12 34", "Conseils & Commandes"],
      color: "bg-secondary/10 text-secondary"
    },
    { 
      icon: Mail, 
      title: "Par e-mail", 
      details: ["contact@pharmacienouvelledivry.fr", "Réponse sous 24h"],
      color: "bg-accent text-secondary"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        <section className="py-24 bg-fluid-gradient border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 border border-primary/20 text-primary text-sm font-bold mb-6">
              <MessageCircle className="w-4 h-4 mr-2" />
              Une question ? Nous sommes là pour vous
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 text-slate-900 uppercase tracking-tighter">Contactez-nous</h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Besoin d'un conseil sur un produit ou d'un suivi de commande ? Notre équipe de pharmaciens vous répond avec le sourire.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              
              {/* Infos de contact */}
              <div className="lg:col-span-1 space-y-12">
                <div className="space-y-10">
                  {contactInfo.map((info, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${info.color}`}>
                        <info.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm mb-3">{info.title}</h4>
                        <div className="space-y-1">
                          {info.details.map((line, i) => (
                            <p key={i} className="text-slate-500 font-bold">{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-soft">
                  <h4 className="text-primary font-black uppercase tracking-widest text-sm mb-6 flex items-center">
                    <Clock className="w-4 h-4 mr-2" /> NOS HORAIRES
                  </h4>
                  <ul className="space-y-4">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => (
                      <li key={day} className="flex justify-between items-center text-sm font-bold border-b border-slate-50 pb-2">
                        <span className="text-slate-400 uppercase tracking-widest">{day}</span>
                        <span className="text-slate-900">08:00 - 20:00</span>
                      </li>
                    ))}
                    <li className="flex justify-between items-center text-sm font-bold">
                      <span className="text-destructive uppercase tracking-widest">Dimanche</span>
                      <span className="text-destructive">Fermé</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Formulaire */}
              <div className="lg:col-span-2">
                <ContactForm />
              </div>

            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="h-[400px] w-full bg-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 grayscale opacity-50 contrast-125">
            <Image 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1920" 
              alt="Map"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-primary/10" />
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
            <div className="bg-white p-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-4 text-center max-w-xs border border-slate-100">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black uppercase tracking-tighter text-slate-900">Pharmacie Nouvelle d'Ivry</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">40 Rue Marat, 94200 Ivry</p>
              </div>
              <Button size="sm" className="rounded-full bg-secondary w-full font-bold uppercase tracking-widest text-[10px]" asChild>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer">Ouvrir dans Maps</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
