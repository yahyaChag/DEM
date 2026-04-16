"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { MoroccanCard } from '@/components/ui/moroccan-card';
import { Database } from '@/lib/supabase/types';

type Room = Database['public']['Tables']['rooms']['Row'];

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const roomId = searchParams.get('roomId');
  const [room, setRoom] = useState<Room | null>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form State
  const [dates, setDates] = useState({ checkin: '', checkout: '' });
  const [guest, setGuest] = useState({ name: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'onsite'>('onsite');
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    async function loadRoom() {
      if (!roomId) {
        toast.error("Aucune chambre sélectionnée.");
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      if (data) setRoom(data);
      if (error) toast.error("Erreur de chargement de la chambre: " + error.message);
      setLoading(false);
    }
    loadRoom();
  }, [roomId, supabase]);

  const calculateTotal = () => {
    if (!room || !dates.checkin || !dates.checkout) return 0;
    const inDate = new Date(dates.checkin);
    const outDate = new Date(dates.checkout);
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays > 0 ? diffDays : 1) * room.price_per_night;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!dates.checkin || !dates.checkout) return toast.error("Veuillez sélectionner vos dates d'arrivée et de départ.");
      setStep(2);
    } else if (step === 2) {
      if (!guest.name || !guest.email || !guest.phone) return toast.error("Veuillez remplir toutes vos informations.");
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (paymentMethod === 'card' && !cardNumber) return toast.error("Veuillez entrer un numéro de carte.");
    if (!room) return;

    setProcessing(true);
    const total = calculateTotal();

    try {
      let paymentStatus = 'En attente';
      
      if (paymentMethod === 'card') {
        const payRes = await fetch('/api/mock-pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardNumber, amount: total })
        });
        const payData = await payRes.json();
        if (!payData.success) {
          toast.error(payData.error);
          setProcessing(false);
          return;
        }
        paymentStatus = 'Payé';
      } else {
        paymentStatus = 'Paiement sur place';
      }

      const bookingReference = `DEM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

      const { data, error } = await (supabase.from('bookings') as any).insert({
        room_id: room.id,
        guest_name: guest.name,
        guest_email: guest.email,
        guest_phone: guest.phone,
        check_in: dates.checkin,
        check_out: dates.checkout,
        total_price: total,
        booking_reference: bookingReference,
        status: 'Confirmée',
        payment_status: paymentStatus as any
      }).select().single();

      if (error) throw error;

      toast.success("Réservation confirmée!");
      router.push(`/reserver/confirmation?ref=${bookingReference}`);
    } catch (err: any) {
      toast.error("Erreur de réservation: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center">Chargement...</div>;
  if (!room) return <div className="min-h-[60vh] flex justify-center items-center text-red-500">Chambre introuvable</div>;

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-playfair text-4xl font-bold text-mahogany mb-8 text-center">Finalisez votre réservation</h1>
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10" />
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= i ? 'bg-terracotta border-terracotta text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
              {i}
            </div>
          ))}
        </div>

        <MoroccanCard>
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-playfair text-mahogany font-bold border-b border-terracotta/20 pb-2">Récapitulatif</h2>
              
              <div className="flex gap-4 mb-6 items-center">
                <div className="w-24 h-24 rounded overflow-hidden">
                  <img src={room.picture_urls[0] || 'https://placehold.co/400x400/E8D5B7/3C1518'} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-mahogany">{room.name}</h3>
                  <p className="text-terracotta font-bold">{room.price_per_night} MAD / nuit</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin">Date d'arrivée</Label>
                  <Input type="date" id="checkin" value={dates.checkin} onChange={(e) => setDates({ ...dates, checkin: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout">Date de départ</Label>
                  <Input type="date" id="checkout" value={dates.checkout} onChange={(e) => setDates({ ...dates, checkout: e.target.value })} min={dates.checkin || new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              {dates.checkin && dates.checkout && (
                <div className="bg-sand/30 p-4 rounded-lg mt-6 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total estimé :</span>
                  <span className="text-2xl font-bold text-mahogany">{calculateTotal()} MAD</span>
                </div>
              )}

              <Button onClick={handleNextStep} className="w-full bg-olive hover:bg-jade text-white mt-6">Continuer</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-playfair text-mahogany font-bold border-b border-terracotta/20 pb-2">Vos informations</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" placeholder="Ex: Jean Dupont" value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input id="email" type="email" placeholder="jean@example.com" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input id="phone" type="tel" placeholder="+212 6 XX XX XX XX" value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Retour</Button>
                <Button onClick={handleNextStep} className="flex-1 bg-olive hover:bg-jade text-white">Continuer au paiement</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-playfair text-mahogany font-bold border-b border-terracotta/20 pb-2">Paiement</h2>
              
              <div className="space-y-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-terracotta bg-terracotta/5' : 'border-gray-200'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === 'card'} readOnly className="text-terracotta focus:ring-terracotta" />
                    <span className="font-semibold text-mahogany">Payer par carte bancaire</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-4 ml-6 space-y-4">
                      <p className="text-xs tracking-wider text-gray-500 uppercase">Utilisez 4242424242424242 (Stripe test) pour le paiement simulé</p>
                      <Input 
                        placeholder="Numéro de carte à 16 chiffres" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)} 
                        maxLength={16}
                      />
                    </div>
                  )}
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'onsite' ? 'border-terracotta bg-terracotta/5' : 'border-gray-200'}`}
                  onClick={() => setPaymentMethod('onsite')}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === 'onsite'} readOnly className="text-terracotta focus:ring-terracotta" />
                    <span className="font-semibold text-mahogany">Paiement sur place</span>
                  </div>
                  {paymentMethod === 'onsite' && (
                    <p className="mt-2 ml-6 text-sm text-gray-600">Vous réglerez l'intégralité de votre séjour à la réception lors de votre arrivée.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={processing}>Retour</Button>
                <Button onClick={handleSubmit} className="flex-1 bg-terracotta hover:bg-mahogany text-white" disabled={processing}>
                  {processing ? 'Traitement...' : `Confirmer & Payer ${calculateTotal()} MAD`}
                </Button>
              </div>
            </div>
          )}
        </MoroccanCard>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex justify-center items-center">Chargement...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}
