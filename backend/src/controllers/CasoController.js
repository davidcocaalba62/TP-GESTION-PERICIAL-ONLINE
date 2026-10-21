const Caso = require('../models/Caso');

// Función para obtener todos los casos (expedientes)
const listarCasos = async (req, res) => {
    try {
        const casos = await Caso.findAll();
        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los expedientes' });
    }
};

// Función para crear un nuevo caso (expediente)
const crearCaso = async (req, res) => {
    try {
        const nuevoCaso = await Caso.create(req.body);
        res.status(201).json(nuevoCaso);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el expediente', detalle: error.message });
    }
};

module.exports = {
    listarCasos,
    crearCaso
};