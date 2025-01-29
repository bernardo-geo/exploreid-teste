/*
  # Clean up categories and create ambassadors table

  1. Changes
    - Remove duplicate categories
    - Create new ambassadors table for POIs with 'embaixador' group type
    - Copy relevant POIs to ambassadors table
    - Add necessary indexes and policies

  2. Security
    - Enable RLS on ambassadors table
    - Add policies for public read access
*/

-- First, remove duplicate categories by keeping the one with the earliest created_at
DELETE FROM categories a USING (
  SELECT MIN(created_at) as min_date, name
  FROM categories
  GROUP BY name
  HAVING COUNT(*) > 1
) b
WHERE a.name = b.name
AND a.created_at > b.min_date;

-- Create ambassadors table
CREATE TABLE IF NOT EXISTS ambassadors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  project text NOT NULL,
  url text,
  category_id uuid REFERENCES categories(id),
  image_url text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  has_moeda_id boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  contact_email text,
  contact_phone text,
  business_hours text,
  website text,
  social_media jsonb
);

-- Copy existing ambassador POIs to the new table
INSERT INTO ambassadors (
  name,
  description,
  project,
  url,
  category_id,
  image_url,
  latitude,
  longitude,
  has_moeda_id,
  created_at
)
SELECT 
  p.name,
  p.description,
  p.project,
  p.url,
  p.category_id,
  p.image_url,
  p.latitude,
  p.longitude,
  p.has_moeda_id,
  p.created_at
FROM points_of_interest p
JOIN categories c ON p.category_id = c.id
WHERE c.group_type = 'embaixador';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ambassadors_category ON ambassadors(category_id);
CREATE INDEX IF NOT EXISTS idx_ambassadors_coordinates ON ambassadors(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_ambassadors_has_moeda_id ON ambassadors(has_moeda_id);

-- Enable RLS
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on ambassadors" ON ambassadors
    FOR SELECT TO public USING (true);