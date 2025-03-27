import repositoryTracker from "../repositories/repository.tracker.js";

async function Listar() {
  const tracker = await repositoryTracker.Listar();

  return tracker;
}

export default { Listar };
