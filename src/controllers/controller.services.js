import serviceServices from "../services/service.services.js";

async function Listar(req, res) {
  try {
    const service = req.query.service;
    const services = await serviceServices.Listar(service);

    res.status(200).json(services);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while listing services." });
  }
}

async function Inserir(req, res) {
  /*const service = req.body.service;
  const description = req.body.description;
  */

  const { service, description } = req.body;
  const service_info = await serviceServices.Inserir(service, description);

  res.status(201).json(service_info);
}

async function Editar(req, res) {
  const id_service = req.params.id_service;
  const { service, description } = req.body;
  const service_info = await serviceServices.Editar(
    id_service,
    service,
    description
  );

  res.status(200).json(service_info);
}

async function Excluir(req, res) {
  const id_service = req.params.id_service;

  const service_info = await serviceServices.Excluir(id_service);

  res.status(200).json(service_info);
}

async function ListarServices(req, res) {
  const id_service = req.params.id_service;
  const serv = await serviceServices.ListarServices(id_service);

  res.status(200).json(serv);
}

export default { Listar, Inserir, Editar, Excluir, ListarServices };
