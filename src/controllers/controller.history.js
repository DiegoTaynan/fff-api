import serviceHistory from "../services/service.history.js";

async function Listar(req, res) {
  try {
    const { service_tracker } = req.params; // Obtém o parâmetro da rota
    const id_user = req.id_user; // Obtém o ID do usuário logado do token

    const history = await serviceHistory.Listar(service_tracker, id_user);

    res.status(200).json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error); // Log do erro
    res.status(500).json({ error: "Erro ao buscar histórico." });
  }
}

export default { Listar };