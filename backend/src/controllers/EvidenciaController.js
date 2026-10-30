const Evidencia = require('../models/Evidencia');
const Caso = require('../models/Caso');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const subirEvidencia = async (req, res) => {
    try {
        const casoId = req.params.casoId;

        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        }

        const caso = await Caso.findByPk(casoId);
        if (!caso) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        // --- CÁLCULO DE HASHES FORENSES (MD5 + SHA-256) ---
        const fileBuffer = fs.readFileSync(req.file.path);
        
        const hashMd5 = crypto.createHash('md5');
        hashMd5.update(fileBuffer);
        const calcMd5 = hashMd5.digest('hex');

        const hashSha256 = crypto.createHash('sha256');
        hashSha256.update(fileBuffer);
        const calcSha256 = hashSha256.digest('hex');
        // --------------------------------------------------

        // Guardamos en la base de datos
        const nuevaEvidencia = await Evidencia.create({
            descripcion: req.body.descripcion || 'Evidencia sin descripción',
            nombre_archivo: req.file.originalname,
            ruta_archivo: req.file.filename,
            hash_md5: calcMd5,
            hash_sha256: calcSha256,
            caso_id: casoId,
            perito_id: req.usuario.id // Registra automáticamente al perito autenticado
        });

        res.status(201).json({
            mensaje: 'Evidencia procesada con estándar forense',
            hashes: {
                md5: calcMd5,
                sha256: calcSha256
            },
            evidencia: nuevaEvidencia
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al subir la evidencia', detalle: error.message });
    }
};

const descargarEvidencia = async (req, res) => {
    try {
        const { evidenciaId } = req.params;
        const evidencia = await Evidencia.findByPk(evidenciaId);
        
        if (!evidencia) {
            console.log("❌ Descarga fallida: ID de evidencia no existe en la BD.");
            return res.status(404).json({ error: 'Evidencia no encontrada' });
        }

        // 1. Probamos buscar en la carpeta uploads raíz
        const rutaPrincipal = path.join(__dirname, '../uploads', evidencia.ruta_archivo);
        
        // 2. Probamos buscar en la subcarpeta (por si multer lo está guardando ahí)
        const rutaAlternativa = path.join(__dirname, '../../uploads/evidencias', evidencia.ruta_archivo);
        
        console.log("🔍 Intentando descargar archivo...");
        console.log("-> Buscando en:", rutaPrincipal);

        if (fs.existsSync(rutaPrincipal)) {
            console.log("✅ ¡Archivo encontrado en ruta principal! Descargando...");
            return res.download(rutaPrincipal, evidencia.nombre_archivo);
        } 
        
        console.log("-> Buscando en:", rutaAlternativa);
        
        if (fs.existsSync(rutaAlternativa)) {
            console.log("✅ ¡Archivo encontrado en ruta alternativa! Descargando...");
            return res.download(rutaAlternativa, evidencia.nombre_archivo);
        }

        // Si no está en ninguna de las dos carpetas, mandamos el 404
        console.log("❌ ERROR 404: El archivo físico desapareció o la ruta de Multer es distinta.");
        return res.status(404).json({ error: 'El archivo físico no se encuentra en el servidor' });

    } catch (error) {
        console.error("Error al descargar:", error);
        res.status(500).json({ error: 'Error al descargar', detalle: error.message });
    }
};

const listarEvidencias = async (req, res) => {
    try {
        const casoId = req.params.casoId;
        const evidencias = await Evidencia.findAll({ where: { caso_id: casoId } });
        res.json(evidencias);
    } catch (error) {
        console.error("Error al listar evidencias:", error);
        res.status(500).json({ error: 'Error al obtener las evidencias' });
    }
};

module.exports = { subirEvidencia, descargarEvidencia, listarEvidencias };