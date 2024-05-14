const multer = require('multer');
const path = require('path');

// Configuração do Multer para o upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/pictures/carrossel');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.originalname); // Salva com o nome original do arquivo
  },
});

const upload = multer({ storage: storage });

module.exports = upload

