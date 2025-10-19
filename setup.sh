#!/bin/bash

# Solvy プロジェクト セットアップスクリプト

set -e

echo "🚀 Solvy セットアップを開始します..."

# ルートディレクトリ
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# バックエンド設定
echo ""
echo "📦 バックエンドのセットアップ..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ backend/.env を作成しました"
fi

# フロントエンド設定
echo ""
echo "🎨 フロントエンドのセットアップ..."
if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ frontend/.env.local を作成しました"
fi

# 依存関係インストール
echo ""
echo "📥 依存関係をインストール中..."
npm install

echo ""
echo "✨ セットアップが完了しました！"
echo ""
echo "次のコマンドで開発サーバーを起動できます:"
echo "  npm run dev"
echo ""
echo "詳細については README.md をご覧ください。"
