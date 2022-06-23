## Lancer l'application

- npm install
- npm run dev

Il est possible que vous devriez installer nodemon : <br />
npm install nodemon -g

## Créer une base de donnée (Postgres)

Vous pouvez modifier les informations de votre base de donnée dans le fichier .env <br />
N'oubliez pas de créer votre base de donnée (ici, appelée "eshop") et votre table "users" :

- CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  level INTEGER NOT NULL,
  UNIQUE(email)
  );

- CREATE SEQUENCE id_seq;

- ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('cateogry_id_seq'::regclass);
- ALTER TABLE users ALTER COLUMN level SET DEFAULT 1;

- CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  price MONEY NOT NULL,
  stock INTEGER NOT NULL,
  image VARCHAR(500) NOT NULL,
  description VARCHAR
  UNIQUE(id)
  );

- CREATE TABLE cart (
  user_id BIGSERIAL NOT NULL,
  product_id BIGSERIAL NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_price MONEY NOT NULL,
  product_quantity INTEGER NOT NULL
  constraint fk_user_id
  foreign key (user_id)
  REFERENCES users (id)
  constraint fk_product_id
  foreign key (product_id)
  REFERENCES products (id)
  );

- CREATE TABLE order_product (
  order_id BIGSERIAL NOT NULL,
  product_id BIGSERIAL NOT NULL,
  product_quantity INTEGER NOT NULL
  constraint fk_order_id
  foreign key (order_id)
  REFERENCES order_data (order_id)
  constraint fk_product_id
  foreign key (product_id)
  REFERENCES products (id)
  );

- CREATE TABLE order_data (
  order_id BIGSERIAL PRIMARY KEY NOT NULL,
  user_id BIGSERIAL NOT NULL,
  datetime VARCHAR NOT NULL
  constraint fk_user_id
  foreign key (user_id)
  REFERENCES users (id)
  );

Voici quelques produits que nous vous proposons d'ajouter à la boutique :

- insert into products values (0, 'Barbie et les trois mousquetaires', 14.99, 50, https://musicart.xboxlive.com/7/c70c1100-0000-0000-0000-000000000002/504/image.jpg?w=1920&h=1080', 'Rejoignez Barbie en tant que Corinne, une jeune fille de la campagne qui se rend à Paris pour poursuivre son grand rêve : devenir mousquetaire !');

- insert into products values (1, 'Barbie : Video Game Hero', 10.99, 100, 'https://m.media-amazon.com/images/I/81nYemv+feL._AC_SL1500_.jpg', 'Préparez-vous pour le prochain niveau ! Barbie se retrouve dans son jeu vidéo préféré et là, elle se transforme en personnage de patin à roulettes.');
