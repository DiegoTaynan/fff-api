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
    ORDER BY h.id_history DESC
  `;

  const params = service_tracker ? [service_tracker] : [];
  const history = await query(sql, params);

  return history;
}

async function Criar(historyData) {
  try {
    console.log("📝 Criando histórico com:", historyData);

    const sql = `
      INSERT INTO history (
        id_service_tracker,
        id_user,
        comments,
        dt_start,
        id_appointment,
        observations
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      historyData.id_service_tracker,
      historyData.id_user,
      historyData.comments,
      historyData.dt_start,
      historyData.id_appointment,
      historyData.observations,
    ];

    console.log("🛠 Query:", sql);
    console.log("🧾 Valores:", values);

    await query(sql, values, "run");

    console.log("✅ Histórico criado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao criar histórico:", error.message, error.stack);
    throw error; // NÃO remova isso
  }
}

export default { Listar, Criar };
