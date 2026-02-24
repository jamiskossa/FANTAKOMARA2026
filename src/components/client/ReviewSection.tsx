
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send, Loader2, ThumbsUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function ReviewSection() {
  const { user } = useUser();
  const db = useFirestore();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast({ title: "Note requise", description: "Veuillez donner une note entre 1 et 5 étoiles.", variant: "destructive" });
    if (!comment.trim()) return toast({ title: "Commentaire requis", description: "Dites-nous ce que vous en pensez.", variant: "destructive" });

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'pharmacyReviews'), {
        clientId: user?.uid,
        clientName: user?.displayName || user?.email,
        rating,
        comment,
        createdAt: serverTimestamp()
      });
      toast({ title: "Merci !", description: "Votre avis a été enregistré avec succès." });
      setRating(0);
      setComment('');
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'envoyer votre avis.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-soft rounded-[32px] overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5 p-8">
        <CardTitle className="text-xl font-black uppercase tracking-tighter">Votre avis nous intéresse</CardTitle>
        <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
          Aidez-nous à améliorer la Pharmacie Nouvelle d'Ivry
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Votre note globale</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      (hover || rating) >= star 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-slate-200 fill-transparent'
                    } transition-colors`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Votre commentaire</p>
            <Textarea 
              placeholder="Qu'avez-vous pensé de l'accueil, des conseils, de la rapidité..." 
              className="min-h-[120px] rounded-2xl bg-slate-50 border-slate-100 p-4 font-medium"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/90 font-black uppercase tracking-widest text-xs shadow-xl shadow-secondary/20"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
            Publier mon avis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
