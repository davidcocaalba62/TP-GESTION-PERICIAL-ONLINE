const Evidencia = require('../models/Evidencia');
const Caso = require('../models/Caso');

const subirEvidencia = async (req, res) => {
    try {
        const casoId = req.params.casoId;

        // Validamos que realmente haya llegado un archivo
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        }

        // Validamos que el caso exista
        const caso = await Caso.findByPk(casoId);
        if (!caso) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        // Guardamos el registro en la base de datos
        const nuevaEvidencia = await Evidencia.create({
            nombre_archivo: req.file.originalname,
            ruta_archivo: req.file.filename,
            caso_id: casoId
        });

        res.status(201).json({
            mensaje: 'Archivo adjuntado correctamente',
            evidencia: nuevaEvidencia
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al subir la evidencia', detalle: error.message });
    }
};

module.exports = {
    subirEvidencia
};