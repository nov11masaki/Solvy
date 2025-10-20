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

# 初期問題データ（問題文のみ）
PROBLEMS = load_problems()
if not PROBLEMS:
    PROBLEMS = {
        "1": {
            "id": "1",
            "problem_text": "星型五角形の5つの頂点における内角の和を求めよ。",
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


@app.route('/api/ocr/extract', methods=['POST'])
def extract_text_from_image():
    """画像からOCRでテキストを抽出"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': '画像データがありません'
            }), 400
        
        # Base64画像データをデコード
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # 実際のOCR実装（Tesseractなど）に置き換え可能
        # ここではシミュレーション
        extracted_text = """次の方程式を解け。
x² - 5x + 6 = 0

※実際のOCRを使用する場合は、pytesseractなどをインストールしてください"""
        
        return jsonify({
            'success': True,
            'data': {
                'text': extracted_text
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/admin/problems', methods=['POST'])
def register_problem():
    """新しい問題を登録（問題文のみ）"""
    try:
        data = request.get_json()
        
        if not data.get('problem_text'):
            return jsonify({
                'success': False,
                'error': '問題文が入力されていません'
            }), 400
        
        # 問題IDを生成（連番）
        problem_id = str(len(PROBLEMS) + 1)
        
        # 問題データを構築（問題文のみ）
        problem = {
            'id': problem_id,
            'problem_text': data['problem_text'],
            'created_at': datetime.now().isoformat()
        }
        
        # 画像データがあれば保存
        if data.get('image_data'):
            problem['image_data'] = data['image_data']
        
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


@app.route('/api/analysis/guidance', methods=['POST'])
def get_guidance():
    """学習者の解答プロセスから意図を読み取ってガイダンスを生成"""
    try:
        data = request.get_json()
        problem_id = data.get('problemId')
        learner_work = data.get('learnerWork', '')  # 学習者の途中経過
        current_step = data.get('currentStep', 0)
        
        problem = PROBLEMS.get(problem_id)
        if not problem:
            return jsonify({
                'success': False,
                'error': 'Problem not found'
            }), 404
        
        # AIで学習者の意図を分析
        if OPENAI_AVAILABLE and openai.api_key and learner_work:
            # 学習者の解答プロセスを分析するプロンプト
            prompt = f"""
あなたは優秀な数学教師です。

## 問題
{problem['problem_text']}

## 学習者の解答途中経過
{learner_work}

## タスク
学習者の解答プロセスを分析し、以下を提供してください：

1. **学習者の意図**: 学習者が何をしようとしているか、どのアプローチを取ろうとしているか
2. **評価**: 現在の方向性は正しいか、改善点はあるか
3. **次のヒント**: 学習者の思考を尊重しながら、次にどう進めばよいか

JSON形式で以下のように返してください：
{{
  "learner_intent": "学習者の意図",
  "evaluation": "評価とフィードバック",
  "next_hint": "次のステップへのヒント",
  "encouragement": "励ましの言葉"
}}
"""
            
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "あなたは学習者の思考プロセスを理解し、適切なガイダンスを提供する優秀な数学教師です。"},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=800
                )
                
                ai_response = response.choices[0].message.content
                
                import re
                json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
                if json_match:
                    guidance_data = json.loads(json_match.group())
                else:
                    guidance_data = json.loads(ai_response)
                
                result = {
                    'success': True,
                    'data': {
                        'currentStep': current_step + 1,
                        'totalSteps': 4,  # 動的に決定
                        'learnerIntent': guidance_data.get('learner_intent', ''),
                        'evaluation': guidance_data.get('evaluation', ''),
                        'hint': guidance_data.get('next_hint', ''),
                        'encouragement': guidance_data.get('encouragement', 'がんばってください！'),
                        'nextStepPreparation': '次のステップに進む準備ができました'
                    }
                }
                
                return jsonify(result)
                
            except Exception as e:
                print(f"AI分析エラー: {str(e)}")
                # フォールバック
        
        # フォールバック: シンプルなガイダンス
        result = {
            'success': True,
            'data': {
                'currentStep': current_step + 1,
                'totalSteps': 4,
                'hint': '問題をよく読み、何が求められているか確認しましょう',
                'explanation': '問題文から必要な情報を整理し、適切な解法を考えます。',
                'nextStepPreparation': '次のステップに進む準備ができました'
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# 以下のエンドポイントは削除（不要になった）
# /api/admin/generate-solution は使わない


if __name__ == '__main__':
    print("🚀 Solvy サーバーを起動中...")
    print("📱 メインページ: http://localhost:3000")
    print("⚙️  管理画面: http://localhost:3000/admin")
    print("🤖 OpenAI API:", "有効" if (OPENAI_AVAILABLE and openai.api_key) else "無効")
    app.run(debug=True, host='0.0.0.0', port=3000)
