import repositoryAppointment from "../repositories/repository.appointments.js";

async function Listar({
  dt_start,
  dt_end,
  id_mechanic,
  id_user,
  page = 1,
  limit = 20,
}) {
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
    throw new Error("Invalid 'page' parameter. It must be a positive integer.");
  }
  if (!Number.isInteger(limitNumber) || limitNumber <= 0) {
    throw new Error(
      "Invalid 'limit' parameter. It must be a positive integer."
    );
  }

  const offset = (pageNumber - 1) * limitNumber;

  const appointments = await repositoryAppointment.Listar({
    dt_start,
    dt_end,
    id_mechanic,
    id_user,
    limit: limitNumber,
    offset,
  });

  const total = await repositoryAppointment.Count({
    dt_start,
    dt_end,
    id_mechanic,
    id_user,
  });

  return { appointments, total };
}

async function ListarId(id_appointment) {
  return await repositoryAppointment.ListarId(id_appointment);
}

async function ListarServicosAdicionais(id_appointment) {
  return await repositoryAppointment.ListarServicosAdicionais(id_appointment);
}

async function Inserir(
  id_user,
  id_mechanic,
  id_service,
  booking_date,
  booking_hour,
  observations,
  additional_services
) {
  const appointment = await repositoryAppointment.Inserir(
    id_user,
    id_mechanic,
    id_service,
    booking_date,
    booking_hour,
    observations // Adicionar observações
  );

  // Inserir serviços adicionais
  if (additional_services && additional_services.length > 0) {
    for (const service of additional_services) {
      await repositoryAppointment.InserirServicoAdicional(
        appointment.id_appointment,
        service
      );
    }
  }

  return appointment;
}

async function Excluir(id_user, id_appointment) {
  const appointment = await repositoryAppointment.Excluir(
    id_user,
    id_appointment
  );

  return appointment;
}

async function Editar(
  id_appointment,
  id_user,
  id_mechanic,
  id_service,
  booking_date,
  booking_hour,
  observations,
  additional_services
) {
  const appointment = await repositoryAppointment.Editar(
    id_appointment,
    id_user,
    id_mechanic,
    id_service,
    booking_date,
    booking_hour,
    observations
  );

  // Remover serviços adicionais existentes
  await repositoryAppointment.RemoverServicosAdicionais(id_appointment);

  // Adicionar novos serviços adicionais
  if (additional_services && additional_services.length > 0) {
    for (const service of additional_services) {
      await repositoryAppointment.InserirServicoAdicional(
        id_appointment,
        service
      );
    }
  }

  return appointment;
}

async function AtualizarStatus(id_appointment, status) {
  const appointment = await repositoryAppointment.AtualizarStatus(
    id_appointment,
    status
  );
  return appointment;
}

export default {
  Listar,
  Inserir,
  Excluir,
  ListarId,
  Editar,
  AtualizarStatus,
  ListarServicosAdicionais,
};
