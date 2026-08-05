const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQLURL;

let sequelize;

const sslConfig = process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true' || (dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')) ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {};

if (dbUrl) {
  sequelize = new Sequelize(dbUrl, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: sslConfig,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  const host = process.env.DB_HOST || '127.0.0.1';
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
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

const connectDB = async () => {
  try {
    if (!dbUrl) {
      const host = process.env.DB_HOST || '127.0.0.1';
      const user = process.env.DB_USER || 'root';
      const password = process.env.DB_PASS || '';
      const database = process.env.DB_NAME || 'ecommerce_platform';
      const port = parseInt(process.env.DB_PORT || '3306', 10);

      // 1. Ensure the database exists on local MySQL server if not using connection URI
      try {
        const connection = await mysql.createConnection({
          host,
          port,
          user,
          password,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
      } catch (err) {
        console.warn(`Could not execute CREATE DATABASE query directly: ${err.message}`);
      }
    }

    // 2. Authenticate Sequelize connection
    await sequelize.authenticate();
    console.log(`MySQL Database Connected Successfully!`);

    // 3. Sync models with database
    const { syncModels, autoSeedIfEmpty } = require('../models');
    await syncModels();
    
    if (autoSeedIfEmpty) {
      await autoSeedIfEmpty();
    }
  } catch (error) {
    console.error(`MySQL Connection Error: ${error.message}`);
    console.warn('Ensure your MySQL Database credentials (DB_HOST / DATABASE_URL) in Render Environment Variables are set correctly.');
  }
};

module.exports = { sequelize, connectDB };

