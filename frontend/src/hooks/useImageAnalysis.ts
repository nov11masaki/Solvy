import { useState, useCallback } from 'react';
import { analysisAPI } from '../utils/api.js';
import type { AnalysisResult } from '../types/index.js';

export const useImageAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeImage = useCallback(
    async (imageBase64: string, problemType?: string) => {
      try {
        setLoading(true);
        setError(null);
        const analysisResult = await analysisAPI.analyzeImage(imageBase64, problemType);
        setResult(analysisResult);
        return analysisResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '画像解析に失敗しました';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { analyzeImage, loading, error, result };
};
