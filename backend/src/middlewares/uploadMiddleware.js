const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Definimos dónde se van a guardar los archivos
const uploadDir = path.join(__dirname, '../uploads');

// Si la carpeta "uploads" no existe, le decimos a Node que la cree automáticamente
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Configuramos cómo se van a guardar y nombrar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Los mandamos a la carpeta uploads
    },
    filename: function (req, file, cb) {
        // Le agregamos la fecha exacta por delante para que el nombre sea único en el sistema
        const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, sufijoUnico + '-' + file.originalname);
    }
});

// 3. Creamos el "guardia" que va a procesar la subida
const upload = multer({ storage: storage });

module.exports = upload;