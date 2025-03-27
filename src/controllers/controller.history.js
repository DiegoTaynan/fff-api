import serviceHistory from "../services/service.history.js";

async function Listar(req, res) {
  try {
    const service_tracker = req.params.service_tracker;
    const history = await serviceHistory.Listar(service_tracker);

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export default { Listar };
