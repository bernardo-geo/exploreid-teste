/*
  # Transfer ambassador POIs to Supabase

  1. Changes
    - Insert ambassador POIs into the ambassadors table
    - Add business details and contact information
    - Set proper category associations

  2. Security
    - Uses existing RLS policies
*/

-- Insert ambassador POIs
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
  contact_email,
  contact_phone,
  business_hours,
  website,
  social_media
)
VALUES
  -- Alojamento Local
  (
    'A Villa Chanca',
    'Situada em Chanca, Penela, a Villa Chanca é um alojamento local que oferece uma experiência única de estadia.',
    'Penela',
    'https://exploreid.pt/portfolio-item/a-villa-chanca/',
    (SELECT id FROM categories WHERE name = 'Alojamento Local' LIMIT 1),
    '/img-poi/embaixadores/alojamentos/al-a-villa-chanca.png',
    40.0234,
    -8.3876,
    true,
    'info@villachanca.pt',
    '+351 912 345 678',
    'Check-in: 15:00-20:00, Check-out: até 11:00',
    'https://villachanca.pt',
    '{"facebook": "villachanca", "instagram": "villachanca"}'
  ),
  -- Restaurantes
  (
    'Restaurante O Cantinho',
    'Localizado no coração de Penela, O Cantinho oferece pratos tradicionais da região.',
    'Penela',
    'https://exploreid.pt/portfolio-item/restaurante-o-cantinho/',
    (SELECT id FROM categories WHERE name = 'Restaurantes' LIMIT 1),
    '/img-poi/embaixadores/restaurantes/restaurante-o-cantinho.png',
    40.0312,
    -8.3901,
    true,
    'reservas@cantinho.pt',
    '+351 923 456 789',
    'Terça a Domingo: 12:00-15:00, 19:00-22:00\nEncerra à Segunda',
    'https://restaurantecantinho.pt',
    '{"facebook": "cantinhopenela", "instagram": "cantinhorestaurante"}'
  );