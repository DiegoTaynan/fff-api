import repositoryHistory from "../repositories/repository.history.js";

async function Listar(id_service_tracker) {
  try {
    const history = await repositoryHistory.Listar(id_service_tracker);
    return history;
  } catch (error) {
    console.error("❌ Erro ao listar histórico:", error);
    throw error;
  }
}

async function Criar(historyData) {
  await repositoryHistory.Criar(historyData); // pode ter log também
}

export default { Listar, Criar };
