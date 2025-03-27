import serviceBanner from "../services/service.banner.js";

async function Listar(req, res) {
  try {
    const banners = await serviceBanner.Listar();
    console.log("Banners do banco de dados:", banners); // Adicione o log

    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export default { Listar };
