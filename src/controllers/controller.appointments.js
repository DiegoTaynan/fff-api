import serviceAppointment from "../services/service.appointments.js";
import serviceMechanic from "../services/service.mechanic.js";

async function ListarByUser(req, res) {
  try {
    const id_user = req.id_user; // Obtido do token
    const appointments = await serviceAppointment.ListarByUser(id_user);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function Listar(req, res) {
  try {
    const { dt_start, dt_end, id_mechanic, page = 1, limit = 20 } = req.query;

    // Se a rota for de admin, não filtrar por id_user
    const id_user = req.originalUrl.includes("/admin/appointments")
      ? null
      : req.id_user;

    const { appointments, total } = await serviceAppointment.Listar({
      dt_start,
      dt_end,
      id_mechanic,
      id_user,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    res.status(200).json({
      data: appointments,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function ListarId(req, res) {
  const id_appointment = req.params.id_appointment;
  const appointment = await serviceAppointment.ListarId(id_appointment);
  const additional_services = await serviceAppointment.ListarServicosAdicionais(
    id_appointment
  );

  res.status(200).json({ ...appointment, additional_services });
}

async function Inserir(req, res) {
  const id_user = req.id_user;
  const { id_service, services, booking_date, booking_hour } = req.body;

  try {
    const availableMechanics = await serviceMechanic.CheckAvailability(
      booking_date,
      booking_hour
    );

    if (availableMechanics.length === 0) {
      return res
        .status(400)
        .json({ error: "No mechanics available for this time slot." });
    }

    const id_mechanic = availableMechanics[0].id_mechanic;

    const appointment = await serviceAppointment.Inserir(
      id_user,
      id_mechanic,
      id_service,
      booking_date,
      booking_hour,
      "", // Passar observações vazias
      services // Passar serviços adicionais
    );

    // 🔥 InserirHistory será chamado automaticamente pelo service.appointments.js

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Error creating appointment." });
  }
}

async function Excluir(req, res) {
  try {
    const id_user = req.id_user;
    const id_appointment = req.params.id_appointment;

    if (!id_appointment) {
      return res.status(400).json({ error: "Appointment ID is required." });
    }

    const result = await serviceAppointment.Excluir(id_user, id_appointment);

    if (result) {
      res.status(200).json({ id_appointment });
    } else {
      res.status(200).json({ id_appointment }); // Retorna sucesso mesmo que o registro já tenha sido excluído
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting appointment." });
  }
}

async function AtualizarStatus(req, res) {
  const id_appointment = req.params.id_appointment;
  const { status } = req.body;

  try {
    // Atualiza o status do appointment
    const appointment = await serviceAppointment.AtualizarStatus(
      id_appointment,
      status
    );
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error updating status:", error); // Log detalhado
    res.status(500).json({ error: "Error updating status." });
  }
}

async function InserirAdmin(req, res) {
  const {
    id_user,
    id_mechanic,
    id_service,
    booking_date,
    booking_hour,
    observations, // Certifique-se de passar as observações
    additional_services,
  } = req.body;

  try {
    const appointment = await serviceAppointment.Inserir(
      id_user,
      id_mechanic,
      id_service,
      booking_date,
      booking_hour,
      observations, // Passar observações
      additional_services
    );

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Error creating appointment." });
  }
}

async function EditarAdmin(req, res) {
  const id_appointment = req.params.id_appointment;
  const {
    id_user,
    id_service,
    booking_date,
    booking_hour,
    observations, // Certifique-se de que está sendo recebido
    additional_services,
  } = req.body;

  try {
    const availableMechanics = await serviceMechanic.CheckAvailability(
      booking_date,
      booking_hour
    );

    if (availableMechanics.length === 0) {
      console.warn("No mechanics available for this time slot."); // Log de aviso
      return res
        .status(400)
        .json({ error: "No mechanics available for this time slot." });
    }

    const id_mechanic = availableMechanics[0].id_mechanic;

    const appointment = await serviceAppointment.Editar(
      id_appointment,
      id_user,
      id_mechanic,
      id_service,
      booking_date,
      booking_hour,
      additional_services
    );

    // Insere o registro na tabela history
    await serviceAppointment.InserirHistory(
      id_user,
      id_service,
      id_appointment,
      booking_date,
      observations // Passar as observações para o histórico
    );

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error in EditarAdmin:", error); // Log detalhado do erro
    res
      .status(500)
      .json({ error: error.message || "Error updating appointment." });
  }
}

async function Editar(req, res) {
  const { id_appointment } = req.params;

  try {
    const appointment = await query(
      "SELECT * FROM appointments WHERE id_appointment = ?",
      [id_appointment],
      "get"
    );

    if (!appointment) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamento." });
  }
}

export default {
  ListarByUser,
  Inserir,
  Excluir,
  Listar,
  ListarId,
  InserirAdmin,
  EditarAdmin,
  AtualizarStatus,
  Editar,
};
