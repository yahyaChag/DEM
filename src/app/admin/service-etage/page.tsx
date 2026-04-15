"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { toast } from 'sonner';

type Order = Database['public']['Tables']['room_service_orders']['Row'] & {
  bookings?: { 
    room_id: string;
    rooms?: { name: string }
  } | null;
};

export default function AdminRoomServicePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    // Since there are two levels of joining (orders -> bookings -> rooms), we keep it simple for this mock:
    const { data, error } = await supabase
      .from('room_service_orders')
      .select('*, bookings(rooms(name))')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data as any);
    if (error) toast.error("Erreur de chargement: " + error.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('public:room_service_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_service_orders' }, () => {
        fetchOrders();
        toast.info("Nouvelle commande ou mise à jour du service d'étage!");
        // We could play a sound here for new orders
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('room_service_orders')
      .update({ status: newStatus as any })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    } else {
      toast.success("Commande mise à jour");
    }
  };

  const getRoomName = (order: any) => {
    try {
      return order.bookings?.rooms?.name || 'Chambre inconnue';
    } catch {
      return 'Chambre inconnue';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair font-bold text-mahogany border-b-2 border-terracotta pb-2 inline-block">
        Service d'Étage
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* En Attente */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-gray-700 bg-gray-100 p-3 rounded-lg text-center border-t-4 border-yellow-400">Nouveau / Reçu</h2>
          {orders.filter(o => o.status === 'Reçu').map(order => (
            <OrderCard key={order.id} order={order} roomName={getRoomName(order)} onUpdate={updateStatus} />
          ))}
        </div>

        {/* En préparation */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-gray-700 bg-gray-100 p-3 rounded-lg text-center border-t-4 border-blue-400">En Préparation</h2>
          {orders.filter(o => o.status === 'En préparation').map(order => (
            <OrderCard key={order.id} order={order} roomName={getRoomName(order)} onUpdate={updateStatus} />
          ))}
        </div>

        {/* Livré */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-gray-700 bg-gray-100 p-3 rounded-lg text-center border-t-4 border-green-400">Livré / Terminé</h2>
          {orders.filter(o => o.status === 'Livré').slice(0, 10).map(order => (
            <OrderCard key={order.id} order={order} roomName={getRoomName(order)} onUpdate={updateStatus} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, roomName, onUpdate }: { order: any, roomName: string, onUpdate: (id: string, s: string) => void }) {
  const items: any[] = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 px-4 bg-gray-50 border-b flex flex-row justify-between items-center">
        <CardTitle className="text-base font-bold text-mahogany">{roomName}</CardTitle>
        <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <ul className="text-sm space-y-1">
          {items && items.map((item, idx) => (
            <li key={idx} className="flex justify-between border-b border-dashed border-gray-200 pb-1">
              <span>{item.quantity}x {item.name}</span>
              <span className="text-gray-500">{item.price * item.quantity} MAD</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-mahogany pt-2">
          <span>Total</span>
          <span>{order.total_price} MAD</span>
        </div>
        
        <div className="flex gap-2 pt-2">
          {order.status === 'Reçu' && (
            <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600" onClick={() => onUpdate(order.id, 'En préparation')}>
              Préparer
            </Button>
          )}
          {order.status === 'En préparation' && (
            <Button size="sm" className="w-full bg-olive hover:bg-jade" onClick={() => onUpdate(order.id, 'Livré')}>
              Marquer Livré
            </Button>
          )}
          {order.status !== 'Livré' && order.status !== 'Annulé' && (
            <Button size="sm" variant="outline" className="w-full text-red-500 hover:bg-red-50" onClick={() => onUpdate(order.id, 'Annulé')}>
              Annuler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
