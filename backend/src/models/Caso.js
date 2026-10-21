const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Caso = sequelize.define('Caso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_expediente: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true }
  },
  tipo_peritaje: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM(
      'Recibido', 'En análisis', 'Informe redactado', 'Presentado', 'Cerrado'
    ),
    defaultValue: 'Recibido',
    allowNull: false
  },
  fecha_recepcion: { type: DataTypes.DATEONLY, allowNull: false },
  fecha_vencimiento: { type: DataTypes.DATEONLY, allowNull: true },
  fecha_cierre: { type: DataTypes.DATEONLY, allowNull: true },
  observaciones_cierre: { type: DataTypes.TEXT, allowNull: true },
  perito_senior_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  perito_junior_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'casos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Caso;