
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
  Truck, 
  MapPin, 
  Loader2, 
  AlertCircle,
  QrCode
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
      // Marquer comme "En cours" dès l'ouverture
      updateDocumentNonBlocking(doc(db, 'reservations', order.id), { status: 'processing' });
    }
    setCheckedItems({});
  }, [order, db]);

  if (!order) return null;

  const handleToggleItem = (productId: string) => {
    setCheckedItems(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const allChecked = order.items?.every((item: any) => checkedItems[item.productId]);

  const handleFinalize = () => {
    if (!allChecked) {
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
      title: "Commande préparée !",
      description: "Le statut a été mis à jour. Le client sera notifié."
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-[32px] shadow-2xl flex flex-col h-[90vh] bg-white">
        <DialogTitle className="sr-only">Préparation Commande #{order.id}</DialogTitle>
        
        {/* Modal Header */}
        <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Préparation de commande</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-mono opacity-60 uppercase">#{order.id.toUpperCase()}</span>
                <Badge className="bg-secondary text-white font-black text-[8px] uppercase">En cours</Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" /> Checklist de Picking
              </h3>
              
              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div 
                    key={item.productId} 
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      checkedItems[item.productId] 
                      ? 'bg-white border-primary shadow-lg shadow-primary/5' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                    onClick={() => handleToggleItem(item.productId)}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox 
                        checked={checkedItems[item.productId]} 
                        className="h-6 w-6 rounded-lg border-2"
                      />
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.brand}</p>
                        <p className="font-bold text-slate-900">{item.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-secondary">x{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Infos Client</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{order.deliveryOption === 'click-and-collect' ? 'Retrait Officine' : 'Livraison Domicile'}</span>
                  </div>
                  {order.prescriptionUrl && (
                    <Button variant="outline" className="w-full h-10 rounded-xl border-secondary text-secondary font-black text-[9px] uppercase">
                      <FileText className="w-3.5 h-3.5 mr-2" /> Voir Ordonnance
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Sécurité</h4>
                <div className="flex gap-3 text-[10px] font-bold text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Vérifier les dates de péremption avant mise en sachet.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">Articles</p>
              <p className="text-lg font-black text-slate-900">{Object.keys(checkedItems).filter(k => checkedItems[k]).length} / {order.items?.length || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full h-14 px-8 border-slate-200 font-black uppercase text-[10px]" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              className={`rounded-full h-14 px-12 font-black uppercase tracking-widest text-xs shadow-2xl transition-all ${
                allChecked ? 'bg-primary shadow-primary/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
              onClick={handleFinalize}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  Valider la préparation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
