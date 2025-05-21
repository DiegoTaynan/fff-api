import repositoryHistory from "../repositories/repository.history.js";

async function Listar(service_tracker, id_user) {
  const history = await repositoryHistory.Listar(service_tracker, id_user);

  return history;
}

export default { Listar };