/*
  # Insert Points of Interest Data

  1. Data Migration
    - Insert points of interest data from the existing application
    - Link POIs to their respective categories
    - Set Moeda ID flags and other metadata

  2. Data Structure
    - Each POI includes:
      - Basic info (name, description, project)
      - Location (latitude, longitude)
      - Category reference
      - Media (image URLs)
      - External links
*/

-- First, let's get the category IDs we need
WITH category_ids AS (
  SELECT id, name FROM categories
),
-- Now insert the POIs
poi_inserts AS (
  INSERT INTO points_of_interest (
    name,
    description,
    project,
    url,
    category_id,
    image_url,
    latitude,
    longitude,
    has_moeda_id
  )
  VALUES
    -- Aldeias de Calcário
    (
      'Poios',
      'A aldeia de calcário de Poios destaca-se pelo famoso Vale dos Poios, que exibe um grande canhão fluviocársico ...',
      'Pombal',
      'https://exploreid.pt/portfolio-item/poios/',
      (SELECT id FROM category_ids WHERE name = 'Aldeias de Calcário'),
      '/img-poi/ponto-interesse/aldeias-calcario/calcario-poios.png',
      39.98914953757288,
      -8.560566846032716,
      false
    ),
    (
      'Ariques',
      'A aldeia de Ariques é um local que guarda tradição e cultura, preservando traços típicos da ruralidade antiga. É na ...',
      'Alvaiázere',
      'https://exploreid.pt/portfolio-item/ariques/',
      (SELECT id FROM category_ids WHERE name = 'Aldeias de Calcário'),
      '/img-poi/ponto-interesse/aldeias-calcario/calcario-ariques.png',
      39.85970095511408,
      -8.42613331654575,
      false
    )
  RETURNING id
)
SELECT 'Points of Interest inserted successfully' as message;