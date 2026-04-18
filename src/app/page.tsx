import { createClient } from '@/lib/supabase/server';
import { BookingSearch } from '@/components/ui/booking-search';
import { RoomCard } from '@/components/ui/room-card';
import { ZelligeDivider } from '@/components/ui/zellige-divider';
import { ImageCarousel } from '@/components/ui/image-carousel';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const supabase = await createClient();

  // Fetch site settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('homepage_images')
    .single();

  const settingsAny = settings as any;
  const heroImage = settingsAny?.homepage_images?.[0] || 'https://placehold.co/1920x1080/C4663A/3C1518?text=Cour+de+Riad+Marocain';
  const galleryImages = settingsAny?.homepage_images || [
    'https://placehold.co/800x600/C5992E/3C1518?text=Maroc',
    'https://placehold.co/800x600/1E3A5F/FFFFFF?text=Zellige',
    'https://placehold.co/800x600/2D6A4F/FFFFFF?text=Jardin'
  ];

  // Fetch top 3 rooms
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .limit(3);

  const roomsList = rooms as any[];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center">
        {/* Background layer with overflow hidden to contain the scale-105 transform */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-mahogany/40" />
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center mt-[-100px] md:mt-0">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Bienvenue à Diar EL Mehdi
          </h1>
          <p className="text-xl md:text-3xl text-sand font-light drop-shadow-md mb-8 max-w-3xl mx-auto">
            Votre havre de paix au cœur de Ait Rbaa — Commune Bitit, Région El Hajeb
          </p>
          <a
            href="https://www.google.com/maps/dir//33.842594089393394,-5.131127748582001/@33.8425941,-5.1311277,18z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-terracotta/90 hover:bg-terracotta text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <MapPin className="h-5 w-5" />
            Emmenez-moi là-bas
          </a>
        </div>

        {/* Search Widget Floating */}
        <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 z-30 px-4 flex justify-center">
          <BookingSearch className="w-full max-w-4xl" />
        </div>
      </section>

      {/* Spacer to account for floating widget */}
      <div className="h-40 md:h-16 bg-cream" />

      {/* About Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="font-playfair text-4xl text-mahogany font-bold mb-8">Découvrez Notre Histoire</h2>
          <ZelligeDivider className="max-w-[200px] mx-auto opacity-50 h-[20px]" />
          <p className="text-lg text-gray-700 leading-relaxed mt-8 font-light">
            Niché dans les ruelles historiques de l'ancienne Médina de Ait Rbaa, Diar EL Mehdi est plus qu'une simple auberge : c'est un voyage dans le temps. Restauré avec amour par des artisans locaux, notre riad met en valeur l'art traditionnel marocain — des plafonds en cèdre sculpté à la main aux zelliges géométriques complexes. Venez découvrir la véritable hospitalité marocaine dans une atmosphère chaleureuse et intime, où chaque détail raconte une histoire.
          </p>
        </div>
      </section>

      {/* Image Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-10 bg-white border-y border-terracotta/20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-playfair text-3xl text-center text-mahogany font-bold mb-10">Un Glimpse de Diar EL Mehdi</h2>
            <ImageCarousel images={galleryImages} className="h-[400px] md:h-[500px] rounded-2xl shadow-xl" />
          </div>
        </section>
      )}

      {/* Rooms Preview */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-playfair text-4xl text-mahogany font-bold mb-4">Nos Chambres d'Exception</h2>
              <p className="text-gray-600 max-w-2xl">
                Chaque chambre est unique, offrant un mélange parfait de tradition architecturale marocaine et de confort moderne.
              </p>
            </div>
            <Link href="/chambres" className="hidden md:block">
              <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                Voir toutes les chambres
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomsList && roomsList.length > 0 ? (
              roomsList.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                Aucune chambre disponible pour le moment.
              </div>
            )}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/chambres">
              <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white w-full">
                Voir toutes les chambres
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-mahogany text-sand relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/100x100/3C1518/4C2225?text=Pattern')] opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-playfair text-4xl text-gold font-bold mb-16">Ce que disent nos invités</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                text: "Une expérience inoubliable. L'attention aux détails et l'architecture sont à couper le souffle.",
                author: "Sophie L.",
                country: "France"
              },
              {
                text: "Le meilleur endroit pour séjourner à Ait Rbaa. Le petit-déjeuner sur la terrasse était magique.",
                author: "Omar K.",
                country: "Maroc"
              },
              {
                text: "A serene hidden gem within the bustling medina. We felt like royalty during our stay.",
                author: "James W.",
                country: "Royaume-Uni"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-gold mb-6 text-4xl font-serif">"</div>
                  <p className="text-lg italic mb-6">"{testimonial.text}"</p>
                </div>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm opacity-75">{testimonial.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localization Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-playfair text-4xl text-mahogany font-bold mb-4 text-center">Nous Trouver</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Situé au cœur de Ait Rbaa, Diar EL Mehdi vous accueille dans un cadre authentique et facilement accessible.
          </p>
          <ZelligeDivider className="max-w-[200px] mx-auto opacity-50 h-[20px] mb-10" />
          <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d527.2097519764902!2d-5.131127748582001!3d33.842594089393394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDUxJzA4LjUiTiA1wrAwOCczNi4yIlc!5e1!3m2!1sen!2sma!4v1776539161425!5m2!1sen!2sma"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation de Diar EL Mehdi à Ait Rbaa"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-cream text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-playfair text-4xl md:text-5xl text-mahogany font-bold mb-8">Prêt pour l'évasion ?</h2>
          <p className="text-xl text-gray-600 mb-10">Réservez dès maintenant et profitez de nos meilleurs tarifs en direct.</p>
          <Link href="/chambres">
            <Button className="bg-terracotta hover:bg-mahogany text-white px-10 h-14 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
              Réservez votre séjour
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
