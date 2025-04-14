import { query } from "../database/sqlite.js";

async function Listar({
  dt_start,
  dt_end,
  id_mechanic,
  id_user,
  limit,
  offset,
}) {
  let filtro = [];
  let sql = `select a.id_appointment, s.service as service, m.name as mechanic, m.specialty,
       a.booking_date, a.booking_hour, u.name as user, a.id_mechanic,
       a.id_service, a.id_user, a.observations, a.progress
  from appointments a
  join services s on (s.id_service = a.id_service)
  join mechanic m on (m.id_mechanic = a.id_mechanic)
  join users u on (u.id_user = a.id_user)
  where a.id_appointment > 0 `;

  if (dt_start) {
    filtro.push(dt_start);
    sql += "and a.booking_date >= ? ";
  }

  if (dt_end) {
    filtro.push(dt_end);
    sql += "and a.booking_date <= ? ";
  }

  if (id_mechanic) {
    filtro.push(id_mechanic);
    sql += "and a.id_mechanic = ? ";
  }

  if (id_user) {
    filtro.push(id_user);
    sql += "and a.id_user = ? ";
  }

  sql += "order by a.booking_date, a.booking_hour limit ? offset ?";
  filtro.push(limit, offset);

  const appointments = await query(sql, filtro);
  return appointments;
}

async function Count({ dt_start, dt_end, id_mechanic }) {
  let filtro = [];
  let sql = `select count(*) as total from appointments a
where a.id_appointment > 0 `;

  if (dt_start) {
    filtro.push(dt_start);
    sql += "and a.booking_date >= ? ";
  }

  if (dt_end) {
    filtro.push(dt_end);
    sql += "and a.booking_date <= ? ";
  }

  if (id_mechanic) {
    filtro.push(id_mechanic);
    sql += "and a.id_mechanic = ? ";
  }

  const result = await query(sql, filtro);
  return result[0].total;
}

async function Inserir(
  id_user,
  id_mechanic,
  id_service,
  booking_date,
  booking_hour,
  observations // Adicionar observações
) {
  let sql = `insert into appointments(id_user, 
    id_mechanic, id_service, booking_date, booking_hour, observations, progress) 
    values(?, ?, ?, ?, ?, ?, 'In progress')
      returning id_appointment`;

  const appointment = await query(sql, [
    id_user,
    id_mechanic,
    id_service,
    booking_date,
    booking_hour,
    observations, // Adicionar observações
  ]);

  return appointment[0];
}

async function InserirServicoAdicional(id_appointment, id_service) {
  let sql = `insert into appointment_services(id_appointment, id_service) 
             values(?, ?)`;

  await query(sql, [id_appointment, id_service]);
}

async function Excluir(id_user, id_appointment) {
  const idUserNumber = parseInt(id_user, 10);
  const idAppointmentNumber = parseInt(id_appointment, 10);

  // Excluir registros relacionados na tabela appointment_services
  const deleteRelatedSql = `
    DELETE FROM appointment_services 
    WHERE id_appointment = ?
  `;
  await query(deleteRelatedSql, [idAppointmentNumber]);

  // Excluir o registro principal na tabela appointments
  const deleteSql = `
    DELETE FROM appointments 
    WHERE id_appointment = ? AND id_user = ?
  `;
  const result = await query(deleteSql, [idAppointmentNumber, idUserNumber]);

  // Retorna true se o registro principal foi excluído
  return { affectedRows: result?.changes || 0 };
}

async function ListarId(id_appointment) {
  let sql = `select a.id_appointment, s.service as service, m.name as mechanic, m.specialty,
       a.booking_date, a.booking_hour, u.name as user, a.id_mechanic,
        a.id_service, a.id_user, a.observations, a.progress
from appointments a
join services s on (s.id_service = a.id_service)
join mechanic m on (m.id_mechanic = a.id_mechanic)
join users u on (u.id_user = a.id_user)
where a.id_appointment = ? `;

  const appointments = await query(sql, [id_appointment]);

  return appointments[0];
}

async function Editar(
  id_appointment,
  id_user,
  id_mechanic,
  id_service,
  booking_date,
  booking_hour,
  observations // Adicionar observações
) {
  let sql = `update appointments set id_user=?, id_mechanic=?,
   id_service=?, booking_date=?, booking_hour=?, observations=? 
   where id_appointment=?`;

  await query(sql, [
    id_user,
    id_mechanic,
    id_service,
    booking_date,
    booking_hour,
    observations, // Adicionar observações
    id_appointment,
  ]);

  return { id_appointment };
}

async function AtualizarStatus(id_appointment, status) {
  let sql = `update appointments set progress=? where id_appointment=?`;

  await query(sql, [status, id_appointment]);

  return { id_appointment, status };
}

async function RemoverServicosAdicionais(id_appointment) {
  let sql = `delete from appointment_services where id_appointment = ?`;
  await query(sql, [id_appointment]);
}

async function ListarServicosAdicionais(id_appointment) {
  let sql = `select id_service from appointment_services where id_appointment = ?`;
  const services = await query(sql, [id_appointment]);
  return services.map((service) => service.id_service);
}

async function ListarByUser(id_user) {
  const sql = `
    SELECT 
      a.id_appointment, -- 🔥 Certifique-se de selecionar o id_appointment
      s.service AS service, 
      m.name AS mechanic, 
      m.specialty AS specialty, 
      a.booking_date, 
      a.booking_hour
    FROM appointments a
    JOIN services s ON s.id_service = a.id_service
    JOIN mechanic m ON m.id_mechanic = a.id_mechanic
    WHERE a.id_user = ?
    ORDER BY a.booking_date, a.booking_hour
  `;

  const appointments = await query(sql, [id_user]);

  return appointments;
}

async function InserirServiceTracker(
  id_user,
  id_service,
  id_appointment,
  dt_start
) {
  const sql = `
    INSERT INTO service_tracker (id_user, id_service, id_appointment, dt_start, status)
    VALUES (?, ?, ?, ?, 'P') -- Status inicial como "P" (In Progress)
  `;

  await query(sql, [id_user, id_service, id_appointment, dt_start]);
}

async function InserirHistory(id_user, id_service, id_appointment, dt_start) {
  const sql = `
    INSERT INTO history (id_user, id_service, id_appointment, dt_start, observations)
    VALUES (?, ?, ?, ?, '')
  `;

  await query(sql, [id_user, id_service, id_appointment, dt_start]);
}

export default {
  Listar,
  Inserir,
  InserirServicoAdicional,
  Excluir,
  ListarId,
  Editar,
  AtualizarStatus,
  RemoverServicosAdicionais,
  ListarServicosAdicionais,
  Count,
  ListarByUser,
  InserirServiceTracker,
  InserirHistory,
};
