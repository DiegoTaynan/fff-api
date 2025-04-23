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
           m.name AS mechanic -- Adiciona o nome do mecânico
    FROM history h
    JOIN services s ON s.id_service = h.id_service
    LEFT JOIN appointments a ON a.id_appointment = h.id_appointment
    LEFT JOIN mechanic m ON m.id_mechanic = a.id_mechanic -- Faz o join com a tabela de mecânicos
    ${service_tracker ? "WHERE h.id_appointment = ?" : ""}
    ORDER BY h.id_history DESC`;

  const params = service_tracker ? [service_tracker] : [];
  const history = await query(sql, params);

  const historyWithIcons = history.map((item) => {
    const formattedKey = formatServiceKey(item.service);
    return {
      ...item,
      icons: iconMapping[formattedKey] || item.icons || "general",
    };
  });

  return historyWithIcons;
}

export default { Listar };
