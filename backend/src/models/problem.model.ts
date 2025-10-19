export type ProblemLevel = 'middle-school' | 'high-school' | 'university';

export interface SolutionStep {
  step: number;
  hint: string;
  explanation: string;
  formula?: string;
  visualDescription?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  level: ProblemLevel;
  category: string;
  theorems: string[];
  solutionSteps: SolutionStep[];
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  videoUrl?: string;
  relatedProblems?: string[];
}

export interface StudentProgress {
  studentId: string;
  problemId: string;
  currentStep: number;
  attempts: number;
  lastUpdated: Date;
  notes: string;
}

export interface GuidanceRequest {
  problemId: string;
  currentStep: number;
  studentResponse: string;
  learningStyle?: 'visual' | 'textual' | 'mixed';
}
