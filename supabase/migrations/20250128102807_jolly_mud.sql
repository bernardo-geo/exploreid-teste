/*
  # Create storage buckets and update image references
  
  1. Changes
    - Create storage buckets for icons and POI images
    - Create tables to track image metadata
    - Update references to use storage URLs
*/

-- Create tables for image metadata
CREATE TABLE IF NOT EXISTS icon_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
    filename text NOT NULL,
    storage_path text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poi_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    poi_id uuid REFERENCES points_of_interest(id) ON DELETE CASCADE,
    filename text NOT NULL,
    storage_path text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE icon_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE poi_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on icon_images" ON icon_images
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on poi_images" ON poi_images
    FOR SELECT TO public USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_icon_images_category ON icon_images(category_id);
CREATE INDEX IF NOT EXISTS idx_poi_images_poi ON poi_images(poi_id);

-- Remove old image columns
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'icon_url'
    ) THEN
        ALTER TABLE categories DROP COLUMN icon_url;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'points_of_interest' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE points_of_interest DROP COLUMN image_url;
    END IF;
END $$;