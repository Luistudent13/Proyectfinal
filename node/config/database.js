const mysql = require('mysql2/promise');
require('dotenv').config({ path: '/home/ricardo/sites/estacionamiento/node/.env' });

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',   // TCP explícito
  user: process.env.DB_USER || 'guardia',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'estacionamiento_universitario',
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
  // 👇 esta línea fuerza a no usar socket de localhost
  enableKeepAlive: true
});

module.exports = db;

