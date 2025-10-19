# Solvy - アーキテクチャドキュメント

## 概要

Solvy は、フロントエンド・バックエンド・共有型を分離した**モノレポ構成**を採用しています。この設計により、スケーラビリティ、保守性、型安全性を実現しています。

## システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                    ユーザーブラウザ                        │
│                  (React + Vite アプリ)                    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP(S)
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    バックエンドAPI                         │
│              (Express + TypeScript)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Controller  │→ │   Service    │→ │    Model     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└────────────────────────┬────────────────────────────────┘
         │              │              │
         ↓              ↓              ↓
   OpenAI API    Problem DB    Image Storage
```

## 層別アーキテクチャ

### 1. プレゼンテーション層 (Frontend)

**責務**: ユーザーインターフェースと相互作用

```typescript
// コンポーネント階層
App
├── ImageUpload
├── SolutionGuide
├── LoadingSpinner
├── ErrorAlert
└── SuccessMessage

// カスタムフック
useImageAnalysis()
useGuidance()

// ユーティリティ
api.ts (Axios インスタンス)
```

### 2. 業務ロジック層 (Backend Services)

**責務**: ビジネスロジックの実装

```typescript
// ProblemService
- listAllProblems()
- getProblemById()
- createProblem()
- searchProblems()

// AnalysisService
- analyzeNotebookImage()
- generateGuidance()
```

### 3. データアクセス層 (Models)

**責務**: データモデルの定義

```typescript
// Problem モデル
- ID、タイトル、説明
- 難易度、カテゴリ、定理
- 解法ステップ、キーワード

// StudentProgress モデル
- 学習者ID、問題ID
- 現在のステップ、試行回数
```

### 4. 外部インテグレーション層

**責務**: 外部サービスとの連携

- **OpenAI API**: ガイダンス生成
- **ファイルストレージ**: 画像保存
- **OCR エンジン**: Tesseract.js

## データフロー

### 画像アップロード〜ガイダンス提供フロー

```
1. ユーザーが画像をアップロード
   │
   ↓
2. フロントエンドで Base64 変換
   │
   ↓
3. POST /api/analysis/upload
   │
   ↓
4. バックエンドで OCR 処理
   ├─ Tesseract.js で画像からテキスト抽出
   ├─ 数式パターンを検出
   └─ キーワードを抽出
   │
   ↓
5. 問題データベースでマッチング
   │
   ↓
6. AnalysisResult を返却
   │
   ↓
7. フロントエンドで表示
   ├─ 認識されたテキスト
   ├─ 検出された数式
   └─ マッチ度 (confidence)
   │
   ↓
8. ユーザーが問題確認
   │
   ↓
9. POST /api/analysis/guidance (Step 1)
   │
   ↓
10. OpenAI API でガイダンス生成
    ├─ 現在のステップに合わせたヒント
    ├─ 解説
    └─ 次のステップの準備
    │
    ↓
11. GuidanceResponse を返却
    │
    ↓
12. フロントエンドでアニメーション表示
```

## コンポーネント設計

### Atomic Design 原則

```
atoms/          # 基本要素 (Button, Input)
molecules/      # 結合要素 (Form, Card)
organisms/      # 複合要素 (Header, Footer)
pages/          # ページコンポーネント
```

### 一例: ImageUpload コンポーネント

```typescript
interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  isLoading?: boolean;
}

// 責務
- ドラッグ&ドロップ領域の管理
- ファイル選択ダイアログ
- Base64 変換
- プレビュー表示
- ローディング状態
```

## API インターフェース

### リクエスト/レスポンス構造

```typescript
// 統一されたレスポンス形式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// エラーハンドリング
{
  success: false,
  error: "Image analysis failed"
}
```

### エンドポイント詳細

#### POST /api/analysis/upload

```
Request Body:
{
  imageBase64: string;    // Base64 エンコードされた画像
  problemType?: string;   // 問題の種類 (オプション)
}

Response:
{
  success: true,
  data: {
    recognizedText: "星形五角形の内角の和を求めよ",
    formulas: ["∠A", "∠B", "..."],
    matchedProblemId: "1",
    confidence: 0.95,
    rawOCRData: "..."
  }
}
```

#### POST /api/analysis/guidance

```
Request Body:
{
  problemId: string;        // 問題ID
  currentStep: number;      // 現在のステップ
  studentAnswer?: string;   // 学習者の回答 (オプション)
}

