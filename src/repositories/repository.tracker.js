import { query } from "../database/sqlite.js";

async function Listar() {
  const sql = `select t.*, s.service, s.icons
  from service_tracker t
  join services s on (s.id_service = t.id_service)
  order by t.id_service_tracker desc`;
  const tracker = await query(sql, []);

  return tracker;
}

export default { Listar };
