import repositoryTracker from "../repositories/repository.tracker.js";

async function Listar(id_user) {
  console.log("Service: Fetching trackers for user:", id_user); // 🔥 Log para depuração

  const tracker = await repositoryTracker.Listar(id_user);

  console.log("Service: Trackers fetched:", tracker); // 🔥 Log para verificar os dados retornados
  return tracker;
}

export default { Listar };
