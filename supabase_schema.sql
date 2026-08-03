-- ============================================================
-- MAISON LUMIÈRE HOTEL MANAGEMENT - SUPABASE DATABASE SCHEMA
-- Copy and run this script in your Supabase SQL Editor
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- ============================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'guest' CHECK (role IN ('guest', 'receptionist', 'manager')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure missing columns exist if table was already created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'guest';

-- 3. CREATE ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    capacity INT DEFAULT 2,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'under maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure missing columns exist if table was already created
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 2;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 4. CREATE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    check_in DATE,
    check_out DATE,
    nights INT DEFAULT 1,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'checked-in', 'checked-out', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure missing columns exist if table was already created
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS check_in DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS check_out DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'booked';

-- 5. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for demonstration purposes
DROP POLICY IF EXISTS "Public Profiles Policy" ON public.profiles;
CREATE POLICY "Public Profiles Policy" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Rooms Policy" ON public.rooms;
CREATE POLICY "Public Rooms Policy" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Bookings Policy" ON public.bookings;
CREATE POLICY "Public Bookings Policy" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- 6. INSERT SAMPLE LUXURY ROOMS DATA (OPTIONAL)
INSERT INTO public.rooms (number, type, capacity, price, description, image_url, amenities, status)
VALUES
('101', 'Deluxe Garden Suite', 2, 180.00, 'A serene suite overlooking hotel tropical gardens with king bed and marble bath.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', ARRAY['King Bed', 'Garden View', 'Free Wi-Fi', 'Mini Bar'], 'available'),
('102', 'Executive Ocean View', 2, 250.00, 'Spacious oceanfront room with panoramic sunset balcony and private jacuzzi.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', ARRAY['Ocean View', 'Balcony', 'Jacuzzi', 'Breakfast Included'], 'available'),
('201', 'Presidential Lumière Suite', 4, 450.00, 'Top-floor penthouse suite featuring private lounge, dining area, and 24/7 butler service.', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', ARRAY['Penthouse', 'Butler Service', '2 Bedrooms', 'Private Pool'], 'available')
ON CONFLICT (number) DO UPDATE 
SET type = EXCLUDED.type, price = EXCLUDED.price, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
