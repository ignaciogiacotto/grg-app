import { Router } from "express";
import * as cierrePfController from "../controllers/cierrePfController";
import { protect, authorize } from "../middlewares/authMiddleware";
import { Role } from "../models/userModel";

const router = Router();

// Cierre PF routes
router.post(
  "/",
  protect,
  authorize(Role.Admin, Role.Manager, Role.Employee),
  cierrePfController.createCierrePf
);
router.get(
  "/",
  protect,
  authorize(Role.Admin, Role.Manager, Role.Employee),
  cierrePfController.getCierresPf
);
// Boletas Especiales routes
// Deben estar antes de /:id para que "boletas" no se tome como un id
router.get(
  "/boletas",
  protect,
  authorize(Role.Admin, Role.Manager, Role.Employee),
  cierrePfController.getBoletasEspeciales
);
router.post(
  "/boletas",
  protect,
  authorize(Role.Admin, Role.Manager),
  cierrePfController.createBoletaEspecial
);
router.put(
  "/boletas/:id",
  protect,
  authorize(Role.Admin, Role.Manager),
  cierrePfController.updateBoletaEspecial
);
router.delete(
  "/boletas/:id",
  protect,
  authorize(Role.Admin, Role.Manager),
  cierrePfController.deleteBoletaEspecial
);

// Cierre PF routes by ID
router.get(
  "/:id",
  protect,
  authorize(Role.Admin, Role.Manager, Role.Employee),
  cierrePfController.getCierrePfById
);
router.put(
  "/:id",
  protect,
  authorize(Role.Admin, Role.Manager, Role.Employee),
  cierrePfController.updateCierrePf
);
router.delete(
  "/:id",
  protect,
authorize(Role.Admin, Role.Manager, Role.Employee),
  cierrePfController.deleteCierrePf
);

export default router;
