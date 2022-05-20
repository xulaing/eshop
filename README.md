# Sécurité Informatique | Projet

### Lucie Bottin & Céline Khauv

Dans le cadre du projet, nous avons réalisé un site web contenant 4 pages : la page principale, la page de connection, la page d'inscription et un dashboard pour l'utilisateur est connecté.<br />
Il est possible de tester les injections SQL sur le formulaire de connection.

### Dans le fichier server.js, entre les lignes 97 et 134, il est possible de choisir si on veut rendre les injections possible ou non.

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
