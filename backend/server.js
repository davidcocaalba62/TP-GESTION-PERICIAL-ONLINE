require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./src/config/database');
const evidenciaRoutes = require('./src/routes/evidenciaRoutes');

// Importamos los modelos
const Usuario = require('./src/models/Usuario');
const Caso = require('./src/models/Caso');
const Parte = require('./src/models/Parte');
const Evidencia = require('./src/models/Evidencia');

// Establecemos las Relaciones
Usuario.hasMany(Caso, { foreignKey: 'usuario_id' });
Caso.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Caso.hasMany(Evidencia, { foreignKey: 'caso_id' });
Evidencia.belongsTo(Caso, { foreignKey: 'caso_id' });

Usuario.hasMany(Evidencia, { foreignKey: 'perito_id' });
Evidencia.belongsTo(Usuario, { foreignKey: 'perito_id' });

// Importamos las rutas
const casoRoutes = require('./src/routes/casoRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
// 1. PRIMERO: Los traductores y seguridad (Middlewares)
app.use(helmet());
app.use(cors());
app.use(express.json());

// 2. SEGUNDO: Las rutas (Puertas de entrada)
app.use('/api/casos', casoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/casos/:casoId/evidencias', evidenciaRoutes);

const PORT = process.env.PORT || 3000;

// 3. TERCERO: Probar conexión e iniciar servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL exitosa.');
    // MODO LIMPIEZA ACTIVO: force true borra y recrea las tablas
    return sequelize.sync({ alter: true }) 
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });