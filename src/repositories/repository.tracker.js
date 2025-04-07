import { query } from "../database/sqlite.js";

async function Listar(id_user) {
  const sql = `
    SELECT t.*, 
           s.service, 
           s.icons
    FROM service_tracker t
    JOIN services s ON s.id_service = t.id_service
    WHERE t.id_user = ?
    ORDER BY t.id_service_tracker DESC`;
  const tracker = await query(sql, [id_user]);

  return tracker;
}

export default { Listar };
