import type { Metadata } from 'next';
import { Inter, Playfair_Display, Amiri } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  title: 'Diar EL Mehdi — Auberge Traditionnelle à Meknès',
  description: 'Votre havre de paix au cœur de Meknès. Découvrez l\'hospitalité marocaine authentique dans un cadre traditionnel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${amiri.variable} font-sans antialiased min-h-screen flex flex-col bg-cream`}>
        <Header />
        <main className="flex-1 flex flex-col relative w-full">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
