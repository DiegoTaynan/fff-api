import repositoryTracker from "../repositories/repository.tracker.js";

async function Listar(id_user) {
  console.log("Service: Fetching trackers for user:", id_user); // 🔥 Log para depuração

  const trackers = await repositoryTracker.Listar(id_user);

  return trackers;
}

export default { Listar };
