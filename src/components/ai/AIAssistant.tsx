
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { pharmacyAssistant } from '@/ai/flows/pharmacy-assistant-flow';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Bonjour ! Je suis votre assistant santé. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await pharmacyAssistant({
        message: userMessage,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Désolé, j'ai rencontré une petite erreur technique. Pouvez-vous reformuler ?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <Card className="mb-4 w-[350px] sm:w-[400px] h-[500px] shadow-2xl border-primary/20 rounded-[32px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-primary text-white p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">Assistant Santé</CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold opacity-80 uppercase">IA Active</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 flex flex-col bg-slate-50">
            <ScrollArea className="flex-grow p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed ${
                      m.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Analyse...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
              <Input 
                placeholder="Posez votre question..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="rounded-full h-11 border-slate-100 focus:border-primary transition-all"
              />
              <Button type="submit" size="icon" disabled={isLoading} className="rounded-full h-11 w-11 bg-primary shadow-lg shadow-primary/20">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-500 group ${
          isOpen ? 'bg-destructive rotate-90' : 'bg-primary'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : (
          <div className="relative">
            <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-primary" />
          </div>
        )}
      </Button>
    </div>
  );
}
