import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { db, query } from "../database/sqlite.js";
import dotenv from "dotenv";

// Fallback para carregar o .env caso não tenha sido carregado
if (!process.env.AWS_REGION) {
  console.log("Fallback: carregando .env no controller.images.js...");
  dotenv.config();
}

console.log("Carregando variáveis de ambiente no controller.images.js...");
console.log("AWS_REGION:", process.env.AWS_REGION);
console.log(
  "AWS_ACCESS_KEY_ID:",
  process.env.AWS_ACCESS_KEY_ID ? "OK" : "MISSING"
);
console.log(
  "AWS_SECRET_ACCESS_KEY:",
  process.env.AWS_SECRET_ACCESS_KEY ? "OK" : "MISSING"
);
console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);

if (
  !process.env.AWS_REGION ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_BUCKET_NAME
) {
  throw new Error("Missing required AWS environment variables.");
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

const controllerImages = {
  async Upload(req, res) {
    const { id_appointment } = req.params;
    const file = req.file;

    console.log("Recebendo requisição de upload...");
    console.log("Parâmetro id_appointment:", id_appointment);
    console.log("Arquivo recebido:", file);

    if (!file) {
      console.error("Nenhum arquivo foi enviado.");
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const fileName = `appointments/${id_appointment}/${Date.now()}_${
      file.originalname
    }`;

    try {
      console.log("Iniciando upload para o S3...");
      const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const s3Response = await s3.send(new PutObjectCommand(uploadParams));
      console.log("Upload para o S3 concluído:", s3Response);

      const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      console.log("URL da imagem gerada:", imageUrl);

      const dbResponse = await query(
        "INSERT INTO appointment_images (id_appointment, image_url) VALUES (?, ?)",
        [id_appointment, imageUrl]
      );
      console.log("URL da imagem salva no banco de dados:", dbResponse);

      res
        .status(201)
        .json({ message: "Imagem enviada com sucesso!", imageUrl });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      res.status(500).json({ error: "Erro ao fazer upload da imagem." });
    }
  },

  async List(req, res) {
    const { id_appointment } = req.params;

    try {
      const images = await query(
        "SELECT * FROM appointment_images WHERE id_appointment = ?",
        [id_appointment]
      );
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar imagens." });
    }
  },

  async Delete(req, res) {
    const { id_appointment, id_image } = req.params;

    try {
      console.log("Iniciando processo de exclusão de imagem...");
      console.log("Parâmetros recebidos:", { id_appointment, id_image });

      // Buscar a URL da imagem no banco
      const image = await query(
        "SELECT * FROM appointment_images WHERE id_image = ? AND id_appointment = ?",
        [id_image, id_appointment],
        "get"
      );

      if (!image) {
        console.error("Imagem não encontrada no banco de dados.");
        return res.status(404).json({ error: "Imagem não encontrada." });
      }

      console.log("Imagem encontrada no banco de dados:", image);

      // Deletar do S3
      const bucketUrlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
      if (!image.image_url.startsWith(bucketUrlPrefix)) {
        console.error(
          "URL da imagem não corresponde ao bucket configurado:",
          image.image_url
        );
        return res
          .status(500)
          .json({ error: "Erro ao processar a URL da imagem." });
      }

      const key = image.image_url.replace(bucketUrlPrefix, "");
      console.log("Chave do S3 extraída:", key);

      const deleteParams = {
        Bucket: bucketName,
        Key: key,
      };

      try {
        const s3Response = await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("Imagem deletada do S3 com sucesso:", s3Response);
      } catch (s3Error) {
        console.error("Erro ao deletar imagem do S3:", s3Error);
        return res.status(500).json({ error: "Erro ao deletar imagem do S3." });
      }

      // Deletar do banco de dados
      const dbResponse = await query(
        "DELETE FROM appointment_images WHERE id_image = ? AND id_appointment = ?",
        [id_image, id_appointment]
      );
      console.log("Imagem deletada do banco de dados com sucesso:", dbResponse);

      res.status(200).json({ message: "Imagem deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      res.status(500).json({ error: "Erro ao deletar imagem." });
    }
  },
};

export default controllerImages;
