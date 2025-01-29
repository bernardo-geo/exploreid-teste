/*
  # Populate Categories Table
  
  1. Data Migration
    - Insert all categories from the existing configuration
    - Includes icons and group types
  
  2. Categories
    - Points of Interest categories
    - Ambassador categories
*/

INSERT INTO categories (name, description, icon_url, group_type) VALUES
  ('Aldeias de Calcário', 'Aldeia de calcário', '/icons/Aldeias-de-calcario.png', 'ponto-interesse'),
  ('Aldeias do Xisto', 'Medieval castles and fortifications', '/icons/Aldeias-do-xisto.png', 'ponto-interesse'),
  ('Alojamento Local', 'Alojamentos Locais', '/icons/alojamentos-locais.png', 'embaixador'),
  ('Animação Turística', 'Animação Turística', '/icons/animacao-turistica.png', 'embaixador'),
  ('Arqueologia', 'Arqueologia', '/icons/arqueologia.png', 'ponto-interesse'),
  ('Baloiços', 'Baloiços', '/icons/baloicos.png', 'ponto-interesse'),
  ('Barragens', 'Barragens', '/icons/barragens.png', 'ponto-interesse'),
  ('Cascatas', 'Cascatas', '/icons/cascatas.png', 'ponto-interesse'),
  ('Castelos', 'Castelos', '/icons/castelos.png', 'ponto-interesse'),
  ('Enoturismo', 'Enoturismo', '/icons/enoturismo.png', 'embaixador'),
  ('Grutas e Buracas', 'Grutas e Buracas', '/icons/buracas-e-grutas.png', 'ponto-interesse'),
  ('Miradouros', 'Miradouros', '/icons/miradouros.png', 'ponto-interesse'),
  ('Moinhos de Vento', 'Moinhos de Vento', '/icons/moinhos-de-vento.png', 'ponto-interesse'),
  ('Museus', 'Museus', '/icons/museus.png', 'ponto-interesse'),
  ('Outros Estabelecimentos', 'Outros Estabelecimentos', '/icons/outros-estabelecimentos.png', 'embaixador'),
  ('Parque de Campismo', 'Parque de Campismo', '/icons/parque-de-campismo.png', 'embaixador'),
  ('Parques Temáticos', 'Parques Temáticos', '/icons/parques-tematicos.png', 'ponto-interesse'),
  ('Passadiços', 'Passadiços', '/icons/passadicos.png', 'ponto-interesse'),
  ('Património Mundial', 'Património Mundial', '/icons/patrimonio-mundial.png', 'ponto-interesse'),
  ('Percursos e Rotas', 'Percursos e Rotas', '/icons/percursos-e-rotas.png', 'ponto-interesse'),
  ('Praias Fluviais', 'Praias Fluviais', '/icons/praias-fluviais.png', 'ponto-interesse'),
  ('Produtores Locais', 'Produtores Locais', '/icons/produtores-locais.png', 'embaixador'),
  ('Restaurantes', 'Restaurantes', '/icons/restaurante.png', 'embaixador');