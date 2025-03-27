import serviceAppointment from "../services/service.appointments.js";
import serviceMechanic from "../services/service.mechanic.js";

async function ListarByUser(req, res) {
  try {
    const id_user = req.id_user; // Obtido do token
    const { dt_start, dt_end, id_mechanic, page = 1, limit = 20 } = req.query;

    const appointments = await serviceAppointment.Listar({
      dt_start,
      dt_end,
      id_mechanic,
      id_user,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function Listar(req, res) {
  try {
    const id_user = req.id_user; // Obtido do token
    const { dt_start, dt_end, id_mechanic, page = 1, limit = 20 } = req.query;

    const { appointments, total } = await serviceAppointment.Listar({
      dt_start,
      dt_end,
      id_mechanic,
      id_user,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    res.status(200).json(appointments); // Retorna apenas os agendamentos
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

  console.log("Received data for creating appointment:", {
    id_user,
    id_service,
    services,
    booking_date,
    booking_hour,
  });

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

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error); // Log para depuração
    res.status(500).json({ error: "Error creating appointment." });
  }
}

async function Excluir(req, res) {
  const id_user = req.id_user;
  const id_appointment = req.params.id_appointment;

  const appointment = await serviceAppointment.Excluir(id_user, id_appointment);

  res.status(200).json(appointment);
}

async function AtualizarStatus(req, res) {
  const id_appointment = req.params.id_appointment;
  const { status } = req.body;

  try {
    const appointment = await serviceAppointment.AtualizarStatus(
      id_appointment,
      status
    );
    res.status(200).json(appointment);
  } catch (error) {
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
    observations,
    additional_services, // Adicionar serviços adicionais
  } = req.body;

  try {
    const appointment = await serviceAppointment.Inserir(
      id_user,
      id_mechanic,
      id_service,
      booking_date,
      booking_hour,
      observations, // Passar observações
      additional_services // Passar serviços adicionais
    );

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment (Admin):", error); // Log para depuração
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
    observations,
    additional_services,
  } = req.body;

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

    const appointment = await serviceAppointment.Editar(
      id_appointment,
      id_user,
      id_mechanic,
      id_service,
      booking_date,
      booking_hour,
      observations,
      additional_services // Passar serviços adicionais
    );

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error); // Adicione este log para depuração
    res.status(500).json({ error: "Error updating appointment." });
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
};
