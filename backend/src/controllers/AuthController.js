const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Librería para generar el token

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validamos que envíe email y contraseña
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        // 2. Buscamos al usuario en la base de datos
        const usuario = await Usuario.findOne({ where: { email } });
        
        // Si no existe, devolvemos error 401
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Verificamos que la cuenta no esté desactivada
        if (!usuario.activo) {
            return res.status(403).json({ error: 'Cuenta desactivada. Contacte al administrador.' });
        }

        // 4. Comparamos la contraseña ingresada con el hash guardado
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 5. Generamos el Token JWT con los datos del usuario
        // Este token durará 8 horas, como especifica tu diseño
        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email, 
                rol: usuario.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // 6. Devolvemos el token al frontend
        res.status(200).json({
            mensaje: 'Login exitoso',
            token: token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
    }
};

module.exports = {
    login
};