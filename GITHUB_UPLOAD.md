# GitHub へのアップロード手順

## 前提条件
1. GitHub アカウントが必要です
2. SSH キーが設定済みか、HTTPS + Personal Access Token が必要

## 手順

### 方法 1: GitHub Web UI でリポジトリを作成 (推奨)

1. https://github.com/new にアクセス
2. Repository name: `Solvy`
3. Description: `高校数学学習支援アプリ - Math tutoring app for high school students`
4. Public を選択
5. "Create repository" をクリック

### 方法 2: GitHub CLI で作成

```bash
# GitHub CLI をインストール (brew install gh)
gh repo create Solvy --public --source=. --remote=origin --push
```

### 方法 3: コマンドラインで HTTP 認証

```bash
# Personal Access Token (https://github.com/settings/tokens) を生成
cd /Users/shimizumasaki/Solvy

# リモート URL を更新
git remote set-url origin https://<GitHub ユーザー名>:<Personal Access Token>@github.com/nov11masaki/Solvy.git

# プッシュ
git push -u origin main
```

## 完了後

```bash
# リポジトリの URL を確認
git remote -v

# ブラウザで確認
open https://github.com/nov11masaki/Solvy
```

## トラブルシューティング

### SSH キーエラーの場合
```bash
# SSH キーを生成
ssh-keygen -t ed25519 -C "your_email@example.com"

# キーを GitHub に登録
# https://github.com/settings/keys
```

### Personal Access Token の作成
1. https://github.com/settings/tokens にアクセス
2. "Generate new token"
3. Scopes: `repo` を選択
4. Generate token してコピー
