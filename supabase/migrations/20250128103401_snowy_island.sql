/*
  # Clean up image tables and restore direct image URLs
  
  1. Changes
    - Drop icon_images and poi_images tables
    - Restore icon_url and image_url columns with proper data
*/

-- First ensure the icon_url column exists and has default value
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'categories' 
    AND column_name = 'icon_url'
  ) THEN
    ALTER TABLE categories ADD COLUMN icon_url text DEFAULT '/icons/default.png' NOT NULL;
  END IF;
END $$;

-- Add image_url column to points_of_interest if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'points_of_interest' 
    AND column_name = 'image_url'
  ) THEN
    ALTER TABLE points_of_interest ADD COLUMN image_url text;
  END IF;
END $$;

-- Drop the image tables if they exist
DROP TABLE IF EXISTS icon_images;
DROP TABLE IF EXISTS poi_images;

-- Update category icons with their proper paths
UPDATE categories
SET icon_url = CASE name
  WHEN 'Aldeias de Calcário' THEN '/icons/Aldeias-de-calcario.png'
  WHEN 'Aldeias do Xisto' THEN '/icons/Aldeias-do-xisto.png'
  WHEN 'Alojamento Local' THEN '/icons/alojamentos-locais.png'
  WHEN 'Animação Turística' THEN '/icons/animacao-turistica.png'
  WHEN 'Arqueologia' THEN '/icons/arqueologia.png'
  WHEN 'Baloiços' THEN '/icons/baloicos.png'
  WHEN 'Barragens' THEN '/icons/barragens.png'
  WHEN 'Cascatas' THEN '/icons/cascatas.png'
  WHEN 'Castelos' THEN '/icons/castelos.png'
  WHEN 'Enoturismo' THEN '/icons/enoturismo.png'
  WHEN 'Grutas e Buracas' THEN '/icons/buracas-e-grutas.png'
  WHEN 'Miradouros' THEN '/icons/miradouros.png'
  WHEN 'Moinhos de Vento' THEN '/icons/moinhos-de-vento.png'
  WHEN 'Museus' THEN '/icons/museus.png'
  WHEN 'Outros Estabelecimentos' THEN '/icons/outros-estabelecimentos.png'
  WHEN 'Parque de Campismo' THEN '/icons/parque-de-campismo.png'
  WHEN 'Parques Temáticos' THEN '/icons/parques-tematicos.png'
  WHEN 'Passadiços' THEN '/icons/passadicos.png'
  WHEN 'Património Mundial' THEN '/icons/patrimonio-mundial.png'
  WHEN 'Percursos e Rotas' THEN '/icons/percursos-e-rotas.png'
  WHEN 'Praias Fluviais' THEN '/icons/praias-fluviais.png'
  WHEN 'Produtores Locais' THEN '/icons/produtores-locais.png'
  WHEN 'Restaurantes' THEN '/icons/restaurante.png'
  ELSE '/icons/default.png'
END;

-- Update POI images with their proper paths
UPDATE points_of_interest
SET image_url = CASE name
  WHEN 'Poios' THEN '/img-poi/ponto-interesse/aldeias-calcario/calcario-poios.png'
  WHEN 'Ariques' THEN '/img-poi/ponto-interesse/aldeias-calcario/calcario-ariques.png'
END
WHERE name IN ('Poios', 'Ariques');