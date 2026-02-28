-- Create candidates table
CREATE TABLE candidates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Section 1: Personal Info
  first_name text NOT NULL,
  last_name text NOT NULL,
  whatsapp text NOT NULL,
  email text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  age integer NOT NULL,
  id_document_url text,
  
  -- Section 2: Role
  role text check (role in ('Closeur', 'Livreur', 'Les deux')) NOT NULL,
  
  -- Section 3: Closer specific
  sales_experience text,
  product_types text,
  sales_per_day text,
  objection_handling text,
  has_smartphone_and_internet text,
  has_pc text,
  availability text,
  presentation_video_url text,
  
  -- Section 3: Delivery specific
  has_motorbike text,
  drivers_license_url text,
  delivery_experience text,
  immediate_availability text,
  client_refusal_handling text,
  coverage_zone text,

  -- Admin Info
  status text DEFAULT 'En attente' check (status in ('En attente', 'Accepté', 'Refusé', 'Test')),
  score integer DEFAULT 0
);

-- Row Level Security (RLS)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (submit form)
CREATE POLICY "Allow anonymous insert" ON candidates FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated admins to read all
CREATE POLICY "Allow admin read" ON candidates FOR SELECT TO authenticated USING (true);

-- Allow authenticated admins to update
CREATE POLICY "Allow admin update" ON candidates FOR UPDATE TO authenticated USING (true);
