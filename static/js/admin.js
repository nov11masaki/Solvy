// 管理画面のJavaScript

let currentAIResponse = null;

// DOM要素
const elements = {
    problemForm: document.getElementById('problemForm'),
    previewSection: document.getElementById('previewSection'),
    aiThinking: document.getElementById('aiThinking'),
    thinkingDetails: document.getElementById('thinkingDetails'),
    previewContent: document.getElementById('previewContent'),
    submitBtn: document.getElementById('submitBtn'),
    confirmBtn: document.getElementById('confirmBtn'),
    editBtn: document.getElementById('editBtn'),
    problemsList: document.getElementById('problemsList'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    errorAlert: document.getElementById('errorAlert'),
    errorMessage: document.getElementById('errorMessage'),
    closeErrorBtn: document.getElementById('closeErrorBtn'),
    successAlert: document.getElementById('successAlert'),
    successMessage: document.getElementById('successMessage'),
    closeSuccessBtn: document.getElementById('closeSuccessBtn')
};

// フォーム送信
elements.problemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('problemTitle').value,
        description: document.getElementById('problemDescription').value,
        level: document.getElementById('problemLevel').value,
        category: document.getElementById('problemCategory').value || '未分類',
        keywords: document.getElementById('problemKeywords').value.split(',').map(k => k.trim()).filter(k => k),
        theorems: document.getElementById('problemTheorems').value.split(',').map(t => t.trim()).filter(t => t),
        useAI: document.getElementById('useAI').checked
    };
    
    if (formData.useAI) {
        await generateWithAI(formData);
    } else {
        // AI使わない場合は直接登録
        await registerProblem(formData);
    }
});

