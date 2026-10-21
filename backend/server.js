require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./src/config/database');

// Importamos el modelo y las rutas
require('./src/models/Usuario');
require('./src/models/Caso');
require('./src/models/Parte');
const casoRoutes = require('./src/routes/casoRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// 1. PRIMERO: Los traductores y seguridad (Middlewares)
app.use(helmet());
app.use(cors());
app.use(express.json()); // Esta línea es la que lee el JSON de Thunder Client

// 2. SEGUNDO: Las rutas (Puertas de entrada)
app.use('/api/casos', casoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// 3. TERCERO: Probar conexión e iniciar servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL exitosa.');
    return sequelize.sync({ alter: true }); 
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });