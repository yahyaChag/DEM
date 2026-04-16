"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminRoomEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'nouvelle';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [room, setRoom] = useState<Partial<Database['public']['Tables']['rooms']['Insert']>>({
    name: '',
    description: '',
    price_per_night: 500,
    status: 'Disponible',
    features: { capacity: 2, size: 25, bedType: 'Lit double' },
    picture_urls: ['https://placehold.co/1200x800/E8D5B7/3C1518?text=Chambre']
  });

  useEffect(() => {
    if (!isNew) {
      const fetchRoom = async () => {
        const { data, error } = await supabase.from('rooms').select('*').eq('id', resolvedParams.id).single();
        if (data) setRoom(data);
        if (error) toast.error(error.message);
        setLoading(false);
      };
      fetchRoom();
    }
  }, [isNew, resolvedParams.id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const roomData = {
        name: room.name!,
        description: room.description!,
        price_per_night: room.price_per_night!,
        status: room.status as any,
        features: room.features,
        picture_urls: room.picture_urls
      };

      if (isNew) {
        const { error } = await (supabase.from('rooms') as any).insert(roomData);
        if (error) throw error;
        toast.success("Chambre créée");
        router.push('/admin/chambres');
      } else {
        const { error } = await (supabase.from('rooms') as any).update(roomData).eq('id', resolvedParams.id);
        if (error) throw error;
        toast.success("Chambre mise à jour");
        router.push('/admin/chambres');
      }
    } catch (err: any) {
      toast.error("Erreur: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-playfair font-bold text-mahogany border-b-2 border-terracotta pb-2 inline-block">
        {isNew ? 'Ajouter une chambre' : 'Éditer la chambre'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la chambre</Label>
                <Input 
                  id="name" 
                  required 
                  value={room.name || ''} 
                  onChange={(e) => setRoom({...room, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix par nuit (MAD)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  required 
                  value={room.price_per_night || ''} 
                  onChange={(e) => setRoom({...room, price_per_night: parseInt(e.target.value)})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                rows={4} 
                required 
                value={room.description || ''} 
                onChange={(e) => setRoom({...room, description: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut Initial</Label>
                <Select value={room.status as string} onValueChange={(v) => setRoom({...room, status: v as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="Occupée">Occupée</SelectItem>
                    <SelectItem value="Nettoyage Requis">Nettoyage Requis</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Simplified features editor for mock purposes */}
              <div className="space-y-2">
                <Label>Capacité (personnes)</Label>
                <Input 
                  type="number" 
                  value={(room.features as any)?.capacity || ''} 
                  onChange={(e) => setRoom({...room, features: { ...(room.features as any), capacity: e.target.value }})} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
          <Button type="submit" disabled={saving} className="bg-olive hover:bg-jade text-white">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