Response:
{
  success: true,
  data: {
    currentStep: 1,
    totalSteps: 4,
    hint: "5つの三角形に分割してみましょう",
    explanation: "星形五角形は...",
    nextStepPreparation: "各三角形の内角の合計を計算します"
  }
}
```

## 型安全性戦略

### 共有型定義

`shared/types.ts` に共有型を一元管理

```typescript
// フロントエンドで使用
import type { Problem } from '../types/index';

// バックエンドで使用
import { Problem } from '../models/problem.model';
```

### ジェネリクス活用

```typescript
// APIクライアント
async function apiCall<T>(url: string): Promise<T> {
  const response = await axios.get<ApiResponse<T>>(url);
  return response.data.data;
}
```

## エラーハンドリング

### フロントエンド

```typescript
try {
  const result = await analyzeImage(imageBase64);
  setResult(result);
} catch (error) {
  const message = error instanceof Error ? error.message : '不明なエラー';
  setShowError(true);
}
```

### バックエンド

```typescript
// グローバルエラーハンドリング
app.use(errorHandler);

// カスタムエラー
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
```

## パフォーマンス最適化

### フロントエンド
- **コード分割**: ルートベースで動的インポート
- **画像最適化**: Sharp で圧縮
- **メモ化**: `useCallback` で不要な再レンダリング回避

### バックエンド
- **キャッシング**: 問題データをメモリにキャッシュ
- **レート制限**: OpenAI API のコール制限
- **非同期処理**: 重い処理は Promise で実行

## セキュリティ考慮事項

### 認証・認可
- API キーは環境変数で管理
- CORS で不正なリクエストをブロック
- 入力値の検証とサニタイゼーション

### データ保護
- HTTPS 通信を強制
- センシティブ情報をログに記録しない
- ファイルアップロード時のファイルタイプ検証

## スケーラビリティ計画

### 現在の構成
- **メモリベースストレージ**: 開発・テスト向け
- **シングルインスタンス**: 小規模利用向け

### 拡張への考慮
- **データベース移行**: MongoDB への移行パス
- **キャッシング層**: Redis の導入
- **マイクロサービス化**: 機能ごとのサービス分離

```
現状                  →                拡張後
┌─────────────┐      ┌──────────────────────────────┐
│ In-Memory   │  ⟹   │  MongoDB + Redis + ElasticS...│
│ Single App  │      │  Microservices Architecture   │
└─────────────┘      └──────────────────────────────┘
```

## デプロイメントアーキテクチャ

### 開発環境
```
localhost:5173  (フロントエンド Vite)
localhost:5000  (バックエンド Express)
```

### 本番環境 (推奨)
```
┌─────────────────────────────────────┐
│        CloudFlare / CDN             │
└───────────────┬─────────────────────┘
                │
        ┌───────┴────────┐
        ↓                ↓
    Vercel        Railway / Heroku
  (Frontend)       (Backend)
```

## 開発ワークフロー

### ブランチ戦略 (Git Flow)
```
main (本番)
  ↑
release-1.0.0
  ↑
develop (開発)
  ↑ (feature branches)
feature/ocr-improvement
feature/ui-redesign
```

### コミットメッセージ
```
feat: 新機能の説明
fix: バグ修正の説明
docs: ドキュメント更新
test: テスト追加
refactor: リファクタリング
```

## 監視とロギング

### メトリクス収集
- API レスポンス時間
- OCR 認識精度
- エラーレート

### ログレベル
```
DEBUG   - 詳細な開発情報
INFO    - 重要なイベント
WARN    - 警告情報
ERROR   - エラー
FATAL   - 致命的エラー
```

## テスト戦略

### ユニットテスト
```typescript
// サービス層のテスト
describe('ProblemService', () => {
  it('should return all problems', async () => {
    const problems = await problemService.listAllProblems();
    expect(problems).toBeDefined();
  });
});
```

### 統合テスト
```typescript
// API エンドポイントのテスト
describe('POST /api/analysis/upload', () => {
  it('should analyze image', async () => {
    const response = await request(app)
      .post('/api/analysis/upload')
      .send({ imageBase64: '...' });
    expect(response.status).toBe(200);
  });
});
```

## 今後の改善予定

1. **マイクロサービス化**: 解析とガイダンス生成の分離
2. **リアルタイム通信**: WebSocket で段階的ガイダンス
3. **機械学習統合**: 学習者のパターン認識
4. **キャッシング戦略**: Redis の導入

---

**Documentation Version**: 1.0  
**Last Updated**: 2025年10月19日
