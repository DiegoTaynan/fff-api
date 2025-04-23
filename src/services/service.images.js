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
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME is not defined in environment variables.");
  }

  if (!file) {
    throw new Error("Nenhum arquivo enviado.");
  }

  const fileName = `appointments/${id_appointment}/${Date.now()}_${
    file.originalname
  }`;
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
    throw error;
  }
}

async function ListImages(id_appointment) {
  return await repositoryImages.GetImagesByAppointment(id_appointment);
}

async function DeleteImage(id_appointment, id_image) {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME is not defined in environment variables.");
  }

  const image = await repositoryImages.GetImageById(id_image, id_appointment);

  if (!image) {
    throw new Error(
      `Imagem não encontrada no banco de dados. Verifique se id_image (${id_image}) e id_appointment (${id_appointment}) estão corretos.`
    );
  }

  const bucketUrlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
  const key = image.image_url.replace(bucketUrlPrefix, "");

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
  } catch (error) {
    throw error;
  }

  try {
    await repositoryImages.DeleteImage(id_image, id_appointment);
  } catch (error) {
    throw error;
  }
}

export default {
  UploadImage,
  ListImages,
  DeleteImage,
};
