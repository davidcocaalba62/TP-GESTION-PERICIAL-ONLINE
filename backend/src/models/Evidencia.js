const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Caso = require('./Caso');

const Evidencia = sequelize.define('Evidencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  // --- AGREGAMOS EL ESTÁNDAR SHA-256 ---
  hash_sha256: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  // ------------------------------------
  caso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'casos', key: 'id' }
  }
}, {
  tableName: 'evidencias',
  timestamps: true,
  createdAt: 'fecha_subida',
  updatedAt: false
});

Caso.hasMany(Evidencia, { foreignKey: 'caso_id' });
Evidencia.belongsTo(Caso, { foreignKey: 'caso_id' });

module.exports = Evidencia;