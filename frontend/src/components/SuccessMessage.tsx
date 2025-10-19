import { motion } from 'framer-motion';

interface SuccessMessageProps {
  message: string;
  icon?: string;
}

export const SuccessMessage = ({ message, icon = '✨' }: SuccessMessageProps) => {
  return (
    <motion.div
      className="bg-green-50 border border-green-200 rounded-xl p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <p className="text-green-700 font-medium">{message}</p>
      </div>
    </motion.div>
  );
};
