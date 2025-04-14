import repositoryTracker from "../repositories/repository.tracker.js";

async function Listar(id_user) {
  const tracker = await repositoryTracker.Listar(id_user);

  return tracker;
}

export default { Listar };
