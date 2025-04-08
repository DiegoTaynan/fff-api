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

async function Listar(id_user) {
  const sql = `
    SELECT 
      t.*, 
      s.service, 
      COALESCE(s.icons, 'general') AS icons,
      a.booking_date, 
      a.observations, 
      a.progress
    FROM service_tracker t
    JOIN services s ON s.id_service = t.id_service
    LEFT JOIN appointments a ON a.id_appointment = t.id_appointment
    WHERE t.id_user = ?
    ORDER BY t.id_service_tracker DESC
  `;

  const trackers = await query(sql, [id_user]);

  const trackersWithIcons = trackers.map((tracker) => {
    const formattedKey = formatServiceKey(tracker.service);
    return {
      ...tracker,
      icons: iconMapping[formattedKey] || tracker.icons || "general",
    };
  });

  return trackersWithIcons;
}

export default { Listar };