// AIで生成
async function generateWithAI(formData) {
    elements.previewSection.style.display = 'block';
    elements.aiThinking.style.display = 'block';
    elements.previewContent.style.display = 'none';
    
    // スクロール
    elements.previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 思考プロセスをアニメーション
    const thinkingSteps = [
        '🧠 問題の意図を分析しています...',
        '📊 最適な解法を検討しています...',
        '🔍 必要な定理を特定しています...',
        '📝 解答ステップを生成しています...',
        '✨ 解説文を作成しています...'
    ];
    
    let stepIndex = 0;
    const thinkingInterval = setInterval(() => {
        if (stepIndex < thinkingSteps.length) {
            elements.thinkingDetails.innerHTML = `<p>${thinkingSteps[stepIndex]}</p>`;
            stepIndex++;
        }
    }, 1500);
    
    try {
        const response = await fetch('/api/admin/generate-solution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        clearInterval(thinkingInterval);
        
        if (result.success) {
            currentAIResponse = result.data;
            displayAIResponse(result.data, formData);
        } else {
            showError(result.error || 'AI生成に失敗しました');
        }
    } catch (error) {
        clearInterval(thinkingInterval);
        showError('サーバーとの通信に失敗しました');
        console.error(error);
    }
}

// AI生成結果を表示
function displayAIResponse(data, formData) {
    elements.aiThinking.style.display = 'none';
    elements.previewContent.style.display = 'block';
    
    // 基本情報
    document.getElementById('previewTitle').textContent = formData.title;
    document.getElementById('previewLevel').textContent = getLevelText(formData.level);
    document.getElementById('previewDescription').textContent = formData.description;
    
    // AI分析
    document.getElementById('aiIntent').textContent = data.intent || '問題の本質を理解し、段階的に解答を導く';
    document.getElementById('aiApproach').textContent = data.approach || '基本的な定理から応用へと展開';
    document.getElementById('aiDifficulty').textContent = data.difficulty_assessment || '標準的な難易度';
    
    // ステップ表示
    const stepsList = document.getElementById('stepsList');
    stepsList.innerHTML = '';
    
    data.steps.forEach((step, index) => {
        const stepCard = document.createElement('div');
        stepCard.className = 'step-card';
        stepCard.style.animationDelay = `${index * 0.1}s`;
        
        stepCard.innerHTML = `
            <div class="step-header">
                <div class="step-number">${step.step}</div>
                <div class="step-content">
                    <h5>💡 ${step.hint}</h5>
                </div>
            </div>
            <div class="step-content">
                <p><strong>解説:</strong> ${step.explanation}</p>
                ${step.formula ? `<div class="step-formula">${step.formula}</div>` : ''}
            </div>
        `;
        
        stepsList.appendChild(stepCard);
    });
}

// 確定して登録
elements.confirmBtn.addEventListener('click', async () => {
    if (!currentAIResponse) return;
    
    const formData = {
        title: document.getElementById('problemTitle').value,
        description: document.getElementById('problemDescription').value,
        level: document.getElementById('problemLevel').value,
        category: document.getElementById('problemCategory').value || '未分類',
        keywords: document.getElementById('problemKeywords').value.split(',').map(k => k.trim()).filter(k => k),
        theorems: document.getElementById('problemTheorems').value.split(',').map(t => t.trim()).filter(t => t),
        steps: currentAIResponse.steps,
        aiMetadata: {
            intent: currentAIResponse.intent,
            approach: currentAIResponse.approach,
            difficulty_assessment: currentAIResponse.difficulty_assessment
        }
    };
    
    await registerProblem(formData);
});

// 編集ボタン
elements.editBtn.addEventListener('click', () => {
    elements.previewSection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 問題を登録
async function registerProblem(data) {
    showLoading();
    
    try {
        const response = await fetch('/api/admin/problems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('問題を登録しました！');
            elements.problemForm.reset();
            elements.previewSection.style.display = 'none';
            currentAIResponse = null;
            loadProblems();
        } else {
            showError(result.error || '登録に失敗しました');
        }
    } catch (error) {
        showError('サーバーとの通信に失敗しました');
        console.error(error);
    } finally {
        hideLoading();
    }
}

// 問題一覧を読み込み
async function loadProblems() {
    try {
        const response = await fetch('/api/problems');
        const result = await response.json();
        
        if (result.success) {
            displayProblems(result.data);
        }
    } catch (error) {
        console.error('問題一覧の読み込みに失敗:', error);
    }
}

// 問題一覧を表示
function displayProblems(problems) {
    elements.problemsList.innerHTML = '';
    
    if (problems.length === 0) {
        elements.problemsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">まだ問題が登録されていません</p>';
        return;
    }
    
    problems.forEach(problem => {
        const card = document.createElement('div');
        card.className = 'problem-card';
        
        card.innerHTML = `
            <h3>${problem.title}</h3>
            <p>${problem.description.substring(0, 100)}${problem.description.length > 100 ? '...' : ''}</p>
            <div class="problem-meta">
                <span class="problem-badge">${getLevelText(problem.level)}</span>
                ${problem.category ? `<span class="problem-badge">${problem.category}</span>` : ''}
                <span class="problem-steps-count">${problem.steps ? problem.steps.length : 0} ステップ</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `/?problem=${problem.id}`;
        });
        
        elements.problemsList.appendChild(card);
    });
}

// ユーティリティ関数
function getLevelText(level) {
    const levels = {
        'middle-school': '中学レベル',
        'high-school': '高校レベル',
        'university': '大学レベル'
    };
    return levels[level] || level;
}

function showLoading() {
    elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorAlert.style.display = 'flex';
    setTimeout(() => hideError(), 5000);
}

function hideError() {
    elements.errorAlert.style.display = 'none';
}

function showSuccess(message) {
    elements.successMessage.textContent = message;
    elements.successAlert.style.display = 'flex';
    setTimeout(() => hideSuccess(), 5000);
}

function hideSuccess() {
    elements.successAlert.style.display = 'none';
}

// イベントリスナー
elements.closeErrorBtn.addEventListener('click', hideError);
elements.closeSuccessBtn.addEventListener('click', hideSuccess);

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadProblems();
    console.log('🚀 管理画面を初期化しました');
});
