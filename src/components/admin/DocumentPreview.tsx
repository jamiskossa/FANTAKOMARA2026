
"use client";

import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Share2, MessageCircle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  data: any;
}

export function DocumentPreview({ isOpen, onClose, type, data }: DocumentPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({ title: "Téléchargement", description: "Le document PDF a été généré." });
  };

  const handleShare = () => {
    const text = `Document Pharmacie: ${getDocTitle()}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Lien copié", description: "Vous pouvez maintenant partager ce document." });
  };

  const getDocTitle = () => {
    switch (type) {
      case 'invoice': return "FACTURE N°" + (data?.id?.substring(0, 8).toUpperCase() || "2026-001");
      case 'report': return "RAPPORT DE GESTION STOCK";
      case 'letter': return "LETTRE ADMINISTRATIVE";
      default: return "DOCUMENT OFFICIEL";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden bg-slate-100 border-none">
        <DialogTitle className="sr-only">Aperçu du document</DialogTitle>
        
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-[10px] font-black uppercase" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-2" /> Imprimer
            </Button>
            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-[10px] font-black uppercase" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-2" /> PDF
            </Button>
            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-[10px] font-black uppercase" onClick={handleShare}>
              <Share2 className="w-3.5 h-3.5 mr-2" /> Partager
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><MessageCircle className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8"><X className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Document Body */}
        <div className="flex-grow overflow-y-auto p-8 flex justify-center">
          <div 
            ref={printRef}
            className="bg-white w-[21cm] min-h-[29.7cm] shadow-2xl p-12 flex flex-col print:shadow-none print:p-0"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-primary pb-6">
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-primary uppercase leading-none">Pharmacie Nouvelle d'Ivry</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dermo-Cosmétique & Santé</p>
                <div className="text-[10px] text-slate-600 space-y-0.5 pt-2">
                  <p>40 Rue Marat, 94200 Ivry-sur-Seine</p>
                  <p>Tél : 01 46 71 12 34</p>
                  <p>Email : contact@pharmacienouvelledivry.fr</p>
                  <p>SIRET : 123 456 789 00012</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 ml-auto">
                  <span className="font-black text-2xl">PNI</span>
                </div>
                <p className="text-xs font-bold">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Document Title */}
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-black underline underline-offset-8 uppercase">{getDocTitle()}</h2>
            </div>

            {/* Content Placeholder */}
            <div className="flex-grow">
              <div className="space-y-6 text-sm leading-relaxed">
                <p><strong>Destinataire :</strong> {data?.clientId || "Client Pharmacie"}</p>
                
                {type === 'invoice' ? (
                  <table className="w-full border-collapse mt-8">
                    <thead>
                      <tr className="border-b-2 border-slate-900 bg-slate-50">
                        <th className="py-2 text-left px-4 uppercase text-[10px]">Désignation</th>
                        <th className="py-2 text-center px-4 uppercase text-[10px]">Quantité</th>
                        <th className="py-2 text-right px-4 uppercase text-[10px]">Prix Unitaire</th>
                        <th className="py-2 text-right px-4 uppercase text-[10px]">Total TTC</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-4 px-4 font-bold">Produits de parapharmacie (Lot)</td>
                        <td className="py-4 px-4 text-center">1</td>
                        <td className="py-4 px-4 text-right">{(data?.totalPrice || 0).toFixed(2)}€</td>
                        <td className="py-4 px-4 text-right font-black">{(data?.totalPrice || 0).toFixed(2)}€</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="mt-8 space-y-4">
                    <p>Le présent document atteste de la conformité de la gestion des stocks de l'officine au {new Date().toLocaleDateString()}.</p>
                    <div className="bg-slate-50 p-6 rounded-lg border-2 border-dashed border-slate-200 min-h-[300px]">
                      <p className="text-slate-400 italic">Contenu du rapport / lettre à éditer...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Footer */}
            <div className="mt-20 pt-8 border-t border-slate-100 flex justify-end">
              <div className="text-center w-64">
                <p className="text-xs font-bold mb-4 uppercase tracking-widest">Le Pharmacien Titulaire</p>
                <div className="italic text-lg mb-2 text-slate-800" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                  Dr. Fanta Komara
                </div>
                <p className="text-[10px] font-black uppercase text-slate-400">Pharmacie Nouvelle d'Ivry</p>
                <div className="mt-4 flex justify-center opacity-30">
                  <div className="w-32 h-16 border-2 border-slate-900 rounded-full flex items-center justify-center rotate-[-15deg]">
                    <span className="text-[10px] font-black uppercase">CACHE OFFICINE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-auto pt-8 text-[8px] text-center text-slate-400 uppercase tracking-widest">
              Pharmacie Nouvelle d'Ivry - Agrément ARS N° 94-0000 - Ordre National des Pharmaciens
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
