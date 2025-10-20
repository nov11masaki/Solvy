// グローバル状態管理
const state = {
    imageData: null,
    currentProblemId: null,
    problemText: ''
};

// DOM要素の取得
const elements = {
    uploadArea: document.getElementById('uploadArea'),
    uploadPlaceholder: document.getElementById('uploadPlaceholder'),
    previewContainer: document.getElementById('previewContainer'),
    previewImage: document.getElementById('previewImage'),
    fileInput: document.getElementById('fileInput'),
    removeImageBtn: document.getElementById('removeImageBtn'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    analysisResult: document.getElementById('analysisResult'),
    recognizedText: document.getElementById('recognizedText'),
    recognizedFormulas: document.getElementById('recognizedFormulas'),
    confidenceFill: document.getElementById('confidenceFill'),
    confidenceText: document.getElementById('confidenceText'),
    guidancePlaceholder: document.getElementById('guidancePlaceholder'),
    guidanceContent: document.getElementById('guidanceContent'),
    problemText: document.getElementById('problemText'),
    learnerWorkInput: document.getElementById('learnerWorkInput'),
    getGuidanceBtn: document.getElementById('getGuidanceBtn'),
    aiGuidanceSection: document.getElementById('aiGuidanceSection'),
    learnerIntentText: document.getElementById('learnerIntentText'),
    evaluationText: document.getElementById('evaluationText'),
    nextHintText: document.getElementById('nextHintText'),
    encouragementText: document.getElementById('encouragementText'),
    clearWorkBtn: document.getElementById('clearWorkBtn'),
    resetProblemBtn: document.getElementById('resetProblemBtn'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    errorAlert: document.getElementById('errorAlert'),
    errorMessage: document.getElementById('errorMessage'),
    closeErrorBtn: document.getElementById('closeErrorBtn')
};

// イベントリスナーの設定
function initEventListeners() {
    // ファイル選択
    elements.uploadPlaceholder.addEventListener('click', () => {
        elements.fileInput.click();
    });

    elements.fileInput.addEventListener('change', handleFileSelect);

    // ドラッグ&ドロップ
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea.addEventListener('drop', handleDrop);

    // 画像削除
    elements.removeImageBtn.addEventListener('click', removeImage);

    // 解析ボタン
    elements.analyzeBtn.addEventListener('click', analyzeImage);

    // ガイダンス取得ボタン
    elements.getGuidanceBtn.addEventListener('click', getGuidance);

    // 解答クリアボタン
    elements.clearWorkBtn.addEventListener('click', clearWork);

    // 問題リセットボタン
    elements.resetProblemBtn.addEventListener('click', resetProblem);

    // エラーアラート閉じる
    elements.closeErrorBtn.addEventListener('click', hideError);
}

// ファイル選択処理
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

// ドラッグオーバー処理
function handleDragOver(event) {
    event.preventDefault();
    elements.uploadArea.classList.add('dragover');
}

// ドラッグリーブ処理
function handleDragLeave(event) {
    event.preventDefault();
    elements.uploadArea.classList.remove('dragover');
}

// ドロップ処理
function handleDrop(event) {
    event.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

// 画像読み込み
function loadImage(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        state.imageData = e.target.result;
        elements.previewImage.src = state.imageData;
        elements.uploadPlaceholder.style.display = 'none';
        elements.previewContainer.style.display = 'block';
        elements.analyzeBtn.disabled = false;
    };
    
    reader.readAsDataURL(file);
}

// 画像削除
function removeImage() {
    state.imageData = null;
    elements.previewImage.src = '';
    elements.previewContainer.style.display = 'none';
    elements.uploadPlaceholder.style.display = 'block';
    elements.analyzeBtn.disabled = true;
    elements.analysisResult.style.display = 'none';
    elements.fileInput.value = '';
}

// 画像解析
async function analyzeImage() {
    if (!state.imageData) return;
    
    showLoading();
    
    try {
        const response = await fetch('/api/analysis/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: state.imageData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayAnalysisResult(result.data);
            state.currentProblemId = result.data.matchedProblemId;
            state.problemText = result.data.recognizedText;
            
            // 問題文を表示
            elements.problemText.textContent = state.problemText;
            
            // ガイダンスセクションを表示
            elements.guidancePlaceholder.style.display = 'none';
            elements.guidanceContent.style.display = 'block';
            
            // 解答入力欄をクリアしてフォーカス
            elements.learnerWorkInput.value = '';
            elements.learnerWorkInput.focus();
        } else {
            showError(result.error || '解析に失敗しました');
        }
    } catch (error) {
        showError('サーバーとの通信に失敗しました');
        console.error(error);
    } finally {
        hideLoading();
    }
}

// 解析結果表示
function displayAnalysisResult(data) {
    elements.recognizedText.textContent = data.recognizedText;
    elements.recognizedFormulas.textContent = data.formulas.join(', ');
    
    const confidence = Math.round(data.confidence * 100);
    elements.confidenceFill.style.width = confidence + '%';
    elements.confidenceText.textContent = confidence + '%';
    
    elements.analysisResult.style.display = 'block';
}

// AIガイダンスを取得
async function getGuidance() {
    const learnerWork = elements.learnerWorkInput.value.trim();
    
    if (!learnerWork) {
        showError('解答の途中経過を入力してください');
        return;
    }
    
    if (!state.currentProblemId) {
        showError('問題が選択されていません');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/analysis/guidance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                problemId: state.currentProblemId,
                learnerWork: learnerWork,
                currentStep: 0
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayAIGuidance(result.data);
        } else {
            showError(result.error || 'ガイダンスの取得に失敗しました');
        }
    } catch (error) {
        showError('サーバーとの通信に失敗しました');
        console.error(error);
    } finally {
        hideLoading();
    }
}

// AIガイダンスを表示
function displayAIGuidance(data) {
    elements.learnerIntentText.textContent = data.learner_intent || '分析中...';
    elements.evaluationText.textContent = data.evaluation || '';
    elements.nextHintText.textContent = data.next_hint || '';
    elements.encouragementText.textContent = data.encouragement || '';
    
    // AIガイダンスセクションを表示
    elements.aiGuidanceSection.style.display = 'block';
    
    // スクロールしてガイダンスを見やすく
    elements.aiGuidanceSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 解答をクリア
function clearWork() {
    elements.learnerWorkInput.value = '';
    elements.aiGuidanceSection.style.display = 'none';
    elements.learnerWorkInput.focus();
}

// 問題をリセット
function resetProblem() {
    // 状態をクリア
    state.currentProblemId = null;
    state.problemText = '';
    
    // 解答入力欄とガイダンスをクリア
    elements.learnerWorkInput.value = '';
    elements.aiGuidanceSection.style.display = 'none';
    
    // ガイダンスコンテンツを非表示
    elements.guidanceContent.style.display = 'none';
    elements.guidancePlaceholder.style.display = 'block';
    
    // 画像もクリア
    removeImage();
    
    showError('新しい問題を解析してください');
}

// ローディング表示
function showLoading() {
    elements.loadingOverlay.style.display = 'flex';
}

// ローディング非表示
function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

// エラー表示
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorAlert.style.display = 'flex';
    
    // 5秒後に自動で閉じる
    setTimeout(hideError, 5000);
}

// エラー非表示
function hideError() {
    elements.errorAlert.style.display = 'none';
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    console.log('🚀 Solvy アプリケーション起動完了');
});
