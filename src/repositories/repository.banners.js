import { query } from "../database/sqlite.js";

async function GetAllBanners() {
  const sql = "SELECT id_banner, ordem, image_key FROM banner ORDER BY ordem";
  return await query(sql, []);
}

export default { GetAllBanners };
