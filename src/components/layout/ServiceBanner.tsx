"use client";

import React from 'react';
import { Clock, Truck, ShieldCheck, Headphones } from 'lucide-react';

export function ServiceBanner() {
  const services = [
    { 
      icon: Clock, 
      title: "Retrait en pharmacie en 2h", 
      desc: "Service Click & Collect gratuit",
      color: "text-primary"
    },
    { 
      icon: Truck, 
      title: "Livraison à domicile en France", 
      desc: "Expédition rapide et sécurisée",
      color: "text-secondary"
    },
    { 
      icon: ShieldCheck, 
      title: "Paiement 3D Secure", 
      desc: "Transactions 100% protégées",
      color: "text-primary"
    },
    { 
      icon: Headphones, 
      title: "Pharmacien à votre écoute", 
      desc: "Conseils santé personnalisés",
      color: "text-secondary"
    },
  ];

  return (
    <section className="py-10 lg:py-16 bg-accent border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {services.map((service, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white flex items-center justify-center shadow-soft mb-4 transition-transform duration-500 group-hover:rotate-12`}>
                <service.icon className={`w-5 h-5 lg:w-7 lg:h-7 ${service.color}`} />
              </div>
              <h4 className="text-slate-900 font-black uppercase tracking-tighter text-[9px] lg:text-sm mb-1 lg:mb-2">
                {service.title}
              </h4>
              <p className="text-[7px] lg:text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}