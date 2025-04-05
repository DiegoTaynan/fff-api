import serviceImages from "../services/service.images.js";

const controllerImages = {
  async Upload(req, res) {
    const { id_appointment } = req.params;
    const file = req.file;

    console.log("Controller: Uploading image for appointment:", id_appointment);
    console.log("Controller: File received:", file);

    try {
      const imageUrl = await serviceImages.UploadImage(id_appointment, file);
      res
        .status(201)
        .json({ message: "Imagem enviada com sucesso!", imageUrl });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
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

    console.log("Controller: Delete request received.");
    console.log("Controller: id_appointment:", id_appointment);
    console.log("Controller: id_image:", id_image);

    try {
      await serviceImages.DeleteImage(id_appointment, id_image);
      res.status(200).json({ message: "Imagem deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default controllerImages;
