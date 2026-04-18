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
import { UploadCloud, Trash2 } from 'lucide-react';
import { uploadToAubergeMedia, generateUniqueFileName } from '@/lib/supabase/storage';
import { useRef } from 'react';

export default function AdminRoomEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'nouvelle';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [room, setRoom] = useState<Partial<Database['public']['Tables']['rooms']['Insert']>>({
    name: '',
    description: '',
    price_per_night: 500,
    status: 'Disponible',
    features: { capacity: 2, size: 25, bedType: 'Lit double' },
    picture_urls: []
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(true);
    
    try {
      const fileName = generateUniqueFileName(file.name);
      const path = `rooms/${fileName}`;
      
      const publicUrl = await uploadToAubergeMedia(file, path);
      
      const currentUrls = room.picture_urls || [];
      setRoom({
        ...room,
        picture_urls: [...currentUrls, publicUrl]
      });
      
      toast.success("Image téléchargée");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploading(false);
    }
  };

  const removeImage = (urlToRemove: string) => {
    const currentUrls = room.picture_urls || [];
    setRoom({
      ...room,
      picture_urls: currentUrls.filter(url => url !== urlToRemove)
    });
  };

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

        {/* Images Management Section */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Images de la chambre</Label>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                <Button 
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <UploadCloud className="h-4 w-4" />
                  {uploading ? 'Upload...' : 'Ajouter une image'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {room.picture_urls && room.picture_urls.length > 0 ? (
                room.picture_urls.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    <img src={url} alt={`Room ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => removeImage(url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed rounded-lg">
                  Aucune image ajoutée
                </div>
              )}
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
