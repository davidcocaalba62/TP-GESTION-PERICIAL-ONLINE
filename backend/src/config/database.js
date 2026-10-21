const { Sequelize } = require('sequelize');

// Creamos la conexión usando las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Para mantener la consola limpia
  }
);

module.exports = { sequelize };