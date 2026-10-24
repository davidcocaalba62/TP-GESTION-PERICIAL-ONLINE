const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Evidencia = sequelize.define('Evidencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  nombre_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ruta_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  hash_md5: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  hash_sha256: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  caso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'casos', key: 'id' }
  },
  perito_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' }
  }
}, {
  tableName: 'evidencias',
  timestamps: true,
  createdAt: 'fecha_subida',
  updatedAt: false
});

module.exports = Evidencia;