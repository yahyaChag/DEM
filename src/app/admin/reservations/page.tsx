"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { toast } from 'sonner';

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  rooms?: { name: string } | null;
};

export default function AdminReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('Toutes');
  const supabase = createClient();

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, rooms(name)')
      .order('created_at', { ascending: false });

    if (data) {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('public:bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
        toast.info("Les réservations ont été mises à jour (Temps réel)");
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus as any })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    } else {
      toast.success("Statut mis à jour avec succès");
    }
  };

  const filteredBookings = filter === 'Toutes' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-playfair font-bold text-mahogany border-b-2 border-terracotta pb-2 inline-block">
          Gestion des Réservations
        </h1>
        <div className="flex gap-2 pb-2 overflow-x-auto w-full sm:w-auto text-sm">
          {['Toutes', 'En attente', 'Confirmées', 'Arrivé', 'Départ', 'Annulée'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                filter === f ? 'bg-terracotta text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-sand/30">
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Chambre</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-gray-500">Chargement des réservations...</TableCell>
                </TableRow>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono">{b.booking_reference}</TableCell>
                    <TableCell>
                      <div className="font-medium">{b.guest_name}</div>
                      <div className="text-xs text-gray-500">{b.guest_phone}</div>
                    </TableCell>
                    <TableCell>{b.rooms?.name || 'Inconnue'}</TableCell>
                    <TableCell>
                      {new Date(b.check_in).toLocaleDateString('fr-FR')} au {new Date(b.check_out).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {b.total_price} MAD
                      <br />
                      <Badge variant="outline" className="text-[10px] mt-1">{b.payment_status}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell>
                      {b.status === 'En attente' && (
                        <Button size="sm" onClick={() => updateStatus(b.id, 'Confirmée')} className="mr-2 bg-olive hover:bg-jade">Confirmer</Button>
                      )}
                      {b.status === 'Confirmée' && (
                        <Button size="sm" onClick={() => updateStatus(b.id, 'Arrivé')} className="mr-2 bg-terracotta hover:bg-mahogany">Check-in</Button>
                      )}
                      {b.status === 'Arrivé' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, 'Départ')} className="mr-2">Check-out</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-gray-500">Aucune réservation trouvée pour ce filtre.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
