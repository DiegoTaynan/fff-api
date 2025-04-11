import { query } from "../database/sqlite.js";

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`
  );
}

async function Criar(service_tracker) {
  const dt_start = formatDateTime(new Date()); // Agora inclui hora corretamente

  const sql = `
    INSERT INTO service_tracker (
      id_user,
      id_service,
      id_appointment,
      dt_start
    ) VALUES (?, ?, ?, ?)
  `;

  const params = [
    service_tracker.id_user,
    service_tracker.id_service,
    service_tracker.id_appointment,
    dt_start,
  ];

  const result = await query(sql, params, "run");

  return {
    id_service_tracker: result.lastID,
    ...service_tracker,
    dt_start,
  };
}

async function Listar(id_user) {
  const sql = `
    SELECT st.*, s.service
    FROM service_tracker st
    JOIN services s ON s.id_service = st.id_service
    WHERE st.id_user = ?
    ORDER BY st.dt_start DESC
  `;
  const result = await query(sql, [id_user]);
  return result;
}

export default { Criar, Listar };
