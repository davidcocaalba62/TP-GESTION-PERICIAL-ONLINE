const Parte = require('../models/Parte');
const Caso = require('../models/Caso');

// Función para agregar una parte a un expediente específico
const crearParte = async (req, res) => {
    try {
        const casoId = req.params.casoId; // Sacamos el ID del caso desde la URL
        const datosParte = req.body;

        // 1. Validamos que el caso realmente exista antes de agregarle partes
        const caso = await Caso.findByPk(casoId);
        if (!caso) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        // 2. Le agregamos el ID del caso a los datos de la parte y la guardamos
        const nuevaParte = await Parte.create({
            ...datosParte,
            caso_id: casoId 
        });

        res.status(201).json(nuevaParte);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar la parte', detalle: error.message });
    }
};

// Función para listar las partes de un expediente
const listarPartesPorCaso = async (req, res) => {
    try {
        const casoId = req.params.casoId;
        const partes = await Parte.findAll({ where: { caso_id: casoId } });
        res.status(200).json(partes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las partes' });
    }
};

module.exports = {
    crearParte,
    listarPartesPorCaso
};