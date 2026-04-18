import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LayoutDashboard, CalendarDays, BedDouble, UtensilsCrossed, Sparkles, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { MobileNav } from '@/components/admin/mobile-nav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Middleware also protects this, but we double check here
  if (error || !user) {
    redirect('/admin/login');
  }

  const navItems = [
    { name: 'Tableau de Bord', href: '/admin/dashboard', iconId: 'dashboard' },
    { name: 'Réservations', href: '/admin/reservations', iconId: 'reservations' },
    { name: 'Chambres', href: '/admin/chambres', iconId: 'rooms' },
    { name: 'Service d\'étage', href: '/admin/service-etage', iconId: 'service' },
    { name: 'Nettoyage', href: '/admin/nettoyage', iconId: 'cleaning' },
    { name: 'Médias', href: '/admin/medias', iconId: 'media' },
    { name: 'Paramètres', href: '/admin/parametres', iconId: 'settings' },
  ];

  // Map icon identifiers to components for the server-side desktop sidebar
  const IconMap: Record<string, any> = {
    dashboard: LayoutDashboard,
    reservations: CalendarDays,
    rooms: BedDouble,
    service: UtensilsCrossed,
    cleaning: Sparkles,
    media: ImageIcon,
    settings: Settings,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-mahogany text-white hidden md:flex flex-col shadow-xl">
        <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6 mt-4">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="font-playfair text-xl font-bold text-gold leading-none">Diar EL Mehdi</span>
            <span className="text-[10px] text-terracotta tracking-widest uppercase">Admin</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-4">
          {navItems.map((item) => {
            const Icon = IconMap[item.iconId];
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sand/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-5 w-5 text-terracotta" />
                {item.name}
              </Link>
            );
          })}
          <div className="mt-auto">
            <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sand/60 transition-colors hover:text-white">
              Voir le site public
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 w-full max-w-full overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <MobileNav navItems={navItems} />
            <h2 className="font-playfair text-lg font-bold text-mahogany">Administration</h2>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 font-medium">{user.email}</p>
              <p className="text-[10px] text-terracotta font-playfair italic">Diar EL Mehdi</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-cream border border-terracotta/20 flex items-center justify-center text-mahogany font-bold text-xs">
              {user.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
