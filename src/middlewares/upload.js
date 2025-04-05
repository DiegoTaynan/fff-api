import multer from "multer";

const storage = multer.memoryStorage(); // Armazena o arquivo na memória para envio ao S3
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para o arquivo
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      console.error("Arquivo não é uma imagem:", file.mimetype);
      return cb(new Error("Apenas arquivos de imagem são permitidos."));
    }
    cb(null, true);
  },
});

export default upload;
