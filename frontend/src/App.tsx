import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageUpload } from './components/ImageUpload.js';
import { SolutionGuide } from './components/SolutionGuide.js';
import { LoadingSpinner } from './components/LoadingSpinner.js';
import { ErrorAlert } from './components/ErrorAlert.js';
import { useImageAnalysis } from './hooks/useImageAnalysis.js';
import { useGuidance } from './hooks/useGuidance.js';
import type { AnalysisResult } from './types/index.js';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showError, setShowError] = useState(false);

  const { analyzeImage, loading: analyzing, error: analysisError } = useImageAnalysis();
  const { fetchGuidance, loading: guidanceLoading, guidance, error: guidanceError } = useGuidance();

  const handleImageSelected = async (base64: string) => {
    try {
      const result = await analyzeImage(base64);
      setAnalysisResult(result);
      if (result.matchedProblemId) {
        await handleNextStep(result.matchedProblemId, 1);
      }
    } catch (error) {
      setShowError(true);
      console.error('Image analysis failed:', error);
    }
  };

  const handleNextStep = async (problemId: string, step: number) => {
    try {
      await fetchGuidance(problemId, step);
      setCurrentStep(step + 1);
    } catch (error) {
      setShowError(true);
      console.error('Guidance fetch failed:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* ヘッダー */}
      <motion.header
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Solvy
              </h1>
              <p className="text-sm text-gray-600">高校数学の学習支援アプリ</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* タイトルセクション */}
          <motion.section variants={itemVariants} className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              つまづいた問題を解決しよう
            </h2>
            <p className="text-gray-600 text-lg">
              ノートの写真をアップロードすると、段階的な解法ガイダンスが得られます
            </p>
          </motion.section>

          {/* エラーアラート */}
          {showError && (analysisError || guidanceError) && (
            <motion.div variants={itemVariants}>
              <ErrorAlert
                message={analysisError || guidanceError || '予期しないエラーが発生しました'}
                onDismiss={() => setShowError(false)}
              />
            </motion.div>
          )}

          {/* メインコンテナ */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8">
            {/* 画像アップロード */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">ステップ 1: 写真をアップロード</h3>
              <ImageUpload onImageSelected={handleImageSelected} isLoading={analyzing} />
              {analysisResult && (
                <motion.div
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">認識されたテキスト:</span> {analysisResult.recognizedText}
                  </p>
                  {analysisResult.formulas.length > 0 && (
                    <p className="text-sm text-blue-700 mt-2">
                      <span className="font-semibold">数式:</span> {analysisResult.formulas.join(', ')}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* ガイダンス */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">ステップ 2: 解法ガイダンス</h3>
              {guidance ? (
                <SolutionGuide
                  guidance={guidance}
                  onNextStep={() =>
                    handleNextStep(analysisResult?.matchedProblemId || '1', currentStep)
                  }
                  isLoading={guidanceLoading}
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-600">
                  <p className="text-lg mb-2">📝</p>
                  <p>画像をアップロードするとガイダンスが表示されます</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* ローディングスピナー */}
      {(analyzing || guidanceLoading) && (
        <LoadingSpinner message={analyzing ? '画像を解析中...' : 'ガイダンスを生成中...'} />
      )}

      {/* フッター */}
      <motion.footer
        className="border-t border-gray-200 bg-gray-50 mt-20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2024 Solvy. 高校数学の学習をサポートします。</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
