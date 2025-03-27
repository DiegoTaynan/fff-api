import serviceMechanic from "../services/service.mechanic.js";

async function Listar(req, res) {
  const name = req.query.name;
  const mechanic = await serviceMechanic.Listar(name);

  res.status(200).json(mechanic);
}

async function Inserir(req, res) {
  /*
  const name = req.body.name;
  const specialty = req.body.specialty;
  const icon = req.body.icon;
  */

  const { name, specialty, icon } = req.body;

  const mechanic = await serviceMechanic.Inserir(name, specialty, icon);

  res.status(201).json(mechanic);
}

async function Editar(req, res) {
  const id_mechanic = req.params.id_mechanic;
  const { name, specialty, icon } = req.body;

  const mechanic = await serviceMechanic.Editar(
    id_mechanic,
    name,
    specialty,
    icon
  );

  res.status(200).json(mechanic);
}

async function Excluir(req, res) {
  const id_mechanic = req.params.id_mechanic;

  const mechanic = await serviceMechanic.Excluir(id_mechanic);

  res.status(200).json(mechanic);
}

// Função para verificar disponibilidade de mecânicos
async function CheckAvailability(req, res) {
  const { date, hour } = req.query; // Data e hora enviadas na requisição

  if (!date || !hour) {
    return res.status(400).json({ error: "Date and time are required." });
  }

  try {
    const availableMechanics = await serviceMechanic.CheckAvailability(
      date,
      hour
    );
    res.status(200).json(availableMechanics);
  } catch (error) {
    res.status(500).json({ error: "Error checking availability." });
  }
}

export default { Listar, Inserir, Editar, Excluir, CheckAvailability };
