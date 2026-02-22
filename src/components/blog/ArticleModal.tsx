
"use client";

import React from 'react';
import Image from 'next/image';
import { X, Calendar, User, Tag as TagIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  content: string;
  tags: string[];
}

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none sm:rounded-[32px] shadow-2xl flex flex-col h-[100vh] sm:h-[90vh] w-full bg-white outline-none">
        <DialogTitle className="sr-only">{article.title}</DialogTitle>
        <DialogDescription className="sr-only">{article.excerpt}</DialogDescription>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-md rounded-full hover:bg-white shadow-lg lg:hidden"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <ScrollArea className="flex-grow">
          <div className="relative w-full aspect-video sm:aspect-[21/9]">
            <Image 
              src={article.image} 
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-12 text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map(tag => (
                  <Badge key={tag} className="bg-primary/90 text-white border-none px-3 py-1 text-xs uppercase font-bold tracking-widest">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black leading-tight uppercase tracking-tighter">
                {article.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-12">
            <div className="flex flex-wrap items-center gap-6 mb-10 text-slate-500 text-sm font-bold uppercase tracking-widest border-b pb-8 border-slate-100">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                {article.date}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-primary" />
                {article.author}
              </div>
            </div>

            <div 
              className="prose prose-slate max-w-none prose-headings:text-secondary prose-headings:font-black prose-headings:uppercase prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            <div className="mt-16 pt-12 border-t border-slate-100">
              <h4 className="text-secondary font-black uppercase tracking-widest text-sm mb-6">Partager cet article</h4>
              <div className="flex gap-4">
                <Button variant="outline" className="rounded-full border-slate-200 hover:bg-slate-50 font-bold px-6">Facebook</Button>
                <Button variant="outline" className="rounded-full border-slate-200 hover:bg-slate-50 font-bold px-6">WhatsApp</Button>
                <Button variant="outline" className="rounded-full border-slate-200 hover:bg-slate-50 font-bold px-6">Copier le lien</Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-6 right-6 z-50 bg-white/90 backdrop-blur-md rounded-full hover:bg-white shadow-xl hidden lg:flex h-12 w-12 border-slate-100"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
