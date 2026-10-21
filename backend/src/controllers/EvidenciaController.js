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
            nombre_archivo: req.file.originalname,
            ruta_archivo: req.file.filename,
            hash_md5: calcMd5,
            hash_sha256: calcSha256, // Guardamos el nuevo hash
            caso_id: casoId
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
            return res.status(404).json({ error: 'Evidencia no encontrada' });
        }

        const rutaCompleta = path.join(__dirname, '../../uploads', evidencia.ruta_archivo);
        
        if (!fs.existsSync(rutaCompleta)) {
            return res.status(404).json({ error: 'El archivo físico no se encuentra en el servidor' });
        }

        res.download(rutaCompleta, evidencia.nombre_archivo);
    } catch (error) {
        res.status(500).json({ error: 'Error al descargar', detalle: error.message });
    }
};

module.exports = { subirEvidencia, descargarEvidencia };