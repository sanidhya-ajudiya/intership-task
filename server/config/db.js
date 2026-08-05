const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQLURL;
const host = process.env.DB_HOST;

const hasRemoteMySQL = !!(dbUrl || (host && host !== 'your_mysql_host' && host !== '127.0.0.1' && host !== 'localhost'));

const sslConfig = process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true' || (dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')) ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {};

let sequelize;

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const sqlitePath = path.join(dataDir, 'database.sqlite');

if (hasRemoteMySQL) {
  if (dbUrl) {
    sequelize = new Sequelize(dbUrl, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: sslConfig,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    });
  } else {
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
  }
} else {
  // Use SQLite for zero-config execution on cloud hosts (e.g. Render) without remote MySQL credentials
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: false,
  });
}

const connectDB = async () => {
  try {
    if (hasRemoteMySQL && !dbUrl && host) {
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
    console.log(`✅ Database Connected Successfully (${sequelize.getDialect()})!`);
  } catch (error) {
    console.warn(`⚠️ Database Connection Warning: ${error.message}`);
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




