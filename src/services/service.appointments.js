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
    observations // Passar observações
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

  // 🔥 Inserir o registro correspondente no service_tracker
  await repositoryAppointment.InserirServiceTracker(
    id_user,
    id_service,
    appointment.id_appointment,
    booking_date
  );

  // 🔥 Inserir o registro correspondente no history
  await repositoryAppointment.InserirHistory(
    id_user,
    id_service,
    appointment.id_appointment,
    booking_date,
    observations // Passar observações
  );

  return appointment;
}

async function Excluir(id_user, id_appointment) {
  const result = await repositoryAppointment.Excluir(id_user, id_appointment);

  // Retorna true se o registro principal foi excluído
  return result.affectedRows > 0;
}

async function Editar(
  id_appointment,
  id_user,
  id_mechanic,
  id_service,
  booking_date,
  booking_hour,
  observations, // Certifique-se de que está sendo recebido
  additional_services
) {
  console.log("Service Editar Input:", {
    id_appointment,
    id_user,
    id_mechanic,
    id_service,
    booking_date,
    booking_hour,
    observations,
    additional_services,
  }); // Log dos dados recebidos

  const appointment = await repositoryAppointment.Editar(
    id_appointment,
    id_user,
    id_mechanic,
    id_service,
    booking_date,
    booking_hour,
    observations // Passar para o repositório
  );

  console.log("Service Editar Output:", appointment); // Log da resposta do repositório

  // Remover serviços adicionais existentes
  await repositoryAppointment.RemoverServicosAdicionais(id_appointment);

  // Adicionar novos serviços adicionais
  if (additional_services && additional_services.length > 0) {
    for (const service of additional_services) {
      console.log("Adding Additional Service:", service); // Log de cada serviço adicional
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

async function ListarByUser(id_user) {
  const appointments = await repositoryAppointment.ListarByUser(id_user);

  // Formatar os dados para incluir o id_appointment
  return appointments.map((appointment) => ({
    id_appointment: appointment.id_appointment,
    service: appointment.service,
    mechanic: appointment.mechanic,
    specialty: appointment.specialty,
    date: appointment.booking_date,
    hour: appointment.booking_hour,
  }));
}

async function InserirHistory(
  id_user,
  id_service,
  id_appointment,
  dt_start,
  observations
) {
  console.log("Service InserirHistory Input:", {
    id_user,
    id_service,
    id_appointment,
    dt_start,
    observations,
  }); // Log dos dados recebidos

  const history = await repositoryAppointment.InserirHistory(
    id_user,
    id_service,
    id_appointment,
    dt_start,
    observations
  );

  console.log("Service InserirHistory Output:", history); // Log da resposta do repositório
  return history;
}

export default {
  Listar,
  Inserir,
  Excluir,
  ListarId,
  Editar,
  AtualizarStatus,
  ListarServicosAdicionais,
  ListarByUser,
  InserirHistory,
};
