const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQLURL;
const host = process.env.DB_HOST;

const sslConfig = process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true' || (dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')) ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {};

let sequelize;
let isUsingSQLite = false;

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const sqlitePath = path.join(dataDir, 'database.sqlite');

if (dbUrl) {
  sequelize = new Sequelize(dbUrl, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: sslConfig,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  });
} else if (host && host !== 'your_mysql_host') {
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'ecommerce_platform';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: sslConfig,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  // If running on cloud server without remote MySQL credentials, use SQLite natively
  isUsingSQLite = true;
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: false,
  });
}

const connectDB = async () => {
  if (!isUsingSQLite) {
    try {
      if (!dbUrl && host) {
        const user = process.env.DB_USER || 'root';
        const password = process.env.DB_PASS || '';
        const database = process.env.DB_NAME || 'ecommerce_platform';
        const port = parseInt(process.env.DB_PORT || '3306', 10);
        try {
          const connection = await mysql.createConnection({ host, port, user, password });
          await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
          await connection.end();
        } catch (e) {}
      }

      await sequelize.authenticate();
      console.log(`✅ MySQL Database Connected Successfully!`);
    } catch (error) {
      console.warn(`⚠️ MySQL Connection Failed (${error.message}). Switching natively to SQLite database...`);
      isUsingSQLite = true;
      const sqliteInstance = new Sequelize({
        dialect: 'sqlite',
        storage: sqlitePath,
        logging: false,
      });

      Object.assign(sequelize, sqliteInstance);
      await sqliteInstance.authenticate();
      console.log(`✅ SQLite Fallback Database Connected Successfully!`);
    }
  } else {
    try {
      await sequelize.authenticate();
      console.log(`✅ SQLite Database Connected Successfully!`);
    } catch (sqliteErr) {
      console.error(`SQLite Error: ${sqliteErr.message}`);
    }
  }

  try {
    const { syncModels, autoSeedIfEmpty } = require('../models');
    await syncModels();
    if (autoSeedIfEmpty) {
      await autoSeedIfEmpty();
    }
  } catch (err) {
    console.error('Error during DB sync or seed:', err.message);
  }
};

module.exports = { sequelize, connectDB };



