import serviceHistory from "../services/service.history.js";

async function Listar(req, res) {
  try {
    const { id_service_tracker } = req.query;

    const history = await serviceHistory.Listar(id_service_tracker);

    res.status(200).json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro ao buscar histórico." });
  }
}

export default { Listar };
