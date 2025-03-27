import { query } from "../database/sqlite.js";

async function Listar(service_tracker) {
  const sql = `    select h.*, 
    s.service, 
    s.icons
from history h
join service_tracker t on t.id_service_tracker = h.id_service_tracker
join services s on s.id_service = t.id_service
order by h.id_history desc`;

  const history = await query(sql, [service_tracker]);

  history;

  return history;
}

export default { Listar };
