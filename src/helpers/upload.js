const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Defina o caminho para a pasta uploads
const uploadsDir = path.join(__dirname, '../uploads');

// Verifique se a pasta uploads existe, se não, crie a pasta
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Defina o destino do upload e o nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extensão do arquivo
    cb(null, Date.now() + ext); // Nome do arquivo com timestamp
  },
});

// Verifique se o arquivo é uma imagem (jpeg, png, gif)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb('Erro: Somente imagens são permitidas');
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de tamanho de arquivo: 10MB
  fileFilter,
});

module.exports = upload;
