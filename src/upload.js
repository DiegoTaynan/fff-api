import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function uploadImage(file) {
  // Log all relevant environment variables for debugging
  console.log("Environment Variables:");
  console.log("AWS_REGION:", process.env.AWS_REGION);
  console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);

  if (!process.env.AWS_BUCKET_NAME) {
    console.error("AWS_BUCKET_NAME is not defined in environment variables.");
    throw new Error("AWS_BUCKET_NAME is not defined in environment variables.");
  }

  console.log("Using bucket:", process.env.AWS_BUCKET_NAME); // Debugging log
  console.log("File details:", {
    filename: file.filename,
    mimetype: file.mimetype,
    content: file.content ? "Content exists" : "No content",
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Ensure this is set
    Key: file.filename,
    Body: file.content,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    console.log("Upload successful:", response);
    return response;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
}
