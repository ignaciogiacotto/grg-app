
import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { getDailyProfitReport, getEnvelopeSummaryReport } from '../controllers/reportController';
import { Role } from "../models/userModel";

const router = express.Router();

// @desc   Get daily profit report
// @route  GET /api/reports/daily-profit
// @access Private (Admin, Manager)
router.get(
  '/daily-profit',
  protect,
  authorize(Role.Admin, Role.Manager),
  getDailyProfitReport
);

// @desc   Get envelope summary
// @route  GET /api/reports/envelope-summary
// @access Private (Admin, Manager)
router.get(
  '/envelope-summary',
  protect,
  authorize(Role.Admin, Role.Manager),
  getEnvelopeSummaryReport
);

export default router;
