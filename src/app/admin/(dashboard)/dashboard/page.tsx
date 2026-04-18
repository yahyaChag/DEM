import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, BedDouble, UtensilsCrossed, CreditCard } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

export const revalidate = 0; // Disable caching for dashboard

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts and stats
  const { count: totalReservations } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  const { count: activeReservations } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Confirmée', 'Arrivé']);

  const { count: roomsRequiresCleaning } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Nettoyage Requis');

  const { count: pendingRoomService } = await supabase
    .from('room_service_orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Reçu', 'En préparation']);

  // Fetch recent bookings for the table
  const { data } = await supabase
    .from('bookings')
    .select('*, rooms(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  const recentBookings = data as any[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair font-bold text-mahogany">Aperçu</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-terracotta">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Réservations</CardTitle>
            <CalendarDays className="h-4 w-4 text-terracotta" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mahogany">{totalReservations || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Depuis le début</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-olive">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Réservations Actives</CardTitle>
            <BedDouble className="h-4 w-4 text-olive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mahogany">{activeReservations || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Actuellement en cours ou prévues</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gold">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Commandes en Service</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mahogany">{pendingRoomService || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Préparation requise</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Nettoyage Requis</CardTitle>
            <SparklesIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mahogany">{roomsRequiresCleaning || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Chambres en attente de nettoyage</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-mahogany font-playfair">Réservations Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto overflow-y-hidden border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-mahogany/80">Référence</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-mahogany/80">Client</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-mahogany/80">Chambre</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-mahogany/80">Séjour</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap text-mahogany/80">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings && recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <tr key={booking.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-mono font-medium text-gray-900 whitespace-nowrap">{booking.booking_reference}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-mahogany">{booking.guest_name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-600">{(booking.rooms as any)?.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                          {new Date(booking.check_in).toLocaleDateString('fr-FR')} - {new Date(booking.check_out).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Aucune réservation récente</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Small icon helper
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
