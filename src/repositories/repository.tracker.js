import { query } from "../database/sqlite.js";

async function Listar(id_user) {
  console.log("Repository: Fetching trackers for user:", id_user); // 🔥 Log para depuração

  const sql = `
    SELECT 
      t.*, 
      s.service, 
      s.icons,
      a.booking_date, 
      a.booking_hour, 
      a.observations, 
      a.progress
    FROM service_tracker t
    JOIN services s ON s.id_service = t.id_service
    LEFT JOIN appointments a ON a.id_appointment = t.id_appointment
    WHERE t.id_user = ?
    ORDER BY t.id_service_tracker DESC
  `;

  const tracker = await query(sql, [id_user]);

  console.log("Repository: Trackers fetched:", tracker); // 🔥 Log para verificar os dados retornados pela consulta
  return tracker;
}

export default { Listar };
