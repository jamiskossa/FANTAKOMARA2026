
"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapPin, Phone, Clock, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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

        {/* Map Placeholder with real location hint */}
        <section className="h-[500px] w-full bg-slate-200 relative overflow-hidden">
          <iframe
            title="Localisation Pharmacie Nouvelle d'Ivry"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2627.144224424244!2d2.384567!3d48.812345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671f123456789%3A0xabcdef1234567890!2s40+Rue+Marat%2C+94200+Ivry-sur-Seine!5e0!3m2!1sfr!2sfr!4v1610000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="grayscale contrast-125 opacity-80"
          ></iframe>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-white p-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-4 text-center max-w-xs border border-slate-100 animate-bounce-slow">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black uppercase tracking-tighter text-slate-900">Nous sommes ici</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">40 Rue Marat, 94200 Ivry</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
