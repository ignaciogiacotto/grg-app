import { Router } from 'express';
import * as tagController from '../controllers/tagController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, tagController.getTags);
router.post('/', protect, tagController.createTag);

export default router;
