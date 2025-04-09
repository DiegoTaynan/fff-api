import repositoryTracker from "../repositories/repository.tracker.js";

// Mapeamento dos serviços para os ícones correspondentes
const iconMapping = {
  "Air Conditioning Services": "ac_system",
  "Brake Services": "brake_services",
  "Oil Changes": "oil_changes",
  "Battery Services": "battery",
  "Suspension Repairs": "suspension",
  "Tire Services": "tire",
  "Transmission Services": "transmission",
  "Cooling System Services": "cooling",
  Diagnostics: "diagnostics",
  "Electrical System Repairs": "electrical",
  "Exhaust System Repairs": "exhaust",
  "Tune-Ups": "tuneup",
  "General Maintenance": "general",
  // Adicione outros serviços e ícones conforme necessário
};

async function Listar(id_user) {
  console.log("Service: Fetching trackers for user:", id_user); // 🔥 Log para depuração

  const tracker = await repositoryTracker.Listar(id_user);

  // Atualiza os ícones dos trackers com base no serviço associado
  const trackerWithIcons = tracker.map((item) => ({
    ...item,
    icons: iconMapping[item.service] || "general", // Usa o mapeamento correto
  }));

  console.log("Service: Trackers fetched with icons:", trackerWithIcons); // 🔥 Log para verificar os dados retornados
  return trackerWithIcons;
}

export default { Listar };
