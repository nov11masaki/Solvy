import { Router, Request, Response } from 'express';
import { ProblemController } from '../controllers/problem.controller.js';

const router = Router();
const controller = new ProblemController();

// 問題一覧取得
router.get('/', (req: Request, res: Response) => controller.listProblems(req, res));

// 特定の問題を取得
router.get('/:id', (req: Request, res: Response) => controller.getProblem(req, res));

// 問題を登録
router.post('/', (req: Request, res: Response) => controller.createProblem(req, res));

export const problemRoutes = router;
