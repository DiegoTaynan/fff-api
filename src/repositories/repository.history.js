import { query } from "../database/sqlite.js";

async function Listar(service_tracker) {
  const sql = `
    SELECT h.*, 
           s.service, 
           s.icons
    FROM history h
    JOIN service_tracker t ON t.id_service_tracker = h.id_service_tracker
    JOIN services s ON s.id_service = t.id_service
    ${service_tracker ? "WHERE t.id_service_tracker = ?" : ""}
    ORDER BY h.id_history DESC`;

  const params = service_tracker ? [service_tracker] : [];
  const history = await query(sql, params);

  return history;
}

export default { Listar };
