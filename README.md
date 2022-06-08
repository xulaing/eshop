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
  UNIQUE(email)
  );

- CREATE SEQUENCE id_seq;

- ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('cateogry_id_seq'::regclass);


## Créer la liste des produits de nous boutique en MongoBD (on utilise Mongoose pour connecter MongoDB à NodeJS)

### Installation MongoDB avec docker
docker pull mongo
docker run --name mongo -d mongo # mongo c'est aussi le nom de notre conteneur ici
docker exec -it mongo bash
/# mongo

Notre base de données s'appelle shopping : use shopping
