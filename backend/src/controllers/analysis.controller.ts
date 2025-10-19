import { Request, Response } from 'express';
import { AnalysisService } from '../services/analysis.service.js';

export class AnalysisController {
  private analysisService: AnalysisService;

  constructor() {
    this.analysisService = new AnalysisService();
  }

  async analyzeImage(req: Request, res: Response): Promise<void> {
    try {
      const { imageBase64, problemType } = req.body;

      if (!imageBase64) {
        res.status(400).json({ success: false, error: 'Image data is required' });
        return;
      }

      const result = await this.analysisService.analyzeNotebookImage(imageBase64, problemType);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  }

  async getGuidance(req: Request, res: Response): Promise<void> {
    try {
      const { problemId, currentStep, studentAnswer } = req.body;

      const guidance = await this.analysisService.generateGuidance(
        problemId,
        currentStep,
        studentAnswer
      );
      res.json({ success: true, data: guidance });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  }
}
