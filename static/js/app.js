// グローバル状態管理
const state = {
    imageData: null,
    currentProblemId: null,
    currentStep: 0,
    totalSteps: 0
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
    progressFill: document.getElementById('progressFill'),
    currentStep: document.getElementById('currentStep'),
    totalSteps: document.getElementById('totalSteps'),
    hintText: document.getElementById('hintText'),
    explanationText: document.getElementById('explanationText'),
    formulaSection: document.getElementById('formulaSection'),
    formulaText: document.getElementById('formulaText'),
    nextStepText: document.getElementById('nextStepText'),
    prevStepBtn: document.getElementById('prevStepBtn'),
    nextStepBtn: document.getElementById('nextStepBtn'),
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

    // ナビゲーションボタン
    elements.prevStepBtn.addEventListener('click', previousStep);
    elements.nextStepBtn.addEventListener('click', nextStep);

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
            await loadGuidance(0);
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

// ガイダンス読み込み
async function loadGuidance(step) {
    if (!state.currentProblemId) return;
    
    showLoading();
    
    try {
        const response = await fetch('/api/analysis/guidance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                problemId: state.currentProblemId,
                currentStep: step
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayGuidance(result.data);
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

// ガイダンス表示
function displayGuidance(data) {
    state.currentStep = data.currentStep - 1;
    state.totalSteps = data.totalSteps;
    
    // プレースホルダー非表示、コンテンツ表示
    elements.guidancePlaceholder.style.display = 'none';
    elements.guidanceContent.style.display = 'block';
    
    // 進捗バー更新
    const progress = (data.currentStep / data.totalSteps) * 100;
    elements.progressFill.style.width = progress + '%';
    elements.currentStep.textContent = data.currentStep;
    elements.totalSteps.textContent = data.totalSteps;
    
    // コンテンツ更新
    elements.hintText.textContent = data.hint;
    elements.explanationText.textContent = data.explanation;
    
    if (data.formula) {
        elements.formulaSection.style.display = 'block';
        elements.formulaText.textContent = data.formula;
    } else {
        elements.formulaSection.style.display = 'none';
    }
    
    elements.nextStepText.textContent = data.nextStepPreparation;
    
    // ボタンの状態更新
    elements.prevStepBtn.disabled = state.currentStep === 0;
    elements.nextStepBtn.disabled = state.currentStep >= state.totalSteps - 1;
}

// 前のステップ
function previousStep() {
    if (state.currentStep > 0) {
        loadGuidance(state.currentStep - 1);
    }
}

// 次のステップ
function nextStep() {
    if (state.currentStep < state.totalSteps - 1) {
        loadGuidance(state.currentStep + 1);
    }
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
