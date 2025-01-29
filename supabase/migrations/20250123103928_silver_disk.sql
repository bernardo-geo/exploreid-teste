/*
  # Initial Schema Setup
  
  1. Tables Created:
    - categories: Stores category information for points of interest
    - points_of_interest: Stores POI data
    - routes: Stores route information
    - poi_routes: Junction table for POI-route relationships
  
  2. Security:
    - RLS enabled on all tables
    - Public read access policies
*/

-- Create enum for group types
DO $$ BEGIN
    CREATE TYPE group_type AS ENUM ('ponto-interesse', 'embaixador');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    icon_url text NOT NULL,
    group_type group_type NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create points_of_interest table
CREATE TABLE IF NOT EXISTS points_of_interest (
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
    created_at timestamptz DEFAULT now()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    color text,
    created_at timestamptz DEFAULT now()
);

-- Create junction table for POIs and routes
CREATE TABLE IF NOT EXISTS poi_routes (
    poi_id uuid REFERENCES points_of_interest(id) ON DELETE CASCADE,
    route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (poi_id, route_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_of_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poi_routes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on categories" ON categories
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on points_of_interest" ON points_of_interest
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on routes" ON routes
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on poi_routes" ON poi_routes
    FOR SELECT TO public USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_group_type ON categories(group_type);
CREATE INDEX IF NOT EXISTS idx_poi_category ON points_of_interest(category_id);
CREATE INDEX IF NOT EXISTS idx_poi_coordinates ON points_of_interest(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_poi_has_moeda_id ON points_of_interest(has_moeda_id);