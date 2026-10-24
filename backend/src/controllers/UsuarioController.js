const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Crear usuario (Alta de perito)
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    
    // Validar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado en el sistema.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password_hash: hashedPassword, 
      rol: rol || 'perito_junior' // Ajustado al enum correcto que arreglamos antes
    });

    res.status(201).json({ 
      mensaje: 'Usuario creado con éxito', 
      usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el usuario en el servidor.' });
  }
};

// Listar usuarios (excluyendo el hash por seguridad)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ 
      attributes: { exclude: ['password_hash'] } // Corregido de password a password_hash
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el listado de usuarios.' });
  }
};

// Resetear / Blanquear contraseña (Acción de Administrador)
exports.resetPassword = async (req, res) => {
  try {
    const { email, nuevaPassword } = req.body;
    
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado en el sistema.' });
    }

    const salt = await bcrypt.genSalt(10);
    usuario.password_hash = await bcrypt.hash(nuevaPassword, salt); // Corregido de password a password_hash
    await usuario.save();

    res.json({ mensaje: 'Contraseña reseteada con éxito. El perito ya puede ingresar con su clave temporal.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor al intentar blanquear la contraseña.' });
  }
};

// Iniciar sesión (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado en el sistema.' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || 'firma_secreta_pericial',
      { expiresIn: '8h' } 
    );

    res.json({
      mensaje: 'Autenticación exitosa',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno al intentar iniciar sesión.' });
  }
};