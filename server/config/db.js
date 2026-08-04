const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || '127.0.0.1';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASS || '';
const database = process.env.DB_NAME || 'ecommerce_platform';
const port = parseInt(process.env.DB_PORT || '3306', 10);

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'mysql',
  logging: false, // Set to console.log if SQL query logging is desired
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    // 1. Ensure the database exists on the MySQL server
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // 2. Authenticate Sequelize connection
    await sequelize.authenticate();
    console.log(`MySQL Database Connected Successfully: ${host}:${port}/${database}`);

    // 3. Sync models with database
    const { syncModels } = require('../models');
    await syncModels();
  } catch (error) {
    console.error(`MySQL Connection Error: ${error.message}`);
    console.warn('Ensure MySQL Server is running and credentials in .env are correct.');
  }
};

module.exports = { sequelize, connectDB };
