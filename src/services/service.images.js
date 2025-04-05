import "dotenv/config"; // Ensure environment variables are loaded
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

// Log credentials for debugging (DO NOT use in production)
console.log("AWS Credentials:", {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? "Loaded" : "Missing",
});

async function UploadImage(id_appointment, file) {
  const bucketName = process.env.AWS_BUCKET_NAME; // Move inside the function
  if (!bucketName) {
    console.error("AWS_BUCKET_NAME is not defined in environment variables.");
    throw new Error("AWS_BUCKET_NAME is not defined in environment variables.");
  }

  if (!file) {
    console.error("No file provided for upload.");
    throw new Error("Nenhum arquivo enviado.");
  }

  console.log("Uploading to bucket:", bucketName);
  console.log("File details:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

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
    console.log("S3 Upload Response:", response);

    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    await repositoryImages.SaveImage(id_appointment, imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem para o S3:", error);
    throw error;
  }
}

async function ListImages(id_appointment) {
  return await repositoryImages.GetImagesByAppointment(id_appointment);
}

async function DeleteImage(id_appointment, id_image) {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    console.error("AWS_BUCKET_NAME is not defined in environment variables.");
    throw new Error("AWS_BUCKET_NAME is not defined in environment variables.");
  }

  console.log("DeleteImage: id_appointment:", id_appointment);
  console.log("DeleteImage: id_image:", id_image);

  const image = await repositoryImages.GetImageById(id_image, id_appointment);
  console.log("DeleteImage: Retrieved image:", image);

  if (!image) {
    console.error(
      `Imagem não encontrada. id_image: ${id_image}, id_appointment: ${id_appointment}.`
    );
    throw new Error(
      `Imagem não encontrada no banco de dados. Verifique se id_image (${id_image}) e id_appointment (${id_appointment}) estão corretos.`
    );
  }

  const bucketUrlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
  const key = image.image_url.replace(bucketUrlPrefix, "");

  try {
    console.log("DeleteImage: Deleting from S3. Key:", key);
    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
    console.log("DeleteImage: Successfully deleted from S3.");
  } catch (error) {
    console.error("Erro ao deletar imagem do S3:", error);
    throw error;
  }

  try {
    console.log(
      "DeleteImage: Deleting from database. id_image:",
      id_image,
      "id_appointment:",
      id_appointment
    );
    await repositoryImages.DeleteImage(id_image, id_appointment);
    console.log("DeleteImage: Successfully deleted from database.");
  } catch (error) {
    console.error("Erro ao deletar imagem do banco de dados:", error);
    throw error;
  }
}

export default {
  UploadImage,
  ListImages,
  DeleteImage,
};
