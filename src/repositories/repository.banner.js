import { query } from "../database/sqlite.js";

async function Listar() {
  const sql = "select * from banner order by ordem";
  const banners = await query(sql, []);

  return banners;
}

export default { Listar };
