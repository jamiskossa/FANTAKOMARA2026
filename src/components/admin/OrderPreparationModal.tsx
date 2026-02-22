"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  X, 
  Package, 
  ClipboardCheck, 
  FileText, 
  MapPin, 
  Loader2, 
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

interface OrderPreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function OrderPreparationModal({ isOpen, onClose, order }: OrderPreparationModalProps) {
  const db = useFirestore();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order && order.status === 'pending') {
      updateDocumentNonBlocking(doc(db, 'reservations', order.id), { status: 'processing' });
    }
    setCheckedItems({});
  }, [order, db]);

  if (!order) return null;

  const handleToggleItem = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const allChecked = order.items?.every((_: any, idx: number) => checkedItems[idx]);

  const handleFinalize = () => {
    if (!allChecked && order.items?.length > 0) {
      return toast({
        variant: "destructive",
        title: "Vérification incomplète",
        description: "Veuillez vérifier tous les produits avant de valider."
      });
    }

    setIsSubmitting(true);
    updateDocumentNonBlocking(doc(db, 'reservations', order.id), { 
      status: 'prepared',
      preparedAt: new Date().toISOString()
    });
    
    toast({
      title: "Commande prête !",
      description: "Le client a été notifié pour le retrait."
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-[32px] shadow-2xl flex flex-col h-[90vh] bg-white">
        <DialogTitle className="sr-only">Préparation {order.type === 'prescription' ? 'Ordonnance' : 'Commande'} #{order.id}</DialogTitle>
        
        <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.type === 'prescription' ? 'bg-primary' : 'bg-secondary'}`}>
              {order.type === 'prescription' ? <Stethoscope className="w-6 h-6" /> : <Package className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">
                {order.type === 'prescription' ? 'Analyse d\'ordonnance' : 'Préparation de commande'}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-mono opacity-60 uppercase">#{order.id.toUpperCase()}</span>
                <Badge className="bg-white/20 text-white border-none font-black text-[8px] uppercase">En cours</Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" /> Liste des traitements
              </h3>
              
              <div className="space-y-3">
                {order.items?.length > 0 ? order.items.map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      checkedItems[idx] 
                      ? 'bg-white border-primary shadow-lg shadow-primary/5' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                    onClick={() => handleToggleItem(idx)}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox 
                        checked={checkedItems[idx]} 
                        className="h-6 w-6 rounded-lg border-2"
                      />
                      <div>
                        <p className="font-bold text-slate-900 uppercase text-sm">{item.name}</p>
                        <div className="flex gap-2 mt-1">
                          {item.dosage && <Badge variant="outline" className="text-[8px] uppercase">{item.dosage}</Badge>}
                          {item.instructions && <span className="text-[9px] text-slate-400 font-medium italic">{item.instructions}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-secondary">x{item.quantity}</span>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white p-10 rounded-2xl text-center border-2 border-dashed border-slate-200">
                    <FileText className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase">En attente de lecture manuelle de l'original</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Patient</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Retrait Pharmacie</span>
                  </div>
                  {order.type === 'prescription' && (
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl">
                      <p className="text-[9px] font-black text-primary uppercase mb-1">Note IA</p>
                      <p className="text-[10px] text-slate-600 leading-tight">Données extraites automatiquement de la prescription.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Sécurité Pharma</h4>
                <div className="flex gap-3 text-[10px] font-bold text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Vérifier l'original de l'ordonnance au comptoir.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">Lignes</p>
              <p className="text-lg font-black text-slate-900">{Object.keys(checkedItems).filter(k => checkedItems[k]).length} / {order.items?.length || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full h-14 px-8 border-slate-200 font-black uppercase text-[10px]" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              className={`rounded-full h-14 px-12 font-black uppercase tracking-widest text-xs shadow-2xl transition-all ${
                allChecked || order.items?.length === 0 ? 'bg-primary shadow-primary/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
              onClick={handleFinalize}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  Finaliser Préparation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
