import "dotenv/config";
import repositoryBanners from "../repositories/repository.banners.js";

async function ListBanners() {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME is not defined in environment variables.");
  }

  const banners = await repositoryBanners.GetAllBanners();

  return banners.map((banner) => ({
    id_banner: banner.id_banner,
    ordem: banner.ordem,
    imagePath: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${banner.image_key}`,
  }));
}

export default { ListBanners };
