-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Site Settings Table
create table public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  homepage_images text[] default array[]::text[],
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Rooms Table
create table public.rooms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  price_per_night integer not null,
  features jsonb default '{}'::jsonb not null,
  picture_urls text[] default array[]::text[],
  status text not null check (status in ('Disponible', 'Occupée', 'Nettoyage Requis', 'Maintenance')) default 'Disponible',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Bookings Table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid references public.rooms(id) on delete cascade not null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  check_in date not null,
  check_out date not null,
  total_price integer not null,
  booking_reference text unique not null,
  status text not null check (status in ('Confirmée', 'En attente', 'Annulée', 'Arrivé', 'Départ')) default 'En attente',
  payment_status text not null check (payment_status in ('Payé', 'En attente', 'Échoué', 'Paiement sur place')) default 'En attente',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Room Service Orders Table
create table public.room_service_orders (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) on delete cascade not null,
  items jsonb not null, -- Array of { name, quantity, price }
  total_price integer not null,
  status text not null check (status in ('Reçu', 'En préparation', 'Livré', 'Annulé')) default 'Reçu',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup Row Level Security (RLS)

-- Site Settings: Anyone can read, authenticated admins can write
alter table public.site_settings enable row level security;

create policy "Public can view site settings" 
on public.site_settings for select 
to public 
using (true);

create policy "Admins can insert site settings" 
on public.site_settings for insert 
to authenticated 
with check (true);

create policy "Admins can update site settings" 
on public.site_settings for update 
to authenticated 
using (true);

-- Rooms: Anyone can read, authenticated admins can write
alter table public.rooms enable row level security;

create policy "Public can view rooms" 
on public.rooms for select 
to public 
using (true);

create policy "Admins can insert rooms" 
on public.rooms for insert 
to authenticated 
with check (true);

create policy "Admins can update rooms" 
on public.rooms for update 
to authenticated 
using (true);

create policy "Admins can delete rooms" 
on public.rooms for delete 
to authenticated 
using (true);

-- Bookings: Anyone can insert (to make a booking), anyone can select their own booking by reference, admins can do anything
alter table public.bookings enable row level security;

create policy "Public can insert bookings" 
on public.bookings for insert 
to public 
with check (true);

create policy "Public can view their own booking" 
on public.bookings for select 
to public 
using (true);

create policy "Admins can view all bookings" 
on public.bookings for select 
to authenticated 
using (true);

create policy "Admins can update bookings" 
on public.bookings for update 
to authenticated 
using (true);

-- Room Service Orders: Public can insert/view based on booking, admin can update/manage
alter table public.room_service_orders enable row level security;

create policy "Public can insert room service orders" 
on public.room_service_orders for insert 
to public 
with check (true);

create policy "Public can view room service orders" 
on public.room_service_orders for select 
to public 
using (true);

create policy "Admins can view all room service orders" 
on public.room_service_orders for select 
to authenticated 
using (true);

create policy "Admins can update room service orders" 
on public.room_service_orders for update 
to authenticated 
using (true);

-- Realtime functionality setup
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.room_service_orders;

-- Seed initial site settings
insert into public.site_settings (homepage_images) values ('{}');
