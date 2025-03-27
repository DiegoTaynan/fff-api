import repositoryServices from "../repositories/repository.services.js";

async function Listar(service) {
  const id_service = await repositoryServices.Listar(service);

  return id_service;
}

async function Inserir(service, description) {
  const service_info = await repositoryServices.Inserir(service, description);

  return service_info;
}

async function Editar(id_service, service, description) {
  const service_info = await repositoryServices.Editar(
    id_service,
    service,
    description
  );

  return service_info;
}

async function Excluir(id_service) {
  const service_info = await repositoryServices.Excluir(id_service);

  return service_info;
}

async function ListarServices(id_service) {
  const serv = await repositoryServices.ListarServices(id_service);

  return serv;
}

export default { Listar, Inserir, Editar, Excluir, ListarServices };
