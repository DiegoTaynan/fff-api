import serviceTracker from "../services/service.tracker.js";

async function Listar(req, res) {
  try {
    const tracker = await serviceTracker.Listar();

    res.status(200).json(tracker);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export default { Listar };
