/**
 * Solvy - 共有型定義
 * フロントエンドとバックエンド間で共有される型定義
 */

export type ProblemLevel = 'middle-school' | 'high-school' | 'university';
export type LearningStyle = 'visual' | 'textual' | 'mixed';

export interface Problem {
  id: string;
  title: string;
  description: string;
  level: ProblemLevel;
  category: string;
  theorems: string[];
  keywords: string[];
  solutionSteps: SolutionStep[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  videoUrl?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
