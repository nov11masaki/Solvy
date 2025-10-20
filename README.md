# Solvy - 高校数学学習支援アプリ

シンプルで保守しやすいPython + HTML/CSS/JavaScriptで構築された、高校数学の学習支援アプリケーションです。

## 📚 特徴

- **シンプルな構成**: React不要、バニラJavaScriptで実装
- **Python Flask**: 軽量で理解しやすいバックエンド
- **画像アップロード**: 数学問題の画像をドラッグ&ドロップ
- **OCR解析**: 問題文と数式を認識（拡張可能）
- **ステップバイステップ**: 段階的な解答ガイダンス
- **モダンUI**: グラデーション背景とアニメーション付き

## 🚀 クイックスタート

### 必要な環境

- Python 3.8以上
- pip

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/nov11masaki/Solvy.git
cd Solvy

# 依存パッケージをインストール
pip install -r requirements.txt

# 環境変数を設定（オプション）
cp .env.example .env
# .env ファイルを編集してOpenAI APIキーなどを設定
```

### 起動

```bash
# アプリケーションを起動
python app.py
```

ブラウザで http://localhost:5000 を開きます。

## 📁 プロジェクト構造

```
Solvy/
├── app.py                 # Flaskメインアプリケーション
├── requirements.txt       # Python依存パッケージ
├── .env.example          # 環境変数サンプル
├── templates/
│   └── index.html        # メインHTMLページ
├── static/
│   ├── css/
│   │   └── style.css     # スタイルシート
│   └── js/
│       └── app.js        # フロントエンドJavaScript
└── uploads/              # アップロード画像保存先
```

## 🎯 使い方

1. **画像をアップロード**: 
   - 数学問題が書かれた画像をドラッグ&ドロップ
   - またはクリックして画像を選択

2. **解析を実行**:
   - 「🔍 画像を解析」ボタンをクリック
   - 問題文と数式が認識されます

3. **ガイダンスを確認**:
   - 右側にステップバイステップのガイダンスが表示
   - 「次のステップ →」で進み、「← 前のステップ」で戻る

## 🛠️ カスタマイズと拡張

### 新しい問題を追加

`app.py` の `PROBLEMS` 辞書に問題を追加:

```python
PROBLEMS = {
    "your_problem_id": {
        "id": "your_problem_id",
        "title": "問題のタイトル",
        "description": "問題の説明",
        "level": "high-school",
        "steps": [
            {
                "step": 1,
                "hint": "ヒント",
                "explanation": "解説",
                "formula": "公式（オプション）"
            },
            # 追加のステップ...
        ]
    }
}
```

### OCR機能の実装

実際のOCR機能を実装する場合:

1. Tesseract OCRをインストール:
```bash
pip install pytesseract
```

2. `app.py` の `analyze_image()` 関数を更新:
```python
import pytesseract

# analyze_image() 関数内
text = pytesseract.image_to_string(image, lang='jpn')
```

### OpenAI統合

AIによる解答生成を実装する場合:

1. `.env` ファイルにAPIキーを設定
2. `app.py` で OpenAI APIを使用:

```python
import openai
openai.api_key = os.getenv('OPENAI_API_KEY')

# get_guidance() 関数で動的にガイダンスを生成
```

## 🎨 UIカスタマイズ

`static/css/style.css` のCSS変数を変更:

```css
:root {
    --primary-color: #0ea5e9;    /* メインカラー */
    --secondary-color: #8b5cf6;  /* アクセントカラー */
    --bg-color: #f8fafc;         /* 背景色 */
}
```

## 📝 開発のヒント

### デバッグモード

```bash
# Flaskのデバッグモードで起動（コード変更時に自動リロード）
export FLASK_DEBUG=True
python app.py
```

### ファイル構造の理解

- **app.py**: すべてのバックエンドロジック（ルーティング、API、データ）
- **templates/index.html**: HTMLマークアップ
- **static/css/style.css**: すべてのスタイル定義
- **static/js/app.js**: すべてのフロントエンドロジック（イベント、API呼び出し、DOM操作）

### コードの保守性

- **単一責任**: 各関数は1つの明確な役割
- **コメント**: 複雑なロジックには日本語コメント
- **命名**: わかりやすい変数名と関数名
- **ファイル分割**: 機能ごとにファイルを分けて管理

## 🔧 トラブルシューティング

### ポートが使用中

```bash
# ポートを変更する場合は app.py を編集
app.run(debug=True, host='0.0.0.0', port=8000)  # ポート5000→8000
```

### 画像アップロードエラー

- ファイルサイズ上限: 16MB
- 対応形式: jpg, png, gif, bmp

### 依存パッケージエラー

```bash
# 依存パッケージを再インストール
pip install --upgrade -r requirements.txt
```

## 📄 ライセンス

MIT License

## 👤 作成者

nov11masaki

## 🤝 コントリビューション

プルリクエストを歓迎します！バグ報告や機能要望はIssuesでお願いします。

---

**シンプルで保守しやすいコードを心がけています。質問があればお気軽にどうぞ！**
