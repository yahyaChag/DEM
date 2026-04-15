import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import { Check, Users, Maximize, BedDouble, Wifi, Wind } from 'lucide-react';

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !room) {
    notFound();
  }

  const images = room.picture_urls.length > 0 ? room.picture_urls : [
    'https://placehold.co/1200x800/E8D5B7/3C1518?text=Chambre+1',
    'https://placehold.co/1200x800/C4663A/FFFFFF?text=Chambre+2'
  ];

  // Parse features safely
  const features = room.features as Record<string, any> || {};

  return (
    <div className="bg-cream min-h-[calc(100vh-80px)] pb-20">
      {/* Breadcrumb & Title */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-terracotta">Accueil</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/chambres" className="hover:text-terracotta">Chambres</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-mahogany font-medium">{room.name}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-mahogany mb-2">{room.name}</h1>
            <StatusBadge status={room.status} />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-terracotta mb-2">{room.price_per_night} MAD <span className="text-base text-gray-500 font-normal">/ nuit</span></div>
            <Link href={`/reserver?roomId=${room.id}`}>
              <Button size="lg" className="bg-olive hover:bg-jade text-white w-full md:w-auto">
                Réserver cette chambre
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 mb-16">
        <ImageCarousel autoPlay={false} images={images} className="h-[400px] md:h-[600px] rounded-2xl shadow-xl" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-playfair font-bold text-mahogany mb-4 border-b border-terracotta/20 pb-2">À propos de cette chambre</h2>
              <p className="text-lg text-gray-700 leading-relaxed font-light whitespace-pre-wrap">
                {room.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair font-bold text-mahogany mb-6 border-b border-terracotta/20 pb-2">Équipements & Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 bg-white rounded-full shadow-sm text-terracotta"><Users className="h-5 w-5" /></div>
                  <span>Jusqu'à {features?.capacity || 2} personnes</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 bg-white rounded-full shadow-sm text-terracotta"><Maximize className="h-5 w-5" /></div>
                  <span>{features?.size || 25} m²</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 bg-white rounded-full shadow-sm text-terracotta"><BedDouble className="h-5 w-5" /></div>
                  <span>{features?.bedType || 'Lit double King size'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 bg-white rounded-full shadow-sm text-terracotta"><Wifi className="h-5 w-5" /></div>
                  <span>Wi-Fi haut débit gratuit</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 bg-white rounded-full shadow-sm text-terracotta"><Wind className="h-5 w-5" /></div>
                  <span>Climatisation réversible</span>
                </div>
              </div>
              
              <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Salle de bain privative avec zellige', 'Produits d\'accueil offerts', 'Sèche-cheveux', 'Service d\'étage disponible', 'Eau minérale offerte', 'Coffre-fort'].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-olive flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-xl shadow-lg border border-terracotta/10">
              <h3 className="font-playfair text-xl font-bold text-mahogany mb-4">Votre séjour</h3>
              <div className="flex items-center gap-3 p-4 bg-cream/50 rounded-lg mb-6">
                <Check className="h-6 w-6 text-olive" />
                <p className="text-sm text-gray-700">Petit-déjeuner traditionnel marocain inclus pour toutes les réservations.</p>
              </div>
              <Link href={`/reserver?roomId=${room.id}`} passHref>
                <Button className="w-full h-12 text-lg bg-terracotta hover:bg-mahogany text-white shadow-md">
                  Réserver maintenant
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-500 mt-4">
                Paiement sur place ou sécurisé en ligne. Annulation gratuite jusqu'à 48h avant l'arrivée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
