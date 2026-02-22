
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  Filter, 
  X,
  Send,
  Loader2
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductModal, type Product } from '@/components/ui/product-modal';

// Mapping des slugs vers des titres lisibles
const categoryMap: Record<string, string> = {
  'sante': 'Santé & Bien-être',
  'beaute': 'Beauté & Dermo-cosmétique',
  'hygiene': 'Hygiène & Soins',
  'bebe': 'Univers Bébé & Maman',
  'visage': 'Soins du Visage',
  'nettoyants-demaquillants': 'Nettoyants et Démaquillants',
  'anti-age': 'Anti-âge',
  'hydratation': 'Hydratation',
  'complements': 'Compléments alimentaires',
  'forme': 'Forme & Vitalité'
};

// Données de démonstration étendues
const allMockProducts: Record<string, Product[]> = {
  'default': [
    { 
      id: 'p1', brand: 'LA ROCHE-POSAY', name: 'Lipikar Baume AP+M', price: 18.90, oldPrice: 22.50, 
      image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
      promo: '-15%', description: 'Baume relipidant triple-réparation.'
    },
    { 
      id: 'p2', brand: 'URIAGE', name: 'Eau Thermale Spray 300ml', price: 8.50, 
      image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
      description: 'L\'eau de soin protectrice, apaisante et hydratante.'
    }
  ],
  'nettoyants-demaquillants': [
    { 
      id: 'nd1', brand: 'LA ROCHE-POSAY', name: 'Coffret Hyalu B5 Sérum + Micellaire', price: 34.99, 
      image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
      offerText: 'Offre découverte limitée', promo: 'PACK',
      delivery: ['Retrait 2h', 'Livraison domicile'],
      ingredients: ['Acide Hyaluronique', 'Vitamine B5']
    },
    { 
      id: 'nd2', brand: 'CONDENSÉ PARIS', name: 'Baume "Miel" Nettoyant', price: 21.99, oldPrice: 27.49, 
      image: PlaceHolderImages.find(img => img.id === 'skincare-product')?.imageUrl || "",
      promo: '-5,50€', description: 'Texture fondante miel-en-huile.'
    }
  ],
  'complements': [
    { 
      id: 'c1', brand: 'ARKOPHARMA', name: 'Arkoroyal Gelée Royale BIO 2500mg', price: 12.99, oldPrice: 15.99,
      image: PlaceHolderImages.find(img => img.id === 'vitamin-supplement')?.imageUrl || "",
      promo: '-3€', description: 'Renforce les défenses immunitaires.'
    }
  ]
};

export default function DynamicCategoryPage() {
  const params = useParams();
  const slug = params?.slug as string[] || [];
  
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [brandFilter, setBrandFilter] = useState('toutes');
  const [sortBy, setSortBy] = useState('pertinence');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Déterminer la catégorie active (le dernier segment du slug)
  const currentCategorySlug = slug[slug.length - 1] || 'default';
  const categoryTitle = categoryMap[currentCategorySlug] || currentCategorySlug.charAt(0).toUpperCase() + currentCategorySlug.slice(1);

  // Charger les produits correspondants
  const products = allMockProducts[currentCategorySlug] || allMockProducts['default'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesBrand = brandFilter === 'toutes' || p.brand === brandFilter;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesBrand && matchesPrice;
    });
  }, [brandFilter, priceRange, products]);

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand)));
  }, [products]);

  const clearFilters = () => {
    setPriceRange([0, 100]);
    setBrandFilter('toutes');
  };

  if (!isReady) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumbs Dynamiques */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          {slug.map((segment, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <Link 
                href={`/categorie/${slug.slice(0, index + 1).join('/')}`}
                className={`hover:text-primary transition-colors ${index === slug.length - 1 ? 'font-black text-slate-900 uppercase tracking-tighter' : ''}`}
              >
                {categoryMap[segment] || segment}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filtres */}
          <aside className="lg:w-72 space-y-8">
            <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100 lg:sticky lg:top-28">
              <h2 className="text-xl font-black text-secondary flex items-center uppercase tracking-tight mb-8">
                <Filter className="w-5 h-5 mr-3 text-primary" />
                Filtrer
              </h2>

              <div className="space-y-4 mb-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Marque</label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger className="rounded-2xl border-slate-100 h-12 bg-slate-50/50">
                    <SelectValue placeholder="Toutes les marques" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les marques</SelectItem>
                    {uniqueBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget max</label>
                  <span className="text-xs font-black text-primary">{priceRange[1]}€</span>
                </div>
                <Slider 
                  defaultValue={[0, 100]} 
                  max={150} 
                  step={1} 
                  value={[priceRange[1]]}
                  onValueChange={(val) => setPriceRange([0, val[0]])}
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full rounded-full border-primary/20 text-primary font-black text-[10px] h-12 uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                onClick={clearFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Effacer les filtres
              </Button>
            </div>
          </aside>

          {/* Zone Produits */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 uppercase tracking-tighter">{categoryTitle}</h1>
                <p className="text-slate-400 font-bold text-sm tracking-wide">{filteredProducts.length} produits trouvés</p>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 hidden sm:inline">Trier par :</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] border-none shadow-none focus:ring-0 font-black text-secondary uppercase text-xs h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pertinence">Pertinence</SelectItem>
                    <SelectItem value="prix-croissant">Prix croissant</SelectItem>
                    <SelectItem value="prix-decroissant">Prix décroissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group cursor-pointer overflow-hidden border-none shadow-none hover:shadow-2xl transition-all duration-500 rounded-[32px] p-3 bg-white flex flex-col hover:-translate-y-2"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-[24px]">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.promo && (
                        <Badge className="absolute top-4 left-4 bg-primary text-white font-black px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest">
                          {product.promo}
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="pt-8 px-4 flex-grow text-center">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-80">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] mb-6 group-hover:text-primary leading-tight uppercase tracking-tight">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                          {product.price.toFixed(2).replace('.', ',')}€
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs text-destructive font-bold line-through opacity-50">
                            {product.oldPrice.toFixed(2).replace('.', ',')}€
                          </span>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full rounded-full bg-slate-900 hover:bg-primary text-white font-black h-14 uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/10">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ajouter au panier
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold text-xl">Aucun produit ne correspond à ces critères.</p>
                <Button variant="link" onClick={clearFilters} className="mt-4 text-primary font-black uppercase">Réinitialiser les filtres</Button>
              </div>
            )}

            {/* Newsletter Section */}
            <div className="mt-24 bg-white rounded-[48px] p-10 lg:p-20 shadow-2xl shadow-primary/5 border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
              <h3 className="text-3xl lg:text-5xl font-black text-primary uppercase mb-6 tracking-tighter">Rejoignez le club</h3>
              <p className="text-slate-500 mb-12 font-medium text-lg">
                Recevez <span className="text-secondary font-black">-10%*</span> sur votre prochaine commande dès 40€ d'achat.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                <Input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="rounded-full h-16 px-10 border-slate-100 focus:border-primary transition-all text-lg bg-slate-50/50"
                  required
                />
                <Button className="rounded-full h-16 px-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest">
                  S'inscrire
                  <Send className="ml-3 h-5 w-5" />
                </Button>
              </form>
              <p className="text-[10px] text-slate-400 mt-8 font-bold uppercase tracking-[0.2em]">
                *Offre valable une seule fois. Voir conditions générales.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <Footer />
    </div>
  );
}
