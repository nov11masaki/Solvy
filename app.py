#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Solvy - 高校数学学習支援アプリ
シンプルなFlaskバックエンド
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io
import os
import json
from datetime import datetime
from dotenv import load_dotenv

# OpenAI APIのインポート
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("⚠️  OpenAIライブラリがインストールされていません。pip install openai を実行してください。")

load_dotenv()

app = Flask(__name__)
CORS(app)

# 設定
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
UPLOAD_FOLDER = 'uploads'
PROBLEMS_FILE = 'problems_database.json'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# OpenAI設定
if OPENAI_AVAILABLE:
    openai.api_key = os.getenv('OPENAI_API_KEY')
    if not openai.api_key:
        print("⚠️  OPENAI_API_KEYが設定されていません。.envファイルを確認してください。")

# 問題データベースの読み込み
def load_problems():
    """問題データベースをJSONファイルから読み込み"""
    if os.path.exists(PROBLEMS_FILE):
        with open(PROBLEMS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_problems(problems):
    """問題データベースをJSONファイルに保存"""
    with open(PROBLEMS_FILE, 'w', encoding='utf-8') as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)

# 初期問題データ
PROBLEMS = load_problems()
if not PROBLEMS:
    PROBLEMS = {
        "star_pentagon": {
            "id": "star_pentagon",
            "title": "星型五角形の内角の和",
            "description": "星型五角形の5つの頂点における内角の和を求める問題",
            "level": "high-school",
            "category": "図形",
            "keywords": ["五角形", "内角", "図形"],
            "theorems": ["三角形の内角の和", "多角形の外角の和"],
            "steps": [
                {
                    "step": 1,
                    "hint": "星型五角形を三角形に分解してみましょう",
                    "explanation": "星型五角形の内角の和を求めるには、まず図形を三角形に分解します。外側の5つの頂点と、内側で交わる5つの点に着目します。",
                    "formula": "内角の和 = 5つの三角形の内角の和 - 中心の五角形の外角の和"
                },
                {
                    "step": 2,
                    "hint": "三角形の内角の和は180°です",
                    "explanation": "星型五角形は5つの三角形に分解できます。各三角形の内角の和は180°なので、5つで180° × 5 = 900°となります。",
                    "formula": "5 × 180° = 900°"
                },
                {
                    "step": 3,
                    "hint": "中心の五角形の外角の和を考えます",
                    "explanation": "中心にできる五角形の外角の和は、どんな多角形でも360°です。これを900°から引きます。",
                    "formula": "900° - 360° = 540°"
                },
                {
                    "step": 4,
                    "hint": "最終的な答えを確認しましょう",
                    "explanation": "星型五角形の5つの頂点における内角の和は180°です。これは5 × 36° = 180°と覚えることもできます。",
                    "formula": "答え: 180°"
                }
            ],
            "created_at": datetime.now().isoformat()
        }
    }
    save_problems(PROBLEMS)


@app.route('/')
def index():
    """メインページ"""
    return render_template('index.html')


@app.route('/admin')
def admin():
    """管理画面"""
    return render_template('admin.html')


@app.route('/health')
def health():
    """ヘルスチェック"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'openai_available': OPENAI_AVAILABLE
    })


@app.route('/api/problems', methods=['GET'])
def get_problems():
    """問題一覧を取得"""
    return jsonify({
        'success': True,
        'data': list(PROBLEMS.values())
    })


@app.route('/api/problems/<problem_id>', methods=['GET'])
def get_problem(problem_id):
    """特定の問題を取得"""
    problem = PROBLEMS.get(problem_id)
    if problem:
        return jsonify({
            'success': True,
            'data': problem
        })
    return jsonify({
        'success': False,
        'error': 'Problem not found'
    }), 404


@app.route('/api/analysis/upload', methods=['POST'])
def analyze_image():
    """画像を解析（OCRシミュレーション）"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image data provided'
            }), 400
        
        # Base64画像データをデコード
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # 画像サイズを確認
        width, height = image.size
        
        # 簡易的なOCRシミュレーション（実際のOCRは別途実装）
        result = {
            'success': True,
            'data': {
                'recognizedText': '星型五角形の内角の和を求めよ',
                'formulas': ['∠A + ∠B + ∠C + ∠D + ∠E = ?'],
                'matchedProblemId': 'star_pentagon',
                'confidence': 0.85,
                'imageSize': f'{width}x{height}'
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/analysis/guidance', methods=['POST'])
def get_guidance():
    """解答ガイダンスを取得"""
    try:
        data = request.get_json()
        problem_id = data.get('problemId')
        current_step = data.get('currentStep', 0)
        
        problem = PROBLEMS.get(problem_id)
        if not problem:
            return jsonify({
                'success': False,
                'error': 'Problem not found'
            }), 404
        
        if current_step >= len(problem['steps']):
            return jsonify({
                'success': False,
                'error': 'Step out of range'
            }), 400
        
        step_data = problem['steps'][current_step]
        
        result = {
            'success': True,
            'data': {
                'currentStep': current_step + 1,
                'totalSteps': len(problem['steps']),
                'hint': step_data['hint'],
                'explanation': step_data['explanation'],
                'formula': step_data.get('formula', ''),
                'nextStepPreparation': '次のステップに進む準備ができました' if current_step < len(problem['steps']) - 1 else '問題を解き終えました！'
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/admin/generate-solution', methods=['POST'])
def generate_solution_with_ai():
    """AIで解答ステップを生成"""
    try:
        data = request.get_json()
        
        if not OPENAI_AVAILABLE or not openai.api_key:
            return jsonify({
                'success': False,
                'error': 'OpenAI APIが利用できません'
            }), 503
        
        # AIに問題を解かせるプロンプト
        prompt = f"""
あなたは高校数学の優秀な教師です。以下の数学問題について、段階的な解答ステップを生成してください。

## 問題情報
タイトル: {data['title']}
問題文: {data['description']}
難易度: {data['level']}
カテゴリ: {data.get('category', '未分類')}
関連定理: {', '.join(data.get('theorems', []))}

## 生成してほしい内容

1. **問題の意図（intent）**: この問題で学生に何を学んでほしいか、何を理解してほしいかを1-2文で説明
2. **解法アプローチ（approach）**: どのような考え方や手法で解くのが最適かを1-2文で説明
3. **難易度評価（difficulty_assessment）**: 実際の難易度と、つまずきやすいポイントを1-2文で説明
4. **解答ステップ（steps）**: 4-6個の段階的なステップ。各ステップには以下を含める：
   - step: ステップ番号
   - hint: 学生へのヒント（1文）
   - explanation: 詳しい解説（2-3文）
   - formula: 使用する公式や計算式（あれば）

## 重要な指針
- 学生が自分で考える余地を残すこと
- 段階的に理解を深められるような構成
- 数式は適切に表現
- 日本語で丁寧に説明

JSON形式で以下のように返してください：
{{
  "intent": "問題の意図",
  "approach": "推奨される解法",
  "difficulty_assessment": "難易度評価",
  "steps": [
    {{
      "step": 1,
      "hint": "ヒント",
      "explanation": "解説",
      "formula": "公式（オプション）"
    }}
  ]
}}
"""
        
        # OpenAI APIを呼び出し
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "あなたは高校数学の優秀な教師で、問題の本質を理解し、学生が段階的に理解できるような解説を作成します。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # レスポンスをパース
        ai_response = response.choices[0].message.content
        
        # JSON部分を抽出
        import re
        json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
        if json_match:
            result_data = json.loads(json_match.group())
        else:
            result_data = json.loads(ai_response)
        
        return jsonify({
            'success': True,
            'data': result_data
        })
    
    except Exception as e:
        print(f"AI生成エラー: {str(e)}")
        # フォールバック: シンプルなステップを生成
        fallback_data = {
            'intent': '問題の本質を理解し、基本的な解法を習得する',
            'approach': '基本定理を適用し、段階的に解答を導く',
            'difficulty_assessment': '標準的な難易度。基本的な知識があれば解ける',
            'steps': [
                {
                    'step': 1,
                    'hint': '問題文をよく読み、何を求められているか確認しましょう',
                    'explanation': '問題で与えられている情報を整理し、求めるべき答えを明確にします。',
                    'formula': ''
                },
                {
                    'step': 2,
                    'hint': '関連する定理や公式を思い出しましょう',
                    'explanation': 'この問題に適用できる数学的な定理や公式を考えます。',
                    'formula': ''
                },
                {
                    'step': 3,
                    'hint': '具体的な計算を進めましょう',
                    'explanation': '定理や公式を使って、実際に計算を進めていきます。',
                    'formula': ''
                },
                {
                    'step': 4,
                    'hint': '答えを確認しましょう',
                    'explanation': '得られた答えが問題の条件を満たしているか、検算して確認します。',
                    'formula': ''
                }
            ]
        }
        
        return jsonify({
            'success': True,
            'data': fallback_data,
            'note': 'AI APIエラーのためフォールバックレスポンスを返しました'
        })


@app.route('/api/admin/problems', methods=['POST'])
def register_problem():
    """新しい問題を登録"""
    try:
        data = request.get_json()
        
        # 問題IDを生成（タイトルから）
        import re
        problem_id = re.sub(r'[^a-z0-9]+', '_', data['title'].lower())
        problem_id = problem_id.strip('_')
        
        # 重複チェック
        if problem_id in PROBLEMS:
            problem_id = f"{problem_id}_{len(PROBLEMS)}"
        
        # 問題データを構築
        problem = {
            'id': problem_id,
            'title': data['title'],
            'description': data['description'],
            'level': data['level'],
            'category': data.get('category', '未分類'),
            'keywords': data.get('keywords', []),
            'theorems': data.get('theorems', []),
            'steps': data.get('steps', []),
            'created_at': datetime.now().isoformat()
        }
        
        # AIメタデータがあれば追加
        if 'aiMetadata' in data:
            problem['ai_metadata'] = data['aiMetadata']
        
        # データベースに追加
        PROBLEMS[problem_id] = problem
        save_problems(PROBLEMS)
        
        return jsonify({
            'success': True,
            'data': problem
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("🚀 Solvy サーバーを起動中...")
    print("📱 メインページ: http://localhost:3000")
    print("⚙️  管理画面: http://localhost:3000/admin")
    print("🤖 OpenAI API:", "有効" if (OPENAI_AVAILABLE and openai.api_key) else "無効")
    app.run(debug=True, host='0.0.0.0', port=3000)
