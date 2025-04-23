import serviceImages from "../services/service.images.js";

const controllerImages = {
  async Upload(req, res) {
    const { id_appointment } = req.params;
    const file = req.file;

    try {
      const imageUrl = await serviceImages.UploadImage(id_appointment, file);
      res
        .status(201)
        .json({ message: "Imagem enviada com sucesso!", imageUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async List(req, res) {
    const { id_appointment } = req.params;

    try {
      const images = await serviceImages.ListImages(id_appointment);
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async Delete(req, res) {
    const { id_appointment, id_image } = req.params;

    try {
      await serviceImages.DeleteImage(id_appointment, id_image);
      res.status(200).json({ message: "Imagem deletada com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default controllerImages;
