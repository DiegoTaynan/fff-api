import { query } from "../database/sqlite.js";

async function SaveImage(id_appointment, imageUrl) {
  await query(
    "INSERT INTO appointment_images (id_appointment, image_url) VALUES (?, ?)",
    [id_appointment, imageUrl]
  );
}

async function GetImagesByAppointment(id_appointment) {
  const result = await query(
    "SELECT * FROM appointment_images WHERE id_appointment = ?",
    [id_appointment]
  );
  console.log("GetImagesByAppointment: All images for appointment:", result); // Debugging log
  return result;
}

async function GetImageById(id_image, id_appointment) {
  console.log(
    "GetImageById: id_image:",
    id_image,
    "id_appointment:",
    id_appointment
  );
  const result = await query(
    "SELECT * FROM appointment_images WHERE id_image = ? AND id_appointment = ?",
    [id_image, id_appointment],
    "get"
  );
  console.log("GetImageById: Query result:", result);
  return result;
}

async function DeleteImage(id_image, id_appointment) {
  await query(
    "DELETE FROM appointment_images WHERE id_image = ? AND id_appointment = ?",
    [id_image, id_appointment]
  );
}

export default {
  SaveImage,
  GetImagesByAppointment,
  GetImageById,
  DeleteImage,
};
