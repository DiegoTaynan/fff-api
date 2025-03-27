import { query } from "../database/sqlite.js";

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

async function Listar(service) {
  let filtro = [];
  let sql = `
    SELECT 
      id_service, 
      service, 
      description, 
      COALESCE(icons, 'general') AS icons 
    FROM services
  `;

  if (service) {
    sql += " WHERE service LIKE ?";
    filtro.push("%" + service + "%");
  }

  sql += " ORDER BY service";

  const services = await query(sql, filtro);

  // Atualiza o ícone do serviço com base no nome do serviço
  const servicesWithIcons = services.map((service) => ({
    ...service,
    icons: iconMapping[service.service] || "general", // Associa o ícone correto
  }));

  return servicesWithIcons;
}

async function Inserir(service, description) {
  let sql = `insert into services(service, description) values(?, ?) 
  returning id_service`;

  const service_info = await query(sql, [service, description]);

  return service_info[0];
}

async function Editar(id_service, service, description) {
  let sql = `update services set service=?, description=?
  where id_service = ?`;

  await query(sql, [service, description, id_service]);

  return { id_service };
}

async function Excluir(id_service) {
  let sql = `delete from services where id_service = ?`;

  await query(sql, [id_service]);

  return { id_service };
}

async function ListarServices(id_service) {
  let sql = `select id_service, service, info
  from services
  where id_service = ?;
  `;

  const serv = await query(sql, [id_service]);

  return serv;
}

export default { Listar, Inserir, Editar, Excluir, ListarServices };
