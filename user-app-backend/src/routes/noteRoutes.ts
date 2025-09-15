import { Router } from 'express';
import * as noteController from '../controllers/noteController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, noteController.getNotes);
router.post('/', protect, noteController.createNote);
router.put('/:id', protect, noteController.updateNote);
router.delete('/:id', protect, noteController.deleteNote);

export default router;
