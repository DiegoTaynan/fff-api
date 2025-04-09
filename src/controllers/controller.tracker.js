import serviceTracker from "../services/service.tracker.js";

async function Listar(req, res) {
  try {
    const id_user = req.id_user; // Obtém o ID do usuário logado do token

    const tracker = await serviceTracker.Listar(id_user);

    res.status(200).json(tracker);
  } catch (error) {
    console.error("Controller: Error fetching trackers:", error); // 🔥 Log do erro
    res
      .status(500)
      .json({ error: error.message || "Erro ao buscar trackers." });
  }
}

async function CriarAgendamento(req, res) {
  try {
    const data = req.body; // Dados enviados no corpo da requisição
    const result = await serviceTracker.CriarAgendamento(data);

    res
      .status(201)
      .json({ message: "Agendamento criado com sucesso.", ...result });
  } catch (error) {
    console.error("Controller: Error creating appointment:", error); // 🔥 Log do erro
    res
      .status(400)
      .json({ error: error.message || "Erro ao criar agendamento." });
  }
}

export default { Listar, CriarAgendamento };
