
import React from 'react';
import { ShieldAlert, Info, ExternalLink, ArrowLeft, Baby } from 'lucide-react';
import Link from 'next/link';

const RappelLaitPage = () => {
  const recalls = [
    {
      id: 1,
      date: "25 Février 2026",
      title: "ALERTE NATIONALE : Rappel majeur laits infantiles 1er âge",
      description: "Mesure de précaution suite à la détection d'un risque potentiel de contamination bactérienne sur une ligne de production.",
      brand: "Modilac / Guigoz (Lots spécifiques)",
      batch: "TOUS LES LOTS EXPIRANT EN 2027",
      action: "Cesser immédiatement l'utilisation. Rapporter les boîtes entamées ou neuves en pharmacie.",
      link: "https://rappel.conso.gouv.fr"
    },
    {
      id: 2,
      date: "20 Février 2026",
      title: "Rappel Lait de Croissance Bio",
      description: "Présence possible de particules métalliques suite à un incident technique chez le fabricant.",
      brand: "Gallia Bio",
      batch: "G26-02-B",
      action: "Ne pas consommer. Un échange ou remboursement sera effectué à l'accueil.",
      link: "https://rappel.conso.gouv.fr"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center text-blue-600 font-black uppercase tracking-widest text-xs hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center shadow-xl shadow-red-600/20 animate-pulse">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Urgence Sanitaire Nutrition Infantile
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden mb-10 border border-slate-100">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 lg:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150">
                <Baby className="w-64 h-64" />
            </div>
            <div className="relative z-10">
                <h1 className="text-4xl lg:text-6xl font-black mb-6 uppercase tracking-tighter leading-none">Rappels Lait Infantile</h1>
                <p className="text-blue-100 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                  Espace dédié aux alertes de nutrition infantile. La santé de vos enfants est notre priorité absolue. En cas de doute, contactez nos pharmaciens immédiatement.
                </p>
            </div>
          </div>

          <div className="p-10 lg:p-16">
            <div className="space-y-12">
              {recalls.map((recall) => (
                <div key={recall.id} className="relative group">
                  <div className="absolute -left-10 top-0 bottom-0 w-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-4 py-1 rounded-full">{recall.date}</span>
                    <span className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">Batch: {recall.batch}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{recall.title}</h3>
                  <p className="text-slate-600 mb-6 font-medium leading-relaxed text-lg">{recall.description}</p>
                  
                  <div className="bg-red-50/50 rounded-3xl p-8 mb-8 border border-red-100">
                    <div className="flex items-center text-red-600 font-black uppercase tracking-widest text-xs mb-3">
                      <Info className="w-4 h-4 mr-2" />
                      Protocole de sécurité :
                    </div>
                    <p className="text-red-700 font-black text-lg">{recall.action}</p>
                  </div>

                  <a 
                    href={recall.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-black uppercase tracking-widest text-xs group"
                  >
                    Consulter l'alerte sur RappelConso
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[40px] p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
              <Baby className="w-48 h-48" />
          </div>
          <div className="relative z-10">
              <h2 className="text-2xl lg:text-4xl font-black mb-6 uppercase tracking-tighter">Assistance 24/7 Nutrition</h2>
              <p className="text-slate-400 mb-10 text-lg font-medium max-w-xl">
                Notre équipe est mobilisée pour répondre à toutes vos questions concernant les laits infantiles et la sécurité de votre bébé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 h-14 px-10 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20">
                    <Link href="/contact">
                        Contacter un pharmacien
                    </Link>
                </Button>
                <a 
                  href="tel:0146721523" 
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-10 py-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all"
                >
                  Urgence : 01 46 72 15 23
                </a>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RappelLaitPage;
