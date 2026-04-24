import { createClient } from '@/lib/supabase/server';
import { HomeClient } from '@/components/home-client';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const supabase = await createClient();

  // Fetch site settings for hero images
  const { data: settings } = await supabase
    .from('site_settings')
    .select('homepage_images')
    .single();

  const settingsAny = settings as any;
  const heroImages: string[] = settingsAny?.homepage_images?.length
    ? settingsAny.homepage_images
    : [
        'https://placehold.co/1920x1080/C4663A/FDF6EC?text=Diar+EL+Mehdi',
        'https://placehold.co/1920x1080/3C1518/E8D5B7?text=Auberge+de+Charme',
        'https://placehold.co/1920x1080/C5992E/3C1518?text=Moyen+Atlas',
      ];

  // Fetch top rooms
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .limit(6);

  const roomsList = (rooms as any[]) || [];

  return <HomeClient heroImages={heroImages} rooms={roomsList} />;
}
