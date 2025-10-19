import React from 'react';
import { motion } from 'framer-motion';
import type { GuidanceResponse } from '../types/index.js';

interface SolutionGuideProps {
  guidance: GuidanceResponse;
  onNextStep: () => void;
  isLoading?: boolean;
}

export const SolutionGuide: React.FC<SolutionGuideProps> = ({
  guidance,
  onNextStep,
  isLoading = false,
}) => {
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* プログレスバー */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">解答進行状況</span>
          <span className="text-sm font-semibold text-primary-600">
            ステップ {guidance.currentStep} / {guidance.totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(guidance.currentStep / guidance.totalSteps) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* ヒントセクション */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl p-4 border border-primary-200"
      >
        <h3 className="text-sm font-semibold text-primary-900 mb-2">💡 ヒント</h3>
        <p className="text-primary-800">{guidance.hint}</p>
      </motion.div>

      {/* 説明セクション */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-4 border border-gray-200 shadow-soft"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-2">📖 解説</h3>
        <p className="text-gray-700 leading-relaxed">{guidance.explanation}</p>
      </motion.div>

      {/* 次のステップ準備 */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-accent-50 to-accent-100/50 rounded-xl p-4 border border-accent-200"
      >
        <h3 className="text-sm font-semibold text-accent-900 mb-2">🎯 次のステップ</h3>
        <p className="text-accent-800">{guidance.nextStepPreparation}</p>
      </motion.div>

      {/* ボタン */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNextStep}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-medium"
      >
        {isLoading ? '読み込み中...' : '次のステップに進む'}
      </motion.button>
    </motion.div>
  );
};
