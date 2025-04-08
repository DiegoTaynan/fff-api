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
  try {
    console.log("Service: Creating appointment with data:", {
      id_user,
      id_mechanic,
      id_service,
      booking_date,
      booking_hour,
      observations,
      additional_services,
    }); // 🔥 Log para depuração

    const appointment = await repositoryAppointment.Inserir(
      id_user,
      id_mechanic,
      id_service,
      booking_date,
      booking_hour,
      observations
    );

    console.log("Service: Appointment created:", appointment); // 🔥 Log para verificar o agendamento criado

    // Inserir serviços adicionais
    if (additional_services && additional_services.length > 0) {
      for (const service of additional_services) {
        console.log("Service: Adding additional service:", service); // 🔥 Log para depuração
        await repositoryAppointment.InserirServicoAdicional(
          appointment.id_appointment,
          service
        );
      }
    }

    // Inserir o registro correspondente no service_tracker
    console.log("Service: Adding to service_tracker:", {
      id_user,
      id_service,
      id_appointment: appointment.id_appointment,
      booking_date,
      booking_hour,
    }); // 🔥 Log para depuração

    await repositoryAppointment.InserirServiceTracker(
      id_user,
      id_service,
      appointment.id_appointment,
      booking_date,
      booking_hour
    );

    return appointment;
  } catch (error) {
    console.error("Service: Error creating appointment:", error); // 🔥 Log do erro
    throw new Error("Erro ao criar agendamento. Verifique os dados enviados.");
  }
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

export default {
  Listar,
  Inserir,
  Excluir,
  ListarId,
  Editar,
  AtualizarStatus,
  ListarServicosAdicionais,
  ListarByUser,
};
