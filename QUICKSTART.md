# 🚀 Solvy クイックスタートガイド

このガイドに従って、Solvy を数分で起動できます。

## 📋 前提条件

- **Node.js** 18.0.0 以上 ([ダウンロード](https://nodejs.org/))
- **npm** 9.0.0 以上 (Node.js に付属)
- **OpenAI API キー** ([取得方法](https://platform.openai.com/api-keys))

## ⚡ 5 ステップで起動

### ステップ 1: セットアップスクリプトを実行

```bash
cd /Users/shimizumasaki/Solvy
chmod +x setup.sh
./setup.sh
```

このスクリプトが自動的に:
- ✅ 環境変数テンプレートを作成
- ✅ 依存パッケージをインストール
- ✅ 開発環境を初期化

### ステップ 2: 環境変数を設定

#### バックエンド (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sk-xxxxxxxxxxxx  # ← あなたの OpenAI API キーを入力
MONGODB_URL=mongodb://localhost:27017/solvy
```

#### フロントエンド (`frontend/.env.local`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxx  # ← あなたの OpenAI API キーを入力
```

> 💡 **OpenAI API キーの取得方法**:
> 1. https://platform.openai.com/account/api-keys にアクセス
> 2. 「Create new secret key」をクリック
> 3. キーをコピー

### ステップ 3: 開発サーバーを起動

```bash
npm run dev
```

以下の出力が表示されます:

```
> solvy-monorepo@1.0.0 dev
> concurrently "npm run dev --workspace=backend" "npm run dev --workspace=frontend"

🚀 Server is running on http://localhost:5000
✨ Frontend is running on http://localhost:5173
```

### ステップ 4: ブラウザで確認

以下の URL にアクセス:

- **フロントエンド**: [http://localhost:5173](http://localhost:5173)
- **バックエンド API**: [http://localhost:5000/health](http://localhost:5000/health)

### ステップ 5: 試す! 🎉

1. **ノート画像をアップロード** (または、ブラウザコンソールでテスト画像を生成)
2. **OCR で認識** されたテキストを確認
3. **解答ガイダンス** を表示
4. **ステップを進める** - 段階的な解説を体験

## 🎨 UI プレビュー

起動後、以下の画面が表示されます:

```
┌─────────────────────────────────────────────────┐
│ 📚 Solvy - 高校数学の学習支援                      │
├─────────────────────────────────────────────────┤
│                                                  │
│ つまづいた問題を解決しよう                         │
│ ノートの写真をアップロードすると、               │
│ 段階的な解法ガイダンスが得られます               │
│                                                  │
├─────────────────────────────────────────────────┤
│ ステップ 1: 写真をアップロード                   │
│  ┌─────────────────────────────────────────┐   │
│  │  📸 ノートの写真をアップロード          │   │
│  │  ドラッグ&ドロップするか、              │   │
│  │  クリックして選択                      │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│ ステップ 2: 解法ガイダンス                       │
│  (画像アップロード後に表示)                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 🔍 トラブルシューティング

### ❌ `npm: command not found`

```bash
# Node.js を再インストール
# https://nodejs.org/ からダウンロード
```

### ❌ `port 5000 is already in use`

```bash
# 別のポートで実行
PORT=3001 npm run dev --workspace=backend
```

### ❌ `Cannot find module 'react'`

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

### ❌ `OPENAI_API_KEY is not defined`

```bash
# 環境変数ファイルを確認
cat backend/.env        # OPENAI_API_KEY が設定されているか確認
cat frontend/.env.local # OPENAI_API_KEY が設定されているか確認
```

### ❌ API が 401 エラー

```bash
# OpenAI API キーが正しいか確認
# https://platform.openai.com/account/api-keys で確認
# キーの先頭が "sk-" か確認
```

## 📚 よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# Linting
npm run lint

# バックエンドのみ起動
npm run dev --workspace=backend

# フロントエンドのみ起動
npm run dev --workspace=frontend
```

## 📖 ドキュメント

| ファイル | 説明 |
|---------|------|
| [README.md](./README.md) | プロジェクト概要 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 開発ガイド・API 仕様 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | アーキテクチャ詳細 |
| [COMPLETION.md](./COMPLETION.md) | 実装概要 |

## 🎓 学習パス

### 初級 (1 時間)
1. ✅ 起動確認
2. ✅ UI をいじってみる
3. ✅ コンポーネントの構造を理解

### 中級 (3-5 時間)
1. ✅ API エンドポイントを理解
2. ✅ 新しい問題を追加してみる
3. ✅ UI コンポーネントをカスタマイズ

### 上級 (1-2 週間)
1. ✅ OCR 認識精度の向上
2. ✅ OpenAI API との連携
3. ✅ MongoDB への移行

## 🚀 本番デプロイ

```bash
# ビルド
npm run build

# 本番サーバーにデプロイ
# Vercel (フロントエンド)
# Railway / Heroku (バックエンド)
```

## ❓ よくある質問

### Q1: 画像認識がうまくいかない

**A**: 以下を確認してください
- 画像が明確で読み取りやすいか
- 数式が手書きではなく印刷されているか
- 照度が十分か

### Q2: OpenAI API 呼び出し数が多い

**A**: 以下の対応を検討
- レート制限の実装
- 結果をキャッシング
- 無料トライアルから有料プランへ移行

### Q3: ローカルで AI なしで動かしたい

**A**: `analysis.service.ts` のモック実装を使用
- 既に `generateGuidance()` にモック実装があります

## 📞 サポート

質問・問題がある場合:
1. [DEVELOPMENT.md](./DEVELOPMENT.md) の「トラブルシューティング」を確認
2. GitHub Issues で質問
3. ログを確認 (`console.log` で除算)

## 🎉 おめでとうございます!

これであなたの Solvy は起動しました! 🚀

楽しい開発を! 📚✨

---

**Last Updated**: 2025年10月19日
