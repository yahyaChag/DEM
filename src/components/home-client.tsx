"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { BookingSearch } from '@/components/ui/booking-search';
import { Button } from '@/components/ui/button';
import {
  MapPin, Star, ChevronRight, Sparkles, Utensils, TreePine,
  ChevronLeft, ArrowRight, Quote
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */
interface Room {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  picture_urls: string[];
  status: string;
  capacity: number;
}

interface HomeClientProps {
  heroImages: string[];
  rooms: Room[];
}

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal the parent and all children with scroll-reveal classes
            const revealElements = el.querySelectorAll(
              '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
            );
            revealElements.forEach((child) => child.classList.add('visible'));
            // Also add to self if it has the class
            if (
              el.classList.contains('scroll-reveal') ||
              el.classList.contains('scroll-reveal-left') ||
              el.classList.contains('scroll-reveal-right') ||
              el.classList.contains('scroll-reveal-scale')
            ) {
              el.classList.add('visible');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
}

/* ═══════════════════════════════════════════════════════
   HERO IMAGE SLIDER
   ═══════════════════════════════════════════════════════ */

function HeroSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0">
      {images.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: idx === current ? 1 : 0 }}
        >
          <img
            src={src}
            alt={`Diar EL Mehdi - Vue ${idx + 1}`}
            className="w-full h-full object-cover hero-ken-burns"
          />
        </div>
      ))}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-mahogany/30 via-mahogany/20 to-mahogany/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-mahogany/30 via-transparent to-mahogany/30" />

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-32 md:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === current
                  ? 'w-8 bg-gold'
                  : 'w-3 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURE CARD
   ═══════════════════════════════════════════════════════ */

