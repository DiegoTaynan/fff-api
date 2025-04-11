import repositoryTracker from "../repositories/repository.tracker.js";
import serviceHistory from "./service.history.js";

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
  const tracker = await repositoryTracker.Listar(id_user);

  // Atualiza os ícones dos trackers com base no serviço associado
  const trackerWithIcons = tracker.map((item) => ({
    ...item,
    icons: iconMapping[item.service] || "general", // Usa o mapeamento correto
  }));

  return trackerWithIcons;
}

async function Criar(service_tracker) {
  try {
    console.log("📦 Recebendo para criação:", service_tracker);

    const tracker = await repositoryTracker.Criar(service_tracker);
    console.log("✅ Tracker criado:", tracker);

    const historyData = {
      id_service_tracker: tracker.id_service_tracker,
      id_user: tracker.id_user,
      comments: service_tracker.comments || null,
      dt_start: tracker.dt_start,
      id_appointment: tracker.id_appointment,
      observations: service_tracker.observations || null,
    };

    console.log("📜 Dados do histórico:", historyData);

    await serviceHistory.CriarHistorico(historyData);
    console.log("📜 Histórico criado com sucesso.");

    return tracker;
  } catch (error) {
    console.error(
      "❌ ERRO EM service.tracker.Criar:",
      error.message,
      error.stack
    );
    throw error;
  }
}

export default { Listar, Criar };
