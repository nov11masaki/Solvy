import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { problemRoutes } from './routes/problem.routes.js';
import { analysisRoutes } from './routes/analysis.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ルート
app.use('/api/problems', problemRoutes);
app.use('/api/analysis', analysisRoutes);

// ヘルスチェック
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// エラーハンドリング
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