function FeatureCard({
  icon: Icon,
  title,
  description,
  delayClass,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delayClass: string;
}) {
  return (
    <div className={`scroll-reveal ${delayClass} group`}>
      <div className="relative p-8 rounded-2xl bg-white/80 border border-terracotta/10 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-500 h-full">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 -translate-y-1/2 translate-x-1/2 bg-gradient-to-bl from-terracotta/8 to-transparent rounded-full" />
        </div>

        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-terracotta/15 to-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-7 h-7 text-terracotta" strokeWidth={1.5} />
        </div>
        <h3 className="font-playfair text-xl font-bold text-mahogany mb-3">{title}</h3>
        <p className="text-mahogany/60 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOM CAROUSEL CARD
   ═══════════════════════════════════════════════════════ */

function RoomCarouselCard({ room }: { room: Room }) {
  const image = room.picture_urls?.[0] || 'https://placehold.co/600x400/E8D5B7/3C1518?text=Chambre';

  return (
    <div className="room-carousel-card">
      <Link href={`/chambres/${room.id}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden border border-terracotta/10 shadow-md h-full flex flex-col">
          {/* Archway-masked image */}
          <div className="relative h-64 overflow-hidden">
            <div className="arch-mask h-full">
              <img
                src={image}
                alt={room.name}
                className="room-carousel-img w-full h-full object-cover"
              />
            </div>
            {/* Price badge */}
            <div className="absolute top-4 right-4 bg-mahogany/85 backdrop-blur-sm text-gold px-4 py-1.5 rounded-full text-sm font-bold shadow-lg z-10">
              {room.price_per_night} MAD<span className="text-sand/70 text-xs font-normal ml-1">/ nuit</span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-playfair text-lg font-bold text-mahogany mb-2">{room.name}</h3>
            <p className="text-mahogany/50 text-sm line-clamp-2 mb-4 flex-1">{room.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-terracotta/70 font-medium">
                {room.capacity} personne{room.capacity > 1 ? 's' : ''}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-terracotta group-hover:gap-2 transition-all">
                Découvrir <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL DATA
   ═══════════════════════════════════════════════════════ */

const testimonials = [
  {
    text: "Une expérience inoubliable. L'attention aux détails et l'architecture sont à couper le souffle.",
    author: "Sophie L.",
    country: "France",
    rating: 5,
  },
  {
    text: "Le meilleur endroit pour séjourner à Ait Rbaa. Le petit-déjeuner sur la terrasse était magique.",
    author: "Omar K.",
    country: "Maroc",
    rating: 5,
  },
  {
    text: "A serene hidden gem within the bustling medina. We felt like royalty during our stay.",
    author: "James W.",
    country: "Royaume-Uni",
    rating: 5,
  },
];

/* ═══════════════════════════════════════════════════════
   MAIN HOME CLIENT COMPONENT
   ═══════════════════════════════════════════════════════ */

export function HomeClient({ heroImages, rooms }: HomeClientProps) {
  const scrollY = useParallax();

  // Refs for scroll-reveal sections
  const experienceRef = useScrollReveal();
  const featuresRef = useScrollReveal();
  const roomsRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const mapRef = useScrollReveal();

  // Room carousel scroll controls
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 380;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ═══════════════════════════════════════════════
          SECTION 1: IMMERSIVE HERO
          ═══════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative h-[100svh] min-h-[650px] w-full flex items-center justify-center overflow-hidden"
      >
        {/* Parallax background */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
        >
          <HeroSlider images={heroImages} />
        </div>

        {/* Hero content */}
        <div className="relative z-20 container mx-auto px-5 text-center mt-[-60px] md:mt-0">
          {/* Decorative line */}
          <div className="hero-entrance-1 ornament-line mb-6">
            <span className="text-gold text-lg">✦</span>
          </div>

          <p className="hero-entrance-1 text-sand/90 text-sm md:text-base tracking-[0.3em] uppercase font-light mb-4">
            Auberge de Charme — Ait Rbaa
          </p>

          <h1 className="hero-entrance-2 font-amiri text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            Diar <span className="shimmer-gold">EL Mehdi</span>
          </h1>

          <p className="hero-entrance-3 text-lg md:text-xl text-sand/80 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Votre havre de paix au cœur du Moyen Atlas — où l&apos;architecture ancestrale rencontre le confort moderne
          </p>

          <div className="hero-entrance-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chambres">
              <Button className="magnetic-btn bg-terracotta hover:bg-terracotta/90 text-white rounded-full px-10 h-14 text-base font-medium shadow-xl">
                Réservez votre séjour
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a
              href="https://www.google.com/maps/dir//33.842594089393394,-5.131127748582001/@33.8425941,-5.1311277,18z"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 h-14 rounded-full text-base font-medium border border-white/20 transition-all duration-300"
            >
              <MapPin className="w-5 h-5" />
              Nous trouver
            </a>
          </div>
        </div>

        {/* Booking widget floating at bottom */}
        <div className="hero-entrance-4 absolute bottom-6 md:bottom-8 left-0 right-0 z-30 px-4 flex justify-center">
          <BookingSearch className="w-full max-w-4xl booking-glow" />
        </div>

        {/* Bottom edge zellige transition */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent z-30" />
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: EXPERIENCE THE AUBERGE
          ═══════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 clay-texture overflow-hidden">
        {/* Subtle zellige overlay */}
        <div className="zellige-overlay absolute inset-0 pointer-events-none" />

        <div className="container mx-auto px-5 relative z-10">
          {/* Section header */}
          <div ref={experienceRef} className="text-center mb-16 md:mb-20">
            <p className="scroll-reveal text-terracotta text-sm tracking-[0.25em] uppercase font-medium mb-4">
              L&apos;Art de Vivre Marocain
            </p>
            <h2 className="scroll-reveal delay-100 font-playfair text-4xl md:text-5xl lg:text-6xl text-mahogany font-bold mb-6">
              Vivez l&apos;Expérience <span className="text-terracotta">Diar EL Mehdi</span>
            </h2>
            <div className="scroll-reveal delay-200 ornament-line">
              <span className="text-gold text-xl">✦</span>
            </div>
          </div>

          {/* Content: gallery + text on large, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 md:mb-28">
            {/* Gallery — Archway masked images */}
            <div ref={featuresRef} className="relative">
              <div className="scroll-reveal-left grid grid-cols-2 gap-4">
                {heroImages.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative overflow-hidden rounded-2xl ${
                      idx === 0 ? 'col-span-2 h-64 md:h-80' : 'h-44 md:h-52'
                    }`}
                  >
                    <div className={idx === 0 ? 'arch-mask h-full' : 'h-full'}>
                      <img
                        src={img}
                        alt={`Diar EL Mehdi - Ambiance ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    {idx === 0 && (
                      <div className="absolute inset-0 bg-gradient-to-t from-mahogany/40 via-transparent to-transparent" />
                    )}
                  </div>
                ))}
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -bottom-6 -right-3 md:-right-6 bg-mahogany text-gold px-5 py-3 rounded-xl shadow-xl z-20 hidden md:block" style={{ animation: 'floatY 4s ease-in-out infinite' }}>
                <p className="text-xs text-sand/70 uppercase tracking-wider">Depuis</p>
                <p className="text-2xl font-playfair font-bold">2024</p>
              </div>
            </div>

            {/* Description text */}
            <div className="scroll-reveal-right">
              <h3 className="font-playfair text-3xl md:text-4xl text-mahogany font-bold mb-6 leading-tight">
                Un Refuge d&apos;Authenticité au Cœur du Moyen Atlas
              </h3>
              <p className="text-mahogany/65 leading-relaxed mb-6 text-base md:text-lg">
                Nichée dans le village pittoresque d&apos;Ait Rbaa, notre auberge est un hommage vivant à l&apos;artisanat marocain.
                Chaque mur en pisé, chaque arc en briques et chaque motif de zellige raconte une histoire centenaire.
              </p>
              <p className="text-mahogany/65 leading-relaxed mb-8 text-base md:text-lg">
                Ici, le temps s&apos;arrête. L&apos;air pur de l&apos;Atlas, le chant des oiseaux et l&apos;hospitalité berbère
                vous transportent dans un monde de sérénité et de bien-être.
              </p>
              <Link href="/chambres">
                <Button className="magnetic-btn bg-terracotta hover:bg-mahogany text-white rounded-full px-8 h-12 text-sm font-medium">
                  Explorer nos chambres
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={Sparkles}
              title="Architecture Ancestrale"
              description="Des murs en pisé ocre, des arcs en briques et des plafonds en bois de cèdre sculptés à la main — chaque détail est une œuvre d'art."
              delayClass="delay-100"
            />
            <FeatureCard
              icon={Utensils}
              title="Cuisine Authentique"
              description="Savourez les saveurs du terroir : tajines mijotés lentement, pain cuit au four traditionnel et thé à la menthe parfumé."
              delayClass="delay-200"
            />
            <FeatureCard
              icon={TreePine}
              title="Sérénité Naturelle"
              description="Entouré par les collines boisées du Moyen Atlas, profitez d'un cadre naturel exceptionnel pour la randonnée et la contemplation."
              delayClass="delay-300"
            />
          </div>
        </div>
      </section>

      {/* Zellige section divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════
          SECTION 3: ROOM SNEAK-PEEK CAROUSEL
          ═══════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-cream to-white overflow-hidden">
        <div className="container mx-auto px-5">
          {/* Section header */}
          <div ref={roomsRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
            <div>
              <p className="scroll-reveal text-terracotta text-sm tracking-[0.25em] uppercase font-medium mb-4">
                Nos Espaces
              </p>
              <h2 className="scroll-reveal delay-100 font-playfair text-4xl md:text-5xl text-mahogany font-bold mb-4">
                Chambres d&apos;Exception
              </h2>
              <p className="scroll-reveal delay-200 text-mahogany/55 max-w-xl text-base">
                Chaque chambre est une invitation au voyage, mêlant tradition architecturale marocaine et confort contemporain.
              </p>
            </div>
            <div className="scroll-reveal delay-300 flex gap-3 mt-6 md:mt-0">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-12 h-12 rounded-full border border-terracotta/20 flex items-center justify-center text-mahogany/60 hover:bg-terracotta hover:text-white hover:border-terracotta transition-all duration-300"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-12 h-12 rounded-full border border-terracotta/20 flex items-center justify-center text-mahogany/60 hover:bg-terracotta hover:text-white hover:border-terracotta transition-all duration-300"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel */}
          {rooms && rooms.length > 0 ? (
            <div ref={carouselRef} className="room-carousel -mx-2 px-2">
              {rooms.map((room) => (
                <RoomCarouselCard key={room.id} room={room} />
              ))}
              {/* "See all" card */}
              <div className="room-carousel-card">
                <Link href="/chambres" className="block h-full">
                  <div className="h-full rounded-2xl border-2 border-dashed border-terracotta/20 flex flex-col items-center justify-center bg-white/50 hover:border-terracotta/50 hover:bg-terracotta/5 transition-all duration-300 min-h-[380px]">
                    <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
                      <ArrowRight className="w-7 h-7 text-terracotta" />
                    </div>
                    <p className="font-playfair text-lg font-bold text-mahogany mb-1">Voir tout</p>
                    <p className="text-sm text-mahogany/50">Toutes nos chambres</p>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-mahogany/40 bg-white rounded-2xl border border-dashed border-terracotta/15">
              <p className="font-playfair text-xl">Bientôt disponible</p>
              <p className="text-sm mt-2">Nos chambres seront présentées ici.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4: TESTIMONIALS + SOCIAL PROOF
          ═══════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-mahogany overflow-hidden">
        {/* Pattern bg */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'url(/pattern.svg)',
            backgroundSize: '500px auto',
            backgroundRepeat: 'repeat',
          }}
        />

        <div ref={testimonialsRef} className="container mx-auto px-5 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="scroll-reveal text-gold/70 text-sm tracking-[0.25em] uppercase font-medium mb-4">
              Témoignages
            </p>
            <h2 className="scroll-reveal delay-100 font-playfair text-4xl md:text-5xl text-white font-bold mb-6">
              Ce que disent <span className="shimmer-gold">nos invités</span>
            </h2>
            <div className="scroll-reveal delay-200 ornament-line">
              <span className="text-gold text-lg">✦</span>
            </div>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className={`scroll-reveal delay-${(idx + 1) * 100} glass-card p-8 flex flex-col justify-between group hover:bg-white/10 transition-all duration-500`}
              >
                <div>
                  <Quote className="w-8 h-8 text-gold/50 mb-4 group-hover:text-gold/80 transition-colors" />
                  <p className="text-sand/90 text-base leading-relaxed italic mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="font-semibold text-white">{t.author}</p>
                  <p className="text-sm text-sand/50">{t.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5: MAP + CTA
          ═══════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-5">
          <div ref={mapRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Map */}
            <div className="scroll-reveal-left order-2 lg:order-1">
              <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] ring-1 ring-mahogany/5">
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
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

            {/* CTA content */}
            <div className="scroll-reveal-right order-1 lg:order-2 text-center lg:text-left">
              <p className="text-terracotta text-sm tracking-[0.25em] uppercase font-medium mb-4">
                Nous Rejoindre
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-mahogany font-bold mb-6 leading-tight">
                Prêt pour <br className="hidden lg:block" />l&apos;évasion ?
              </h2>
              <p className="text-mahogany/55 text-lg mb-4 leading-relaxed max-w-md mx-auto lg:mx-0">
                Situé au cœur de Ait Rbaa, commune Bitit dans la région El Hajeb, Diar EL Mehdi vous accueille dans un cadre authentique.
              </p>
              <p className="text-mahogany/45 text-base mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
                Réservez en direct et profitez de nos meilleurs tarifs — sans intermédiaire, sans frais cachés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/chambres">
                  <Button className="magnetic-btn bg-terracotta hover:bg-mahogany text-white rounded-full px-10 h-14 text-base w-full sm:w-auto shadow-lg">
                    Réservez votre séjour
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a
                  href="https://www.google.com/maps/dir//33.842594089393394,-5.131127748582001/@33.8425941,-5.1311277,18z"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="magnetic-btn border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-white rounded-full px-8 h-14 text-base w-full sm:w-auto"
                  >
                    <MapPin className="mr-2 w-5 h-5" />
                    Itinéraire
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
