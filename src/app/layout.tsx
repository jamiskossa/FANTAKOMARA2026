
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/components/providers/CartProvider';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { WhatsAppWidget } from '@/components/ui/WhatsAppWidget';

export const metadata: Metadata = {
  title: "Pharmacie Nouvelle d'Ivry | Votre santé au meilleur prix",
  description: "Parapharmacie en ligne, Click & Collect, Scan Ordonnance et conseils personnalisés à Ivry-sur-Seine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        <FirebaseClientProvider>
          <CartProvider>
            {children}
            <AIAssistant />
            <WhatsAppWidget />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
