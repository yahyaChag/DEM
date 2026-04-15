import { createClient } from '@/lib/supabase/server';
import { RoomCard } from '@/components/ui/room-card';
import { BookingSearch } from '@/components/ui/booking-search';

export const revalidate = 60;

export default async function ChambresPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const checkin = params.checkin as string | undefined;
  const checkout = params.checkout as string | undefined;

  // Ideally, if checkin/checkout are provided, we should filter out rooms that are already booked
  // For simplicity in this mockup, we just fetch all rooms and apply basic status filtering
  let query = supabase.from('rooms').select('*');
  
  // If dates are provided, in a real app we'd do a complex join with bookings table.
  // We'll just fetch all non-maintenance rooms for now.
  query = query.not('status', 'eq', 'Maintenance');

  const { data, error } = await query;
  const roomsList = data as any[];

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Header Banner */}
      <div className="bg-mahogany py-16 relative">
        <div className="absolute inset-0 bg-[url('https://placehold.co/100x100/3C1518/4C2225?text=Pattern')] opacity-10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-sand mb-4">Nos Chambres</h1>
          <p className="text-sand/80 max-w-2xl mx-auto">
            Découvrez nos espaces conçus pour votre repos, alliant l'authenticité de l'artisanat marocain au confort moderne.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Widget */}
        <div className="mb-12 max-w-4xl mx-auto -mt-16 relative z-20">
          <BookingSearch />
        </div>

        {/* Results */}
        {checkin && checkout && (
          <div className="mb-8">
            <h2 className="text-2xl font-playfair text-mahogany">
              Résultats de recherche pour votre séjour du {new Date(checkin).toLocaleDateString('fr-FR')} au {new Date(checkout).toLocaleDateString('fr-FR')}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {roomsList && roomsList.length > 0 ? (
            roomsList.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">Aucune chambre disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
