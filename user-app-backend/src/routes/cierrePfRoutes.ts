import { Router } from "express";
import * as cierrePfController from "../controllers/cierrePfController";
import { protect, authorize } from "../middlewares/authMiddleware";
import { Role } from "../models/userModel";

const router = Router();

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
