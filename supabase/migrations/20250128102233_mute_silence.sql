/*
  # Update image references to use storage paths
  
  1. Changes
    - Add image_url column to points_of_interest if it doesn't exist
    - Update category icon URLs to use storage paths
    - Update POI image URLs to use storage paths
*/

-- First, add the image_url column if it doesn't exist
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

-- Update category icon URLs to use storage paths
UPDATE categories
SET icon_url = CASE name
  WHEN 'Aldeias de Calcário' THEN 'Aldeias-de-calcario.png'
  WHEN 'Aldeias do Xisto' THEN 'Aldeias-do-xisto.png'
  WHEN 'Alojamento Local' THEN 'alojamentos-locais.png'
  WHEN 'Animação Turística' THEN 'animacao-turistica.png'
  WHEN 'Arqueologia' THEN 'arqueologia.png'
  WHEN 'Baloiços' THEN 'baloicos.png'
  WHEN 'Barragens' THEN 'barragens.png'
  WHEN 'Cascatas' THEN 'cascatas.png'
  WHEN 'Castelos' THEN 'castelos.png'
  WHEN 'Enoturismo' THEN 'enoturismo.png'
  WHEN 'Grutas e Buracas' THEN 'buracas-e-grutas.png'
  WHEN 'Miradouros' THEN 'miradouros.png'
  WHEN 'Moinhos de Vento' THEN 'moinhos-de-vento.png'
  WHEN 'Museus' THEN 'museus.png'
  WHEN 'Outros Estabelecimentos' THEN 'outros-estabelecimentos.png'
  WHEN 'Parque de Campismo' THEN 'parque-de-campismo.png'
  WHEN 'Parques Temáticos' THEN 'parques-tematicos.png'
  WHEN 'Passadiços' THEN 'passadicos.png'
  WHEN 'Património Mundial' THEN 'patrimonio-mundial.png'
  WHEN 'Percursos e Rotas' THEN 'percursos-e-rotas.png'
  WHEN 'Praias Fluviais' THEN 'praias-fluviais.png'
  WHEN 'Produtores Locais' THEN 'produtores-locais.png'
  WHEN 'Restaurantes' THEN 'restaurante.png'
END;

-- Update POI image URLs to use storage paths
UPDATE points_of_interest
SET image_url = CASE name
  WHEN 'Poios' THEN 'calcario-poios.png'
  WHEN 'Ariques' THEN 'calcario-ariques.png'
END
WHERE name IN ('Poios', 'Ariques');