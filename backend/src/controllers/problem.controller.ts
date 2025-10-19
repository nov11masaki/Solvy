import { Request, Response } from 'express';
import { ProblemService } from '../services/problem.service.js';

export class ProblemController {
  private problemService: ProblemService;

  constructor() {
    this.problemService = new ProblemService();
  }

  async listProblems(_req: Request, res: Response): Promise<void> {
    try {
      const problems = await this.problemService.listAllProblems();
      res.json({ success: true, data: problems });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  }

  async getProblem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const problem = await this.problemService.getProblemById(id);
      if (!problem) {
        res.status(404).json({ success: false, error: 'Problem not found' });
        return;
      }
      res.json({ success: true, data: problem });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  }

  async createProblem(req: Request, res: Response): Promise<void> {
    try {
      const problem = await this.problemService.createProblem(req.body);
      res.status(201).json({ success: true, data: problem });
    } catch (error) {
      res.status(400).json({ success: false, error: String(error) });
    }
  }
}
