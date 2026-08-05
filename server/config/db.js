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

const createSequelizeInstance = () => {
  if (dbUrl) {
    return new Sequelize(dbUrl, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: sslConfig,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    });
  } else {
    const host = process.env.DB_HOST || '127.0.0.1';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASS || '';
    const database = process.env.DB_NAME || 'ecommerce_platform';
    const port = parseInt(process.env.DB_PORT || '3306', 10);

    return new Sequelize(database, user, password, {
      host,
      port,
      dialect: 'mysql',
      logging: false,
      dialectOptions: sslConfig,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    });
  }
};

sequelize = createSequelizeInstance();

const connectDB = async () => {
  let connected = false;

  try {
    if (!dbUrl) {
      const host = process.env.DB_HOST || '127.0.0.1';
      const user = process.env.DB_USER || 'root';
      const password = process.env.DB_PASS || '';
      const database = process.env.DB_NAME || 'ecommerce_platform';
      const port = parseInt(process.env.DB_PORT || '3306', 10);

      try {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
      } catch (err) {
        // MySQL creation failed or host unreachable
      }
    }

    await sequelize.authenticate();
    console.log(`✅ MySQL Database Connected Successfully!`);
    connected = true;
  } catch (error) {
    console.warn(`⚠️ MySQL Connection Failed (${error.message}). Falling back to SQLite database for seamless execution...`);
  }

  if (!connected) {
    try {
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

      // Update sequelize reference properties and methods to point to sqliteInstance
      Object.assign(sequelize, sqliteInstance);
      sequelize.dialect = sqliteInstance.dialect;
      sequelize.query = sqliteInstance.query.bind(sqliteInstance);
      sequelize.sync = sqliteInstance.sync.bind(sqliteInstance);
      sequelize.authenticate = sqliteInstance.authenticate.bind(sqliteInstance);

      // Re-bind models to sqliteInstance
      Object.keys(sequelize.models || {}).forEach((modelName) => {
        sequelize.models[modelName].sequelize = sqliteInstance;
      });

      await sqliteInstance.authenticate();
      console.log(`✅ SQLite Fallback Database Connected Successfully!`);
    } catch (sqliteErr) {
      console.error(`SQLite Fallback Error: ${sqliteErr.message}`);
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


