import serviceBanner from "../services/service.banner.js";

const controllerBanners = {
  async List(req, res) {
    try {
      const banners = await serviceBanner.ListBanners();
      res.status(200).json(banners);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default controllerBanners;
