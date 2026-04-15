import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LayoutDashboard, CalendarDays, BedDouble, UtensilsCrossed, Sparkles, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

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
    { name: 'Tableau de Bord', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Réservations', href: '/admin/reservations', icon: CalendarDays },
    { name: 'Chambres', href: '/admin/chambres', icon: BedDouble },
    { name: 'Service d\'étage', href: '/admin/service-etage', icon: UtensilsCrossed },
    { name: 'Nettoyage', href: '/admin/nettoyage', icon: Sparkles },
    { name: 'Médias', href: '/admin/medias', icon: ImageIcon },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-mahogany text-white md:block hidden shadow-xl flex-col">
        <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6 mt-4">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="font-playfair text-xl font-bold text-gold leading-none">Diar EL Mehdi</span>
            <span className="text-[10px] text-terracotta tracking-widest uppercase">Admin</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sand/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-5 w-5 text-terracotta" />
              {item.name}
            </Link>
          ))}
          <form action="/admin/login" method="POST" className="mt-auto">
            {/* Using a form simply because the logout action needs a post or client action. We'll link to a client component or do this: */}
          </form>
          <div className="mt-auto">
            <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sand/60 transition-colors hover:text-white">
              Voir le site public
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
          <h2 className="font-playfair text-lg font-bold text-mahogany">Administration</h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500 hidden sm:block">{user.email}</p>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
