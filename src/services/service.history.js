import repositoryHistory from "../repositories/repository.history.js";

async function Listar(service_tracker) {
  const history = await repositoryHistory.Listar(service_tracker);

  return history;
}

export default { Listar };
