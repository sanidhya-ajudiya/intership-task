const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQLURL;

const sslConfig = process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true' || (dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')) ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {};

let sequelize;

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

const switchToSQLiteFallback = async () => {
  console.warn('⚠️  MySQL is not reachable. Falling back to SQLite database (server/data/database.sqlite)...');
  
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const sqlitePath = path.join(dataDir, 'database.sqlite');

  const sqliteInstance = new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: false,
  });

  // Re-bind models to SQLite instance
  Object.keys(sequelize.models).forEach((modelName) => {
    const model = sequelize.models[modelName];
    sqliteInstance.define(modelName, model.rawAttributes, model.options);
  });

  Object.assign(sequelize, sqliteInstance);
  sequelize.dialect = sqliteInstance.dialect;
  sequelize.query = sqliteInstance.query.bind(sqliteInstance);
  sequelize.sync = sqliteInstance.sync.bind(sqliteInstance);
  sequelize.authenticate = sqliteInstance.authenticate.bind(sqliteInstance);

  Object.keys(sequelize.models).forEach((modelName) => {
    sequelize.models[modelName].sequelize = sqliteInstance;
  });

  await sqliteInstance.authenticate();
  console.log('✅ SQLite Database Connected & Ready!');
};

const connectDB = async () => {
  try {
    if (!dbUrl) {
      const host = process.env.DB_HOST || '127.0.0.1';
      const user = process.env.DB_USER || 'root';
      const password = process.env.DB_PASS || '';
      const database = process.env.DB_NAME || 'ecommerce_platform';
      const port = parseInt(process.env.DB_PORT || '3306', 10);

      if (host !== 'your_mysql_host') {
        try {
          const connection = await mysql.createConnection({ host, port, user, password });
          await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
          await connection.end();
        } catch (err) {
          // MySQL server might be offline, caught in authenticate below
        }
      }
    }

    await sequelize.authenticate();
    console.log(`✅ MySQL Database Connected Successfully!`);
  } catch (error) {
    console.error(`⚠️ MySQL Connection Failed (${error.message}).`);
    await switchToSQLiteFallback();
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


