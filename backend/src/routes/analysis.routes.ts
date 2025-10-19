import { Router, Request, Response } from 'express';
import { AnalysisController } from '../controllers/analysis.controller.js';

const router = Router();
const controller = new AnalysisController();

// ノート画像をアップロードして解析
router.post('/upload', (req: Request, res: Response) => controller.analyzeImage(req, res));

// 解法ガイダンスを取得
router.post('/guidance', (req: Request, res: Response) => controller.getGuidance(req, res));

export const analysisRoutes = router;
