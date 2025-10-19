import axios, { AxiosInstance } from 'axios';
import type { Problem, AnalysisResult, GuidanceResponse } from '../types/index.js';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const problemAPI = {
  getAll: async (): Promise<Problem[]> => {
    const response = await apiClient.get<{ success: boolean; data: Problem[] }>('/problems');
    return response.data.data;
  },

  getById: async (id: string): Promise<Problem> => {
    const response = await apiClient.get<{ success: boolean; data: Problem }>(`/problems/${id}`);
    return response.data.data;
  },

  create: async (problem: Partial<Problem>): Promise<Problem> => {
    const response = await apiClient.post<{ success: boolean; data: Problem }>(
      '/problems',
      problem
    );
    return response.data.data;
  },
};

export const analysisAPI = {
  analyzeImage: async (imageBase64: string, problemType?: string): Promise<AnalysisResult> => {
    const response = await apiClient.post<{ success: boolean; data: AnalysisResult }>(
      '/analysis/upload',
      { imageBase64, problemType }
    );
    return response.data.data;
  },

  getGuidance: async (
    problemId: string,
    currentStep: number,
    studentAnswer?: string
  ): Promise<GuidanceResponse> => {
    const response = await apiClient.post<{ success: boolean; data: GuidanceResponse }>(
      '/analysis/guidance',
      { problemId, currentStep, studentAnswer }
    );
    return response.data.data;
  },
};

export default apiClient;
