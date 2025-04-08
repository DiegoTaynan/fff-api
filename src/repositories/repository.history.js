import { query } from "../database/sqlite.js";

const iconMapping = {
  air_conditioning_services: "ac_system",
  brake_services: "brake_services",
  oil_changes: "oil_changes",
  battery_services: "battery",
  suspension_repairs: "suspension",
  tire_services: "tire",
  transmission_services: "transmission",
  cooling_system_services: "cooling",
  diagnostics: "diagnostics",
  electrical_system_repairs: "electrical",
  exhaust_system_repairs: "exhaust",
  tune_ups: "tuneup",
  general_maintenance: "general",
};

const formatServiceKey = (service) => {
  return service
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
};

async function Listar(service_tracker) {
  const sql = `
    SELECT h.*, 
           s.service, 
           COALESCE(s.icons, 'general') AS icons,
           t.booking_hour, 
           t.dt_start
    FROM history h
    JOIN service_tracker t ON t.id_service_tracker = h.id_service_tracker
    JOIN services s ON s.id_service = t.id_service
    ${service_tracker ? "WHERE t.id_service_tracker = ?" : ""}
    ORDER BY h.id_history DESC`;

  const params = service_tracker ? [service_tracker] : [];
  const history = await query(sql, params);

  const historyWithIcons = history.map((item) => {
    const formattedKey = formatServiceKey(item.service);
    return {
      ...item,
      icons: iconMapping[formattedKey] || item.icons || "general",
      booking_hour: item.booking_hour || "N/A",
      dt_start: item.dt_start || "N/A", // Certifique-se de que o campo dt_start está presente
    };
  });

  return historyWithIcons;
}

async function AtualizarDadosDoServiceTracker() {
  const sql = `
    UPDATE history AS h
    SET 
        dt_start = t.dt_start,
        booking_hour = t.booking_hour
    FROM service_tracker AS t
    WHERE h.id_service_tracker = t.id_service_tracker;
  `;

  try {
    await query(sql, []);
    console.log(
      "Repository: History table updated with data from service_tracker."
    ); // 🔥 Log para depuração
  } catch (error) {
    console.error("Repository: Error updating history table:", error); // 🔥 Log do erro
    throw new Error(
      "Erro ao atualizar a tabela history com dados do service_tracker."
    );
  }
}

export default {
  Listar,
  AtualizarDadosDoServiceTracker,
};
