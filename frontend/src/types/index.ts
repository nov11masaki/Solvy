export interface Problem {
  id: string;
  title: string;
  description: string;
  level: 'middle-school' | 'high-school' | 'university';
  category: string;
  theorems: string[];
  keywords: string[];
  solutionSteps: SolutionStep[];
  createdAt: string;
}

export interface SolutionStep {
  step: number;
  hint: string;
  explanation: string;
  formula?: string;
  visualDescription?: string;
}

export interface AnalysisResult {
  recognizedText: string;
  formulas: string[];
  matchedProblemId?: string;
  confidence: number;
  rawOCRData: string;
}

export interface GuidanceResponse {
  currentStep: number;
  totalSteps: number;
  hint: string;
  explanation: string;
  nextStepPreparation: string;
}

export interface StudentProgress {
  problemId: string;
  currentStep: number;
  attempts: number;
  notes: string;
}
