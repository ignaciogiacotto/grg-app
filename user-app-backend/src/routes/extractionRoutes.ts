import { Router } from 'express';
import * as extractionController from '../controllers/extractionController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', extractionController.handleCreateExtraction);
router.get('/', extractionController.handleGetExtractions);
router.patch('/:id', extractionController.handleUpdateExtraction);
router.delete('/', extractionController.handleArchiveAllCompleted); // Route to archive all completed

export default router;
