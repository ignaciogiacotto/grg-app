import { Router } from "express";
import {
  createCierreKiosco,
  getCierresKiosco,
  getCierreKioscoById,
  updateCierreKiosco,
  deleteCierreKiosco,
} from "../controllers/cierreKioscoController";
import { protect, authorize } from "../middlewares/authMiddleware";
import { Role } from "../models/userModel";
import { validate } from "../middlewares/validationMiddleware";
import { cierreKioscoSchema } from "../schemas/cierreKioscoSchema";

const router = Router();

router
  .route("/")
  .post(protect, authorize(Role.Admin, Role.Manager), validate(cierreKioscoSchema), createCierreKiosco)
  .get(protect, authorize(Role.Admin, Role.Manager), getCierresKiosco);

router
  .route("/:id")
  .get(protect, authorize(Role.Admin, Role.Manager), getCierreKioscoById)
  .put(protect, authorize(Role.Admin, Role.Manager), validate(cierreKioscoSchema), updateCierreKiosco)
  .delete(protect, authorize(Role.Admin, Role.Manager), deleteCierreKiosco);

export default router;
