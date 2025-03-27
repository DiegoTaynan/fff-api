import serviceHistory from "../services/service.history.js";

async function Listar(req, res) {
  try {
    const service_tracker = req.params.service_tracker; // Obtém o parâmetro da rota
    const history = await serviceHistory.Listar(service_tracker);

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error); // Log do erro
    res.status(500).json({ error: "Error fetching history." });
  }
}

export default { Listar };
