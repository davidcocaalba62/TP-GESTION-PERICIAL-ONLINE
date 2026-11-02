const Caso = require('../models/Caso');

const listarCasos = async (req, res) => {
    try {
        const casos = await Caso.findAll();
        res.json(casos);
    } catch (error) {
        console.error("Error al listar casos:", error);
        res.status(500).json({ error: 'Error al obtener los expedientes' });
    }
};

const crearCaso = async (req, res) => {
    try {
        console.log("Payload completo recibido en crearCaso:", req.body);

        // Obtenemos el ID del usuario logueado por si acaso de respaldo
        const peritoLogueadoId = req.usuario?.id || req.usuario?.userId || req.usuario?.sub || req.usuario?.usuarioId;

        const casoData = {
            numero_expediente: req.body.numero_expediente,
            tipo_peritaje: req.body.tipo_peritaje,
            estado: req.body.estado || 'Recibido',
            fecha_recepcion: req.body.fecha_recepcion || new Date().toISOString().split('T')[0],
            fecha_vencimiento: req.body.fecha_vencimiento || null,
            // Asignamos el Senior que seleccionó en el selector, o el logueado como respaldo
            perito_senior_id: req.body.perito_senior_id ? Number(req.body.perito_senior_id) : peritoLogueadoId,
            // Capturamos y guardamos el Perito Junior correctamente
            perito_junior_id: req.body.perito_junior_id ? Number(req.body.perito_junior_id) : null
        };

        const nuevoCaso = await Caso.create(casoData);
        res.status(201).json(nuevoCaso);
    } catch (error) {
        console.error("Error al crear caso en backend:", error);
        res.status(400).json({ error: 'Error al registrar el expediente', detalle: error.message });
    }
};

const actualizarEstadoCaso = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, observaciones_cierre } = req.body;

        const caso = await Caso.findByPk(id);
        if (!caso) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        // Actualizamos los campos permitidos
        caso.estado = estado || caso.estado;
        if (observaciones_cierre !== undefined) {
            caso.observaciones_cierre = observaciones_cierre;
        }

        await caso.save();

        res.json({
            mensaje: 'Expediente actualizado con éxito',
            caso
        });
    } catch (error) {
        console.error('Error al actualizar el expediente:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del caso', detalle: error.message });
    }
};

module.exports = {
    listarCasos,
    crearCaso,
    actualizarEstadoCaso
};