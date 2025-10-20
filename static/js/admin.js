// 管理画面のJavaScript

let problemImageData = null;

// DOM要素
const elements = {
    problemForm: document.getElementById('problemForm'),
    textInput: document.getElementById('textInput'),
    imageInput: document.getElementById('imageInput'),
    problemText: document.getElementById('problemText'),
    problemUploadArea: document.getElementById('problemUploadArea'),
    problemUploadPlaceholder: document.getElementById('problemUploadPlaceholder'),
    problemPreviewContainer: document.getElementById('problemPreviewContainer'),
    problemPreviewImage: document.getElementById('problemPreviewImage'),
    problemImageInput: document.getElementById('problemImageInput'),
    removeProblemImageBtn: document.getElementById('removeProblemImageBtn'),
    ocrBtn: document.getElementById('ocrBtn'),
    ocrResultGroup: document.getElementById('ocrResultGroup'),
    ocrResultText: document.getElementById('ocrResultText'),
    submitBtn: document.getElementById('submitBtn'),
    problemsList: document.getElementById('problemsList'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    errorAlert: document.getElementById('errorAlert'),
    errorMessage: document.getElementById('errorMessage'),
    closeErrorBtn: document.getElementById('closeErrorBtn'),
    successAlert: document.getElementById('successAlert'),
    successMessage: document.getElementById('successMessage'),
    closeSuccessBtn: document.getElementById('closeSuccessBtn')
};

// タブ切り替え
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // タブボタンの切り替え
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // パネルの切り替え
        elements.textInput.classList.remove('active');
        elements.imageInput.classList.remove('active');
        
        if (tab === 'text') {
            elements.textInput.classList.add('active');
        } else {
            elements.imageInput.classList.add('active');
        }
    });
});

// 画像アップロード処理
elements.problemUploadPlaceholder.addEventListener('click', () => {
    elements.problemImageInput.click();
});

elements.problemImageInput.addEventListener('change', handleFileSelect);

elements.problemUploadArea.addEventListener('dragover', handleDragOver);
elements.problemUploadArea.addEventListener('dragleave', handleDragLeave);
elements.problemUploadArea.addEventListener('drop', handleDrop);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    elements.problemUploadArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    elements.problemUploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    elements.problemUploadArea.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

function loadImage(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        problemImageData = e.target.result;
        elements.problemPreviewImage.src = problemImageData;
        elements.problemUploadPlaceholder.style.display = 'none';
        elements.problemPreviewContainer.style.display = 'block';
        elements.ocrBtn.disabled = false;
    };
    
    reader.readAsDataURL(file);
}

elements.removeProblemImageBtn.addEventListener('click', () => {
    problemImageData = null;
    elements.problemPreviewImage.src = '';
    elements.problemPreviewContainer.style.display = 'none';
    elements.problemUploadPlaceholder.style.display = 'block';
    elements.ocrBtn.disabled = true;
    elements.problemImageInput.value = '';
    elements.ocrResultGroup.style.display = 'none';
    elements.ocrResultText.value = '';
});

// OCR処理
elements.ocrBtn.addEventListener('click', async () => {
    if (!problemImageData) return;
    
    showLoading();
    
    try {
        const response = await fetch('/api/ocr/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: problemImageData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            elements.ocrResultText.value = result.data.text;
            elements.ocrResultGroup.style.display = 'block';
            showSuccess('テキストを抽出しました');
        } else {
            showError(result.error || 'OCR抽出に失敗しました');
        }
    } catch (error) {
        showError('サーバーとの通信に失敗しました');
        console.error(error);
    } finally {
        hideLoading();
    }
});

// フォーム送信
elements.problemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 問題文を取得（テキスト入力 or OCR結果）
    let problemText;
    if (elements.textInput.classList.contains('active')) {
        problemText = elements.problemText.value.trim();
    } else {
        problemText = elements.ocrResultText.value.trim();
    }
    
    if (!problemText) {
        showError('問題文を入力してください');
        return;
    }
    
    const formData = {
        problem_text: problemText,
        image_data: problemImageData  // 画像も保存（オプション）
    };
    
    await registerProblem(formData);
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
            elements.ocrResultGroup.style.display = 'none';
            problemImageData = null;
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
        elements.problemsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">まだ問題が登録されていません</p>';
        return;
    }
    
    problems.forEach(problem => {
        const card = document.createElement('div');
        card.className = 'problem-card';
        
        const problemPreview = problem.problem_text.substring(0, 100);
        
        card.innerHTML = `
            <h3>問題 ${problem.id}</h3>
            <p>${problemPreview}${problem.problem_text.length > 100 ? '...' : ''}</p>
            <div class="problem-meta">
                <span class="problem-badge">登録日: ${new Date(problem.created_at).toLocaleDateString('ja-JP')}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `/?problem=${problem.id}`;
        });
        
        elements.problemsList.appendChild(card);
    });
}

// ユーティリティ関数
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
