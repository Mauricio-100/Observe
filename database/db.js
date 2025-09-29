import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs';
import { URL } from 'url';

dotenv.config();

// Vérifier que l'URI de la base de données est bien définie
if (!process.env.DATABASE_URL) {
  throw new Error("L'URI de la base de données (DATABASE_URL) n'est pas définie dans le fichier .env");
}

const connectionString = process.env.DATABASE_URL;
const dbUrl = new URL(connectionString);

// Vérifier que le certificat CA existe
if (!fs.existsSync(process.env.DB_SSL_CA_PATH)) {
  throw new Error(`Le certificat CA est introuvable au chemin: ${process.env.DB_SSL_CA_PATH}`);
}

const dbConfig = {
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1), // Enlève le premier '/'
  ssl: {
    // Lire le certificat CA depuis le fichier
    ca: fs.readFileSync(process.env.DB_SSL_CA_PATH)
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Créer le pool de connexions avec la configuration
const pool = mysql.createPool(dbConfig);

console.log('Pool de connexions MySQL configuré pour Aiven Cloud.');

// Exporter la version "promise-based" du pool pour utiliser async/await
export default pool.promise();
