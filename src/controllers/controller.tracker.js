import serviceTracker from "../services/service.tracker.js";

async function Listar(req, res) {
  try {
    const id_user = req.id_user; // Obtém o ID do usuário logado do token
    console.log("Controller: Fetching trackers for user:", id_user); // 🔥 Log para depuração

    const tracker = await serviceTracker.Listar(id_user);

    console.log("Controller: Trackers fetched:", tracker); // 🔥 Log para verificar os dados retornados
    res.status(200).json(tracker);
  } catch (error) {
    console.error("Controller: Error fetching trackers:", error); // 🔥 Log do erro
    res.status(500).json({ error: "Erro ao buscar trackers." });
  }
}

export default { Listar };
