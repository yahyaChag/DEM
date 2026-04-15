"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MoroccanCard } from '@/components/ui/moroccan-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

type Booking = Database['public']['Tables']['bookings']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const rawRef = searchParams.get('ref');
  // Handle arrays effectively to avoid TS errors
  const bookingRef = Array.isArray(rawRef) ? rawRef[0] : rawRef;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      if (!bookingRef) {
        setLoading(false);
        return;
      }

      const { data: bData, error: bError } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_reference', bookingRef)
        .single();
        
      if (bData) {
        setBooking(bData);
        const { data: rData } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', bData.room_id)
          .single();
        if (rData) setRoom(rData);
      }
      setLoading(false);
    }
    loadData();
  }, [bookingRef, supabase]);

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center">Traitement de votre réservation...</div>;
  if (!booking || !room) return <div className="min-h-[60vh] flex justify-center items-center text-mahogany font-bold text-2xl">Réservation introuvable.</div>;

  return (
    <div className="bg-cream min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-20 w-20 text-jade" />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-mahogany mb-4">Réservation Confirmée !</h1>
          <p className="text-lg text-gray-600">Merci, {booking.guest_name}. Nous avons hâte de vous accueillir à Diar EL Mehdi.</p>
        </div>

        <MoroccanCard className="mb-8">
          <h2 className="text-2xl font-playfair font-bold text-mahogany mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-gold" />
            Détails de votre séjour
          </h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="font-medium">Numéro de référence</span>
              <span className="font-bold font-mono text-mahogany">{booking.booking_reference}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="font-medium">Chambre</span>
              <span>{room.name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="font-medium">Arrivée</span>
              <span>{new Date(booking.check_in).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="font-medium">Départ</span>
              <span>{new Date(booking.check_out).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3 text-lg mt-4">
              <span className="font-bold text-mahogany">Montant Total</span>
              <span className="font-bold text-terracotta">{booking.total_price} MAD</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Statut de paiement</span>
              <span className="font-semibold uppercase tracking-wider">{booking.payment_status}</span>
            </div>
          </div>
        </MoroccanCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href={`/client/${booking.booking_reference}`} passHref>
            <Button className="w-full h-14 bg-olive hover:bg-jade text-white flex items-center justify-center gap-2 text-lg">
              Accéder à votre portail <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline" className="w-full h-14 border-terracotta text-terracotta hover:bg-terracotta/10 text-lg">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
