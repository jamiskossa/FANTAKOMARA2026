"use client";

import React from 'react';
import { ShieldAlert, Info, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const RappelPage = () => {
  const recalls = [
    {
      id: 1,
      date: "24 Février 2026",
      title: "Rappel de lots - Lait Infantile Bio (0-6 mois)",
      description: "Suspicion de présence de traces de soja non mentionnées sur l'étiquetage.",
      brand: "BioBaby",
      batch: "L2401-A, L2401-B",
      action: "Ne pas consommer. Rapporter en pharmacie pour remboursement.",
      link: "https://rappel.conso.gouv.fr"
    },
    {
      id: 2,
      date: "15 Février 2026",
      title: "Information de sécurité - Thermomètres digitaux",
      description: "Défaut d'étanchéité du compartiment pile sur certains modèles.",
      brand: "MedTech",
      batch: "T-2025-09",
      action: "Vérifier le numéro de série au dos de l'appareil.",
      link: "https://ansm.sante.fr"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center text-pharma-green-dark hover:text-pharma-green transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
          <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-bold flex items-center animate-pulse">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Alertes Sanitaires en cours
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-pharma-green-dark p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">Informations Rappels Produits</h1>
            <p className="text-pharma-mint-light">
              La sécurité de nos patients est notre priorité absolue. Retrouvez ici les dernières alertes sanitaires et rappels de produits concernant la pharmacie.
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              {recalls.map((recall) => (
                <div key={recall.id} className="border-l-4 border-red-500 pl-6 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">{recall.date}</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-mono">Lot: {recall.batch}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{recall.title}</h3>
                  <p className="text-gray-600 mb-4">{recall.description}</p>
                  
                  <div className="bg-red-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-red-700 font-bold mb-1">
                      <Info className="w-4 h-4 mr-2" />
                      Action requise :
                    </div>
                    <p className="text-red-600">{recall.action}</p>
                  </div>

                  <a 
                    href={recall.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-pharma-green-dark hover:underline font-medium"
                  >
                    Voir l'alerte officielle sur RappelConso
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-pharma-green-lighter rounded-2xl p-8 border border-pharma-green-light">
          <h2 className="text-xl font-bold text-pharma-green-darker mb-4">Besoin d'aide ?</h2>
          <p className="text-gray-700 mb-6">
            Si vous avez acheté l'un de ces produits ou si vous avez un doute sur un article en votre possession, n'hésitez pas à nous contacter immédiatement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/contact" 
              className="bg-pharma-green-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-pharma-green transition-all text-center"
            >
              Nous contacter
            </Link>
            <a 
              href="tel:0100000000" 
              className="bg-white border-2 border-pharma-green-dark text-pharma-green-dark px-6 py-3 rounded-xl font-bold hover:bg-pharma-green-lighter transition-all text-center"
            >
              Appeler la pharmacie
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RappelPage;
