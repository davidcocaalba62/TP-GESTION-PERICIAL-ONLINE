const jwt = require('jsonwebtoken');

// Verifica que el usuario tenga un token válido
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // El token suele venir como "Bearer eyJhb..." por lo que lo separamos
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticación requerido' });
    }

    try {
        // Desencriptamos el token con nuestra clave secreta
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload; // Guardamos los datos del usuario en la petición
        next(); // Dejamos pasar al usuario a la ruta
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

// Verifica que el rol sea administrador
const soloAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'administrador') {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol administrador' });
    }
    next();
};

// Verifica que el rol sea administrador o perito senior
const adminOSenior = (req, res, next) => {
    const rolesPermitidos = ['administrador', 'perito_senior'];
    if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }
    next();
};

module.exports = { verificarToken, soloAdmin, adminOSenior };