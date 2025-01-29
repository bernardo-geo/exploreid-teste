/*
  # Drop image tables and restore direct image references
  
  1. Changes
    - Drop icon_images and poi_images tables
    - Restore icon_url and image_url columns
*/

-- Drop the image tables
DROP TABLE IF EXISTS icon_images;
DROP TABLE IF EXISTS poi_images;

-- Add back the direct image URL columns
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_url text NOT NULL;
ALTER TABLE points_of_interest ADD COLUMN IF NOT EXISTS image_url text;