import { Router } from "express";
import { validateUser } from "../middlewares/validationMiddleware";
import * as userController from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect, userController.getUsers);
router.get("/:id", protect, userController.getUserById);
router.post("/", protect, validateUser, userController.createUser);
router.put("/:id", protect, validateUser, userController.updateUser);
router.delete("/:id", protect, userController.deleteUser);

export default router;
