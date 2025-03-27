import { Router } from "express";
import controllerMechanic from "./controllers/controller.mechanic.js";
import controllerUser from "./controllers/controller.user.js";
import controllerServices from "./controllers/controller.services.js";
import controllerAppointment from "./controllers/controller.appointments.js";
import controllerBanner from "./controllers/controller.banner.js";
import controllerTracker from "./controllers/controller.tracker.js";
import controllerHistory from "./controllers/controller.history.js";
import jwt from "./token.js";

const router = Router();

router.get("/banners", jwt.ValidateToken, controllerBanner.Listar);

// Mechanics
router.get("/mechanic", jwt.ValidateToken, controllerMechanic.Listar);
router.post("/mechanic", jwt.ValidateToken, controllerMechanic.Inserir);
router.put(
  "/mechanic/:id_mechanic",
  jwt.ValidateToken,
  controllerMechanic.Editar
);
router.delete(
  "/mechanic/:id_mechanic",
  jwt.ValidateToken,
  controllerMechanic.Excluir
);
router.get(
  "/mechanics/availability",
  jwt.ValidateToken,
  controllerMechanic.CheckAvailability
);

// Users
router.post("/users/register", controllerUser.Inserir);
router.post("/users/login", controllerUser.Login);
router.get("/users/profile", jwt.ValidateToken, controllerUser.Profile);

// Reservas (Appointments)
router.get(
  "/appointments",
  jwt.ValidateToken,
  controllerAppointment.ListarByUser
);

router.post("/appointments", jwt.ValidateToken, controllerAppointment.Inserir);
router.delete(
  "/appointments/:id_appointment",
  jwt.ValidateToken,
  controllerAppointment.Excluir
);
router.put(
  "/appointments/:id_appointment/status",
  jwt.ValidateToken,
  controllerAppointment.AtualizarStatus
);

// Services (Serviços prestados)
router.get("/services", jwt.ValidateToken, controllerServices.Listar);
router.post("/services", jwt.ValidateToken, controllerServices.Inserir);
router.put(
  "/services/:id_service",
  jwt.ValidateToken,
  controllerServices.Editar
);
router.delete(
  "/services/:id_service",
  jwt.ValidateToken,
  controllerServices.Excluir
);
router.get(
  "/services/:id_service/services",
  jwt.ValidateToken,
  controllerServices.ListarServices
);

// Service Tracker
router.get("/tracker", jwt.ValidateToken, controllerTracker.Listar);

// History
router.get("/history", jwt.ValidateToken, controllerHistory.Listar);

// Rotas do Admin
router.post("/admin/register", controllerUser.InserirAdmin);
router.post("/admin/login", controllerUser.LoginAdmin);
router.get(
  "/admin/appointments",
  jwt.ValidateToken,
  controllerAppointment.Listar
);
router.get("/admin/users", controllerUser.Listar);
router.get(
  "/admin/appointments/:id_appointment",
  controllerAppointment.ListarId
);
router.post("/admin/appointments", controllerAppointment.InserirAdmin);
router.put(
  "/admin/appointments/:id_appointment",
  controllerAppointment.EditarAdmin
);

export default router;
