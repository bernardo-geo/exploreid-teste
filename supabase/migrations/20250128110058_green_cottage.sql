/*
  # Add Casais da Granja POI
  
  1. New Data
    - Add new point of interest "Casais da Granja"
    - Connect to existing image from storage
*/

-- Insert Casais da Granja POI
INSERT INTO points_of_interest (
  name,
  description,
  project,
  category_id,
  image_url,
  latitude,
  longitude,
  has_moeda_id
)
VALUES (
  'Casais da Granja',
  'Casais da Granja é uma aldeia típica que preserva a arquitetura tradicional em calcário, revelando a rica história e cultura da região através das suas construções ancestrais.',
  'Pombal',
  (SELECT id FROM categories WHERE name = 'Aldeias de Calcário' LIMIT 1),
  '/img-poi/ponto-interesse/aldeias-calcario/calcario-ariques.png',
  39.9234,
  -8.5123,
  false
);