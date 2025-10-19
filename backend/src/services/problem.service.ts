import { Problem, ProblemLevel } from '../models/problem.model.js';

// メモリベースのデータベース（実装例）
let problems: Problem[] = [
  {
    id: '1',
    title: '星形五角形の内角の和',
    description: '正五角形の頂点を順に結んでできた星形五角形の内角の和を求めよ。',
    level: 'high-school' as ProblemLevel,
    category: 'geometry',
    theorems: ['polygon-angle-sum', 'triangle-angle-sum'],
    solutionSteps: [
      {
        step: 1,
        hint: '星形五角形は5つの三角形で構成されていることに気づきましょう。',
        explanation: '星形五角形の各頂点と中心を結ぶと、5つの三角形ができます。',
      },
      {
        step: 2,
        hint: '各三角形の内角の和は？',
        explanation: '三角形の内角の和は180°です。',
      },
      {
        step: 3,
        hint: '5つの三角形の全内角の和は？',
        explanation: '5 × 180° = 900°',
      },
      {
        step: 4,
        hint: '中心の角度の合計は360°ですね。星形五角形の内角だけを考えましょう。',
        explanation: '星形五角形の内角の和 = 900° - 360° = 540°',
      },
    ],
    keywords: ['星形五角形', '内角の和', 'geometry'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class ProblemService {
  async listAllProblems(): Promise<Problem[]> {
    return problems;
  }

  async getProblemById(id: string): Promise<Problem | null> {
    const problem = problems.find((p) => p.id === id);
    return problem || null;
  }

  async createProblem(problemData: Partial<Problem>): Promise<Problem> {
    const newProblem: Problem = {
      id: String(Date.now()),
      title: problemData.title || '',
      description: problemData.description || '',
      level: problemData.level || 'high-school',
      category: problemData.category || 'general',
      theorems: problemData.theorems || [],
      solutionSteps: problemData.solutionSteps || [],
      keywords: problemData.keywords || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    problems.push(newProblem);
    return newProblem;
  }

  async searchProblems(query: string): Promise<Problem[]> {
    const lowerQuery = query.toLowerCase();
    return problems.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.keywords.some((k: string) => k.toLowerCase().includes(lowerQuery)) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }
}
