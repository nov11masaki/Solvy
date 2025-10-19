interface AnalysisResult {
  recognizedText: string;
  formulas: string[];
  matchedProblemId?: string;
  confidence: number;
  rawOCRData: string;
}

interface GuidanceResponse {
  currentStep: number;
  totalSteps: number;
  hint: string;
  explanation: string;
  nextStepPreparation: string;
}

export class AnalysisService {
  constructor() {
    // OpenAI API 初期化（実装例）
    // 本番では OpenAI SDK を使用
  }

  async analyzeNotebookImage(imageBase64: string, _problemType?: string): Promise<AnalysisResult> {
    try {
      // 実装例：Vision APIを使用してOCR処理
      // 実際の実装ではTesseract.jsやCloudVisionを使用します
      
      // ここではモック実装
      const mockResult: AnalysisResult = {
        recognizedText: '星形五角形の内角の和を求めよ',
        formulas: ['内角の和', '5つの三角形'],
        matchedProblemId: '1',
        confidence: 0.95,
        rawOCRData: imageBase64.substring(0, 50) + '...',
      };

      return mockResult;
    } catch (error) {
      throw new Error(`Image analysis failed: ${String(error)}`);
    }
  }

  async generateGuidance(
    _problemId: string,
    currentStep: number,
    _studentAnswer?: string
  ): Promise<GuidanceResponse> {
    try {
      // OpenAI APIを使用してガイダンスを生成
      // 実装例
      const guidance: GuidanceResponse = {
        currentStep,
        totalSteps: 4,
        hint: 'その通り！では次に、各三角形の内角の和について考えてみましょう。',
        explanation: '三角形の内角の和は常に180°です。これは平面幾何学の基本定理です。',
        nextStepPreparation: '次は、5つの三角形の全内角の合計を計算します。',
      };

      return guidance;
    } catch (error) {
      throw new Error(`Guidance generation failed: ${String(error)}`);
    }
  }
}
