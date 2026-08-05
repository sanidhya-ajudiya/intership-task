const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQLURL;
const host = process.env.DB_HOST || '127.0.0.1';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASS || '';
const database = process.env.DB_NAME || 'ecommerce_platform';
const port = parseInt(process.env.DB_PORT || '3306', 10);

const sslConfig = process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true' || (dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')) ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {};

let sequelize;
let isDbConnected = false;

if (dbUrl) {
  sequelize = new Sequelize(dbUrl, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: sslConfig,
    pool: { max: 10, min: 0, acquire: 10000, idle: 5000 },
  });
} else {
  sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: sslConfig,
    pool: { max: 10, min: 0, acquire: 10000, idle: 5000 },
  });
}

const connectDB = async () => {
  try {
    if (!dbUrl && host && host !== 'your_mysql_host') {
      try {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
      } catch (e) {}
    }

    await sequelize.authenticate();
    console.log(`✅ MySQL Database Connected Successfully!`);
    isDbConnected = true;

    const { syncModels, autoSeedIfEmpty } = require('../models');
    await syncModels();
    if (autoSeedIfEmpty) {
      await autoSeedIfEmpty();
    }
  } catch (error) {
    console.warn(`⚠️ MySQL Database Connection Failed (${error.message}). Application serving fallback data smoothly.`);
    isDbConnected = false;
  }
};

const getIsDbConnected = () => isDbConnected;

module.exports = { sequelize, connectDB, getIsDbConnected };





