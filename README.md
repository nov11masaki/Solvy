# Solvy - 高校数学学習支援アプリ

高校生が数学の問題を解く際に、つまづいた段階でノートの写真をアップロードすると、OCR技術と問題解析を用いて、学習者の意図を汲んだ段階的な解法支援を行うアプリケーションです。

## プロジェクト構成

```
Solvy/
├── frontend/          # React + TypeScript フロントエンド
├── backend/           # Node.js + Express バックエンド
├── shared/            # 共有型定義とユーティリティ
└── README.md
```

## 主な機能

- 📸 **ノート画像認識**: Tesseract.jsを用いたOCR処理
- 📐 **数式認識**: 数式画像から自動解析
- 🎯 **問題照合**: 事前登録されたカリキュラムに基づく問題マッチング
- 📝 **段階的ガイダンス**: 学習者の理解度に応じた解法支援
- ✨ **モダンUI**: Tailwind CSS + Framer Motionによる洗練されたデザイン

## 技術スタック

### フロントエンド
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Tesseract.js (OCR)

### バックエンド
- Node.js
- Express
- TypeScript
- MongoDB (問題データベース)
- OpenAI API (問題解析・ガイダンス生成)

## セットアップ手順

### バックエンド
```bash
cd backend
npm install
npm run dev
```

### フロントエンド
```bash
cd frontend
npm install
npm run dev
```

## 環境変数設定

`.env.local` ファイルを作成してください：

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_OPENAI_API_KEY=your_api_key
```

## 開発ガイドライン

- TypeScriptの型安全性を徹底
- コンポーネント設計はAtomic Design原則に従う
- UIコンポーネントはstories.tsxで可視化
- 双方向型チェック体制を構築

## 🚀 クイックスタート

### 前提条件
- Node.js 18.0.0 以上
- npm または yarn
- OpenAI API キー

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd Solvy

# セットアップスクリプトで自動設定
chmod +x setup.sh
./setup.sh
```

### 開発サーバーの起動

```bash
npm run dev
```

フロントエンドは `http://localhost:5173` で、バックエンドは `http://localhost:5000` で起動します。

## 📖 使い方

1. **画像をアップロード**: つまづいた問題のノートの写真をアップロード
2. **自動認識**: OCR で問題テキストと数式を認識
3. **問題マッチング**: 事前登録の問題データベースと照合
4. **ガイダンス取得**: AI による段階的な解法支援を表示
5. **段階的解答**: ヒントと解説を参考に自分で解く

## 🎨 デザイン特徴

- **シンプルで直感的**: 中学生が使いやすいレイアウト
- **視覚的フィードバック**: Framer Motion による滑らかなアニメーション
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応
- **アクセシビリティ**: WCAG 2.1 に準拠

## 📚 学習支援のアプローチ

スキャフォーディング、メタコグニション、段階的複雑化に基づいた教育学的なアプローチを採用しています。

## 🔮 今後の拡張予定

- [ ] 高精度な数式認識 (MathPix API 統合)
- [ ] 学習者の進捗履歴管理
- [ ] 動画解説の統合
- [ ] リアルタイム協調学習機能

## 📝 ライセンス

MIT License

## 👥 貢献

プルリクエストを歓迎します！

詳細は `DEVELOPMENT.md` を参照してください。

---

**Version**: 1.0.0  
**Last Updated**: 2025年10月19日
