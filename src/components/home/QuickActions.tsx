"use client";

import React from 'react';
import Link from 'next/link';
import { Clock, FileText, Percent, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  const actions = [
    { icon: Clock, label: "Click & Collect", href: "/click-collect", color: "bg-primary" },
    { icon: FileText, label: "Scan Ordonnance", href: "/scan-ordonnance", color: "bg-secondary" },
    { icon: Percent, label: "Voir les promos", href: "/promotions", color: "bg-destructive" },
    { icon: LayoutGrid, label: "Nos marques", href: "/marques", color: "bg-slate-900" }
  ];

  return (
    <section className="py-4 sm:py-10 bg-white border-b overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {actions.map((action, i) => (
            <Button 
              key={i} 
              asChild 
              className={`h-10 sm:h-16 lg:h-20 rounded-lg sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95 shadow-sm hover:shadow-xl ${action.color} text-white group px-2 sm:px-4`}
            >
              <Link href={action.href}>
                <action.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-black uppercase tracking-tighter text-[7px] sm:text-[10px] lg:text-xs text-center">
                  {action.label}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}