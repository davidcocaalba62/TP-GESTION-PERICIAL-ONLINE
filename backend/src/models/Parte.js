const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Caso = require('./Caso'); // Importamos Caso para la relación

const Parte = sequelize.define('Parte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_parte: {
    type: DataTypes.ENUM('solicitante', 'demandante', 'demandado', 'organismo_judicial', 'otro'),
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  caso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'casos', key: 'id' }
  }
}, {
  tableName: 'partes',
  timestamps: false // Tu diagrama no especifica fechas para las partes
});

// Definimos la relación: Un Caso tiene muchas Partes
Caso.hasMany(Parte, { foreignKey: 'caso_id' });
Parte.belongsTo(Caso, { foreignKey: 'caso_id' });

module.exports = Parte;