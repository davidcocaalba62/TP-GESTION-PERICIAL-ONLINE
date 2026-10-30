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
        // Imprimimos en la consola del backend para salir de dudas definitivamente
        console.log("Payload completo del token en req.usuario:", req.usuario);

        // Buscamos el ID en todas las variantes posibles (id, userId, sub, usuarioId)
        const peritoId = req.usuario?.id || req.usuario?.userId || req.usuario?.sub || req.usuario?.usuarioId;

        if (!peritoId) {
            return res.status(400).json({ 
                error: 'Error de autenticación', 
                detalle: 'El token de acceso no contiene un identificador de usuario válido. Por favor, volvé a iniciar sesión.' 
            });
        }

        const casoData = {
            numero_expediente: req.body.numero_expediente,
            tipo_peritaje: req.body.tipo_peritaje,
            estado: req.body.estado || 'Recibido',
            fecha_recepcion: req.body.fecha_recepcion || new Date().toISOString().split('T')[0],
            fecha_vencimiento: req.body.fecha_vencimiento || null,
            perito_senior_id: peritoId // Asignación segura del ID del perito autenticado
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
    actualizarEstadoCaso // <-- FALTABA AGREGAR ESTA LÍNEA ACÁ
};