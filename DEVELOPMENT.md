# Solvy 開発ガイド

高校数学学習支援アプリ「Solvy」の開発ガイドです。

## プロジェクト構成

```
Solvy/
├── frontend/          # React + TypeScript フロントエンド
├── backend/           # Node.js + Express バックエンド
├── shared/            # 共有型定義
├── setup.sh          # セットアップスクリプト
└── package.json      # monorepo 設定
```

## セットアップ

### 1. 初期セットアップ

```bash
# リポジトリのクローン後
chmod +x setup.sh
./setup.sh
```

### 2. 環境変数の設定

#### バックエンド (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your-api-key
MONGODB_URL=mongodb://localhost:27017/solvy
```

#### フロントエンド (`frontend/.env.local`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_OPENAI_API_KEY=your-api-key
```

## 開発サーバーの起動

### 両方同時に起動
```bash
npm run dev
```

### バックエンドのみ
```bash
npm run dev --workspace=backend
```

### フロントエンドのみ
```bash
npm run dev --workspace=frontend
```

## ビルド

```bash
npm run build
```

## 型チェック

```bash
npm run type-check
```

## Linting

```bash
npm run lint
```

## アーキテクチャ

### フロントエンド
- **React 18** - UI フレームワーク
- **TypeScript** - 型安全性
- **Vite** - 高速ビルド
- **Tailwind CSS** - スタイリング
- **Framer Motion** - アニメーション
- **Axios** - API 通信

### バックエンド
- **Express** - Web フレームワーク
- **TypeScript** - 型安全性
- **OpenAI API** - 解答ガイダンス生成
- **Multer** - ファイルアップロード
- **Sharp** - 画像処理

## 主要な機能

### 1. 画像認識
- ノート画像から OCR で数式と問題テキストを抽出
- 事前登録された問題とマッチング

### 2. 段階的ガイダンス
- OpenAI API を用いた学習者に最適な解法ガイダンス生成
- 各ステップでのヒントと解説を提供

### 3. モダン UI
- Tailwind CSS による洗練されたデザイン
- Framer Motion による滑らかなアニメーション

## API エンドポイント

### 問題関連
- `GET /api/problems` - 問題一覧取得
- `GET /api/problems/:id` - 特定の問題を取得
- `POST /api/problems` - 問題を登録

### 解析関連
- `POST /api/analysis/upload` - 画像をアップロードして解析
- `POST /api/analysis/guidance` - 解法ガイダンスを取得

## コンポーネント構造

### フロントエンド
```
src/
├── components/        # UI コンポーネント
├── pages/            # ページコンポーネント
├── hooks/            # カスタムフック
├── utils/            # ユーティリティ関数
├── types/            # 型定義
└── App.tsx           # メインアプリケーション
```

### バックエンド
```
src/
├── controllers/      # リクエストハンドラー
├── services/         # ビジネスロジック
├── routes/          # ルート定義
├── models/          # データモデル
├── middleware/      # ミドルウェア
├── utils/           # ユーティリティ
└── index.ts         # エントリーポイント
```

## トラブルシューティング

### ポート競合
```bash
# 別のポートで起動
PORT=3001 npm run dev --workspace=backend
```

### モジュール解決エラー
```bash
# キャッシュをクリア
rm -rf node_modules package-lock.json
npm install
```

### 環境変数が読み込まれない
- ファイル名の確認（`backend/.env` / `frontend/.env.local`）
- サーバーの再起動

## 貢献ガイドライン

1. 機能ブランチを作成
2. TypeScript で型安全に実装
3. Linting を通す
4. プルリクエストを作成

## ライセンス

MIT License

---

質問や問題がある場合は、Issue を作成してください。
