import { Router } from "express";
import * as providerController from "../controllers/providerController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect, providerController.getProviders);
router.post("/", protect, providerController.createProvider);
router.put("/:day", protect, providerController.updateProvider);

export default router;
