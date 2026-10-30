const jwt = require('jsonwebtoken');

// Verifica que el usuario tenga un token válido y asegura la trazabilidad para auditoría
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
        
        // Inyectamos en ambas variables para máxima compatibilidad en todo el backend
        req.usuario = payload;
        req.user = payload; 

        // Normalización defensiva: si el token usa 'userId' en lugar de 'id', lo unificamos
        if (!req.usuario.id && req.usuario.userId) {
            req.usuario.id = req.usuario.userId;
            req.user.id = req.usuario.userId;
        }

        next(); // Dejamos pasar al perito autenticado a la ruta
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

// Verifica que el rol sea administrador
const soloAdmin = (req, res, next) => {
    if (req.usuario?.rol !== 'administrador') {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol administrador' });
    }
    next();
};

// Verifica que el rol sea administrador o perito senior
const adminOSenior = (req, res, next) => {
    const rolesPermitidos = ['administrador', 'perito_senior'];
    if (!rolesPermitidos.includes(req.usuario?.rol)) {
        return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }
    next();
};

module.exports = { verificarToken, soloAdmin, adminOSenior };