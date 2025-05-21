import "dotenv/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import repositoryImages from "../repositories/repository.images.js";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function UploadImage(id_appointment, file) {
  if (!id_appointment) {
    throw new Error("O parâmetro 'id_appointment' é obrigatório.");
  }

  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME não está definido nas variáveis de ambiente.");
  }

  if (!file) {
    throw new Error("Nenhum arquivo enviado para upload.");
  }

  const fileName = `appointments/${id_appointment}/${Date.now()}_${file.originalname}`;
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const response = await s3.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    await repositoryImages.SaveImage(id_appointment, imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw new Error("Erro ao fazer upload da imagem para o bucket S3.");
  }
}

async function ListImages(id_appointment) {
  if (!id_appointment) {
    throw new Error("O parâmetro 'id_appointment' é obrigatório.");
  }

  try {
    return await repositoryImages.GetImagesByAppointment(id_appointment);
  } catch (error) {
    console.error("Erro ao listar imagens:", error);
    throw new Error("Erro ao listar imagens do banco de dados.");
  }
}

async function DeleteImage(id_appointment, id_image) {
  if (!id_appointment || !id_image) {
    throw new Error("Os parâmetros 'id_appointment' e 'id_image' são obrigatórios.");
  }

  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME não está definido nas variáveis de ambiente.");
  }

  try {
    const image = await repositoryImages.GetImageById(id_image, id_appointment);

    if (!image) {
      throw new Error(
        `Imagem não encontrada no banco de dados. Verifique se 'id_image' (${id_image}) e 'id_appointment' (${id_appointment}) estão corretos.`
      );
    }

    const bucketUrlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const key = image.image_url.replace(bucketUrlPrefix, "");

    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
    await repositoryImages.DeleteImage(id_image, id_appointment);
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    throw new Error("Erro ao deletar imagem do bucket S3 ou do banco de dados.");
  }
}

export default {
  UploadImage,
  ListImages,
  DeleteImage,
};
