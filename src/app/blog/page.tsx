
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleModal, type Article } from '@/components/blog/ArticleModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockArticles: Article[] = [
  {
    id: '1',
    title: "Comment choisir son nettoyant visage selon son type de peau ?",
    excerpt: "Peau grasse, sèche, sensible ou mixte : voici les actifs et textures à privilégier pour un nettoyage doux et efficace au quotidien.",
    date: "15 FÉVRIER 2026",
    author: "DR. MARIE DUPONT",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=800",
    content: `
      <p>Le nettoyage du visage est la première étape, et sans doute la plus cruciale, de toute routine de soins. Pourtant, mal choisi, un nettoyant peut altérer le film hydrolipidique de la peau et causer rougeurs ou imperfections.</p>
      <h4>1. Peaux sèches : Cap sur le gras</h4>
      <p>Privilégiez les huiles ou les baumes nettoyants. Ces textures riches dissolvent les impuretés tout en apportant une dose de nutrition immédiate.</p>
      <h4>2. Peaux mixtes à grasses : La légèreté avant tout</h4>
      <p>Un gel moussant doux ou une eau micellaire purifiante sera votre meilleur allié. Recherchez des actifs comme le zinc ou l'acide salicylique pour réguler le sébum sans agresser.</p>
      <h4>3. Peaux sensibles : Priorité à l'apaisement</h4>
      <p>Évitez le savon et préférez des laits nettoyants ou des syndets (pains dermatologiques sans savon) riches en eau thermale.</p>
    `,
    tags: ["BEAUTÉ", "VISAGE", "CONSEILS"]
  },
  {
    id: '2',
    title: "Les bienfaits de l'eau thermale pour les peaux sensibles",
    excerpt: "Découvrez pourquoi l'eau thermale de La Roche-Posay ou Avène est systématiquement recommandée par les dermatologues.",
    date: "10 FÉVRIER 2026",
    author: "ÉQUIPE PHARMACIE IVRY",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=800",
    content: `
      <p>Véritable cadeau de la nature, l'eau thermale est puisée au cœur des roches, se chargeant ainsi de minéraux et d'oligo-éléments précieux.</p>
      <h4>Une action apaisante immédiate</h4>
      <p>Grâce à sa composition unique, elle calme instantanément les irritations, les rougeurs et les sensations d'échauffement après une exposition solaire ou un acte dermatologique.</p>
      <h4>Comment l'utiliser ?</h4>
      <p>Brumisez sur le visage, laissez agir quelques secondes, puis tamponnez délicatement avec un mouchoir. Ne laissez pas sécher à l'air libre pour éviter la déshydratation par évaporation.</p>
    `,
    tags: ["PEAUX SENSIBLES", "EAU THERMALE"]
  },
  {
    id: '3',
    title: "Immunité : les compléments à privilégier en hiver",
    excerpt: "Vitamine D, zinc, probiotiques... quels sont les actifs les plus efficaces pour booster vos défenses naturellement ?",
    date: "05 FÉVRIER 2026",
    author: "DR. SOPHIE LAURENT",
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800",
    content: `
      <p>En hiver, notre organisme est mis à rude épreuve par le froid et le manque de lumière. Soutenir son système immunitaire devient alors une priorité.</p>
      <h4>La Vitamine D : L'indispensable</h4>
      <p>En France, nous sommes presque tous carencés en hiver. Une supplémentation aide à maintenir le fonctionnement normal du système immunitaire.</p>
      <h4>Le Zinc et la Vitamine C</h4>
      <p>Le duo de choc pour réduire la durée et l'intensité des petits maux hivernaux. Privilégiez les formes biodisponibles pour une meilleure absorption.</p>
    `,
    tags: ["IMMUNITÉ", "HIVER", "SANTÉ"]
  },
  {
    id: '4',
    title: "Routine bébé : les gestes essentiels pour le change",
    excerpt: "Prévenir l'érythème fessier et protéger la peau fragile de votre nouveau-né avec les bons produits de soin.",
    date: "01 FÉVRIER 2026",
    author: "ÉQUIPE BÉBÉ IVRY",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800",
    content: `
      <p>La peau d'un bébé est 5 fois plus fine que celle d'un adulte. Le change est un moment répétitif qui nécessite une attention particulière.</p>
      <h4>Le nettoyage</h4>
      <p>Le liniment oléo-calcaire reste la référence pour nettoyer tout en laissant un film protecteur. Pour les sorties, préférez des lingettes à l'eau sans parfum.</p>
      <h4>La protection</h4>
      <p>Appliquez une crème de change à base de zinc en cas de rougeurs installées pour isoler la peau de l'humidité.</p>
    `,
    tags: ["BÉBÉ", "SOINS", "MAMAN"]
  }
];

export default function BlogPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = mockArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-fluid-gradient border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-black mb-6 text-slate-900 uppercase tracking-tighter">Blog Santé & Beauté</h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Découvrez les conseils et secrets de nos pharmaciens pour prendre soin de vous et de votre famille au quotidien.
            </p>
            
            <div className="mt-12 max-w-xl mx-auto relative group">
              <Input 
                placeholder="Rechercher un conseil (ex: Vitamine D, Peau sèche...)" 
                className="rounded-full h-14 px-8 border-2 border-white shadow-xl group-hover:border-primary transition-all text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-primary">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredArticles.map((article) => (
                  <Card 
                    key={article.id} 
                    className="group cursor-pointer overflow-hidden border-none shadow-soft hover:shadow-2xl transition-all duration-500 rounded-[32px] bg-white flex flex-col hover:-translate-y-2"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image 
                        src={article.image} 
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {article.tags.slice(0, 1).map(tag => (
                          <Badge key={tag} className="bg-primary text-white font-black px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest border-none">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <CardContent className="p-8 flex-grow flex flex-col">
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        <span>{article.date}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{article.author}</span>
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-slate-500 font-medium line-clamp-3 mb-8 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-primary font-black text-xs uppercase tracking-widest">
                        Lire l'article <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-xl">Aucun article ne correspond à votre recherche.</p>
                <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 text-primary font-black uppercase">Voir tous les articles</Button>
              </div>
            )}

            <div className="mt-20 flex justify-center">
              <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow-soft border border-slate-100">
                <Button variant="ghost" disabled className="rounded-full font-black text-xs uppercase tracking-widest h-12 px-6">Précédent</Button>
                <div className="flex items-center">
                  <Button className="rounded-full h-12 w-12 bg-primary text-white font-black">1</Button>
                  <Button variant="ghost" className="rounded-full h-12 w-12 font-black text-slate-400">2</Button>
                  <Button variant="ghost" className="rounded-full h-12 w-12 font-black text-slate-400">3</Button>
                </div>
                <Button variant="ghost" className="rounded-full font-black text-xs uppercase tracking-widest h-12 px-6">Suivant</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ArticleModal 
        article={selectedArticle} 
        isOpen={!!selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />

      <Footer />
    </div>
  );
}
