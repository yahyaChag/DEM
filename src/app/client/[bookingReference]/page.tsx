"use client";

import React, { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { MoroccanCard } from '@/components/ui/moroccan-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Coffee, Plus, Minus, Send, Clock } from 'lucide-react';
import { toast } from 'sonner';

type Booking = Database['public']['Tables']['bookings']['Row'] & { rooms?: { name: string } | null };
type Order = Database['public']['Tables']['room_service_orders']['Row'];

const MENU_ITEMS = [
  { id: '1', name: 'Petit-déjeuner Traditionnel (Msemen, Baghrir, Œufs, Café/Thé, Jus)', price: 120, category: 'Petit-déjeuner' },
  { id: '2', name: 'Thé à la menthe (Théière)', price: 40, category: 'Boissons' },
  { id: '3', name: 'Café Noir', price: 25, category: 'Boissons' },
  { id: '4', name: 'Jus d\'Orange Frais', price: 35, category: 'Boissons' },
  { id: '5', name: 'Plateau de Cornes de Gazelle et Pâtisseries', price: 80, category: 'Collations' },
  { id: '6', name: 'Corbeille de Fruits de Saison', price: 60, category: 'Collations' },
  { id: '7', name: 'Eau Minérale (1.5L)', price: 20, category: 'Boissons' },
];

export default function ClientPortalDashboard({ params }: { params: Promise<{ bookingReference: string }> }) {
  const resolvedParams = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ordering, setOrdering] = useState(false);

  const supabase = createClient();

  const fetchDashboardData = async () => {
    // Fetch booking
    const { data: bData, error: bError } = await supabase
      .from('bookings')
      .select('*, rooms(name)')
      .eq('booking_reference', resolvedParams.bookingReference)
      .single();

    const bDataAny = bData as any;
    if (bDataAny) {
      setBooking(bDataAny);
      
      // Fetch user's active orders
      const { data: oData } = await supabase
        .from('room_service_orders')
        .select('*')
        .eq('booking_id', bDataAny.id)
        .order('created_at', { ascending: false });
      
      if (oData) setOrders(oData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel('public:room_service_orders')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'room_service_orders' }, payload => {
        if (booking && payload.new.booking_id === booking.id) {
          fetchDashboardData();
          toast.success("Le statut de votre commande a été mis à jour!");
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [resolvedParams.bookingReference, supabase, booking?.id]);

  const updateCart = (itemId: string, delta: number) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const submitOrder = async () => {
    if (!booking) return;
    setOrdering(true);

    const items = Object.entries(cart).map(([id, qty]) => {
      const item = MENU_ITEMS.find(i => i.id === id)!;
      return { id: item.id, name: item.name, price: item.price, quantity: qty };
    });

    const totalPrice = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    const { error } = await (supabase.from('room_service_orders') as any).insert({
      booking_id: booking.id,
      items: items as any, // jsonb
      total_price: totalPrice,
      status: 'Reçu'
    });

    if (error) {
      toast.error("Erreur de commande: " + error.message);
    } else {
      toast.success("Commande envoyée avec succès!");
      setCart({});
      fetchDashboardData();
    }
    setOrdering(false);
  };

  if (loading) return <div className="min-h-screen pt-20 text-center">Recherche de votre séjour...</div>;
  if (!booking) return <div className="min-h-screen pt-20 text-center text-red-500">Réservation introuvable. Veuillez vérifier votre référence.</div>;

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-sand/10 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-terracotta/20 pb-6 gap-4">
          <div>
            <h1 className="font-playfair text-4xl text-mahogany font-bold mb-2">Bonjour, {booking.guest_name}</h1>
            <p className="text-gray-600">Bienvenue dans votre espace personnel Diar EL Mehdi</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500 block mb-1">Chambre</span>
            <span className="font-bold text-xl text-olive">{booking.rooms?.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Room Service Ordering */}
          <div className="lg:col-span-2 space-y-6">
            <MoroccanCard className="p-0">
              <div className="border-b border-gray-100 p-6 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <h2 className="font-playfair text-2xl font-bold text-mahogany flex items-center gap-2">
                  <Coffee className="text-terracotta" /> Service d'Étage
                </h2>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">Service de 07h à 23h</span>
              </div>
              
              <div className="p-6">
                {['Petit-déjeuner', 'Boissons', 'Collations'].map(category => (
                  <div key={category} className="mb-8 last:mb-0">
                    <h3 className="font-bold text-lg text-olive mb-4 border-b pb-2">{category}</h3>
                    <div className="space-y-4">
                      {MENU_ITEMS.filter(m => m.category === category).map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="pr-4">
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <span className="text-mahogany font-bold text-sm">{item.price} MAD</span>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-md hover:bg-white"
                              onClick={() => updateCart(item.id, -1)}
                            >
                              <Minus className="h-4 w-4 text-gray-500" />
                            </Button>
                            <span className="w-4 text-center font-bold">{cart[item.id] || 0}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-md hover:bg-white text-terracotta"
                              onClick={() => updateCart(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </MoroccanCard>
          </div>

          {/* Sidebar - Cart & Order History */}
          <div className="space-y-6">
            {/* Cart Summary */}
            <Card className="border-terracotta/30 shadow-md">
              <CardHeader className="bg-terracotta/5 border-b border-terracotta/10 pb-4">
                <CardTitle className="text-lg text-mahogany">Votre Commande</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {cartItemsCount === 0 ? (
                  <p className="text-gray-500 text-center py-6 text-sm">Votre panier est vide</p>
                ) : (
                  <div className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {Object.entries(cart).map(([id, qty]) => {
                        const item = MENU_ITEMS.find(i => i.id === id)!;
                        return (
                          <li key={id} className="flex justify-between text-gray-700 border-b border-dashed border-gray-200 pb-1">
                            <span>{qty}x {item.name.split('(')[0]}</span>
                            <span className="font-medium">{item.price * qty} MAD</span>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t text-mahogany">
                      <span>Total</span>
                      <span>
                        {Object.entries(cart).reduce((acc, [id, qty]) => acc + MENU_ITEMS.find(i => i.id === id)!.price * qty, 0)} MAD
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-terracotta hover:bg-mahogany text-white mt-4" 
                      onClick={submitOrder}
                      disabled={ordering}
                    >
                      {ordering ? 'Envoi...' : (
                        <span className="flex items-center gap-2"><Send className="h-4 w-4" /> Commander</span>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order History */}
            {orders.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" /> Commandes récentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="p-3 bg-gray-50 rounded-lg border text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{order.total_price} MAD</span>
                        <StatusBadge status={order.status} className="text-[10px] px-2 h-5" />
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {/* Booking Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-800">Votre Séjour</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Arrivée:</span>
                  <span className="font-medium text-gray-900">{new Date(booking.check_in).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Départ:</span>
                  <span className="font-medium text-gray-900">{new Date(booking.check_out).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statut:</span>
                  <StatusBadge status={booking.status} className="scale-90 origin-right" />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
