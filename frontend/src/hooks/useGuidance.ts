import { useState, useCallback } from 'react';
import { analysisAPI } from '../utils/api.js';
import type { GuidanceResponse } from '../types/index.js';

export const useGuidance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);

  const fetchGuidance = useCallback(
    async (problemId: string, currentStep: number, studentAnswer?: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await analysisAPI.getGuidance(problemId, currentStep, studentAnswer);
        setGuidance(result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'ガイダンス取得に失敗しました';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { fetchGuidance, loading, error, guidance };
};
