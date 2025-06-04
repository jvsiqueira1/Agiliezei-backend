const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Defina o caminho para a pasta uploads
const CAMINHO_PARA_SALVAR_UPLOADS = '/uploads';
const uploadsDir = path.join(__dirname, '../uploads');

// Defina o destino do upload e o nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Os arquivos serão salvos diretamente na raiz do disco, que é /uploads
    cb(null, CAMINHO_PARA_SALVAR_UPLOADS);
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
  // Melhoria: É uma boa prática passar um objeto Error para o callback do Multer.
  cb(new Error('Erro: Somente imagens (jpeg, jpg, png, gif) são permitidas!'));
};

const upload = multer({
  storage, // Utiliza a configuração de armazenamento definida acima
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de tamanho de arquivo: 10MB
  fileFilter, // Utiliza o filtro de arquivo definido acima
});

module.exports = upload;
