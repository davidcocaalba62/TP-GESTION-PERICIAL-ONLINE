const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Función para crear un nuevo usuario (solo para Administradores luego)
const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Validamos que vengan todos los datos
        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validamos que el email no exista ya
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Encriptamos la contraseña (hash)
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Creamos el usuario en la base de datos
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password_hash,
            rol,
            activo: true
        });

        // Devolvemos el usuario sin la contraseña por seguridad
        const usuarioCreado = {
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email,
            rol: nuevoUsuario.rol,
            activo: nuevoUsuario.activo
        };

        res.status(201).json(usuarioCreado);

    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario', detalle: error.message });
    }
};

// Función para listar usuarios
const listarUsuarios = async (req, res) => {
    try {
        // Traemos todos los usuarios, excluyendo el campo password_hash
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

module.exports = {
    crearUsuario,
    listarUsuarios
};