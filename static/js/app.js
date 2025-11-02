let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let isRecording = false;

// Initialize UI
document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    setupRecording();
    setupUpload();
    setupTextAnalysis();
    setupResults();
});

// ----- Tabs -----
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}
function switchTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
    });
}

// ----- Recording -----
function setupRecording() {
    const recordBtn = document.getElementById('recordBtn');
    const submitRecordBtn = document.getElementById('submitRecordBtn');
    recordBtn.addEventListener('click', toggleRecording);
    submitRecordBtn.addEventListener('click', submitRecording);
}
async function toggleRecording() {
    const recordBtn = document.getElementById('recordBtn');
    const recordingStatus = document.getElementById('recordingStatus');
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = (event) => { audioChunks.push(event.data); };
            mediaRecorder.onstart = () => {
                isRecording = true;
                recordBtn.textContent = '🔴 Stop Recording';
                recordBtn.classList.add('recording');
                recordingStatus.textContent = '🎤 Recording in progress...';
                startVisualizer(stream);
            };
            mediaRecorder.onstop = () => {
                isRecording = false;
                recordBtn.textContent = '🔴 Start Recording';
                recordBtn.classList.remove('recording');
                recordingStatus.textContent = '✓ Recording saved! Click "Process Recording" to analyze.';
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                document.getElementById('submitRecordBtn').style.display = 'block';
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
        } catch (error) {
            console.error('Microphone access denied:', error);
            recordingStatus.textContent = '❌ Microphone access denied. Please allow microphone access.';
        }
    } else {
        mediaRecorder.stop();
    }
}
function submitRecording() {
    if (audioBlob) {
        analyzeAudio(audioBlob);
        document.getElementById('submitRecordBtn').style.display = 'none';
    }
}

// ----- Upload -----
function setupUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const audioInput = document.getElementById('audioInput');
    const submitUploadBtn = document.getElementById('submitUploadBtn');
    uploadArea.addEventListener('click', () => audioInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(99,102,241,0.2)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = 'rgba(99,102,241,0.05)';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(99,102,241,0.05)';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            audioInput.files = files;
            handleFileSelect();
        }
    });
    audioInput.addEventListener('change', handleFileSelect);
    submitUploadBtn.addEventListener('click', submitUpload);
}
function handleFileSelect() {
    const audioInput = document.getElementById('audioInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const submitUploadBtn = document.getElementById('submitUploadBtn');
    if (audioInput.files.length > 0) {
        const file = audioInput.files[0];
        uploadStatus.textContent = `✓ File selected: ${file.name}`;
        submitUploadBtn.style.display = 'block';
        audioBlob = file;
    }
}
function submitUpload() {
    if (audioBlob) {
        analyzeAudio(audioBlob);
        document.getElementById('submitUploadBtn').style.display = 'none';
    }
}

// ----- Text Analysis -----
function setupTextAnalysis() {
    const submitTextBtn = document.getElementById('submitTextBtn');
    submitTextBtn.addEventListener('click', submitText);
}
function submitText() {
    const textInput = document.getElementById('textInput');
    const text = textInput.value.trim();
    if (!text) {
        alert('Please enter some text');
        return;
    }
    analyzeText(text);
}

// ----- API CALLS -----
async function analyzeAudio(audioBlob) {
    showLoading();
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');
        const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) displayResults(data);
        else displayError(data.error || 'Unknown error');
    } catch (error) {
        console.error('Error:', error);
        displayError('Error processing audio: ' + error.message);
    } finally {
        hideLoading();
    }
}
async function analyzeText(text) {
    showLoading();
    try {
        const response = await fetch('/api/analyze-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        const data = await response.json();
        if (data.success) displayResults(data, text);
        else displayError(data.error || 'Unknown error');
    } catch (error) {
        console.error('Error:', error);
        displayError('Error analyzing text: ' + error.message);
    } finally {
        hideLoading();
    }
}

// ----- Results Display -----
function setupResults() {
    const closeBtn = document.getElementById('closeResults');
    closeBtn.addEventListener('click', hideResults);
}
function displayResults(data, originalText = null) {
    const resultsDiv = document.getElementById('results');
    document.getElementById('transcriptionSection').style.display = 'none';
    document.getElementById('emotionSection').style.display = 'none';
    document.getElementById('summarySection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
    if (data.transcription) {
        document.getElementById('transcriptionText').textContent = data.transcription;
        document.getElementById('transcriptionSection').style.display = 'block';
    } else if (originalText) {
        document.getElementById('transcriptionText').textContent = originalText;
        document.getElementById('transcriptionSection').style.display = 'block';
    }
    if (data.emotion && !data.emotion.error) {
        displayEmotion(data.emotion);
        document.getElementById('emotionSection').style.display = 'block';
    }
    if (data.summary) {
        document.getElementById('summaryText').textContent = data.summary;
        document.getElementById('summarySection').style.display = 'block';
    }
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function displayEmotion(emotion) {
    const emotionResult = document.getElementById('emotionResult');
    const primaryEmotion = emotion.primary_emotion || 'unknown';
    const confidence = emotion.confidence || 0;
    const emotionBars = document.createElement('div');
    emotionBars.className = 'emotion-bars';
    const sortedEmotions = Object.entries(emotion)
        .filter(([key]) => key !== 'primary_emotion' && key !== 'confidence' && key !== 'error')
        .sort(([, a], [, b]) => b - a);
    sortedEmotions.forEach(([emotion_label, score]) => {
        const percent = Math.round(score * 100);
        const emoji = getEmotionEmoji(emotion_label);
        const barItem = document.createElement('div');
        barItem.className = 'emotion-bar-item';
        barItem.innerHTML = `
            <div class="emotion-label">
                <span>${emoji} ${emotion_label}</span>
                <span>${percent}%</span>
            </div>
            <div class="emotion-bar-bg">
                <div class="emotion-bar-fill" style="width: 0%"></div>
            </div>
        `;
        emotionBars.appendChild(barItem);
        setTimeout(() => {
            barItem.querySelector('.emotion-bar-fill').style.width = percent + '%';
        }, 100);
    });
    const primaryEmotionDiv = document.createElement('div');
    primaryEmotionDiv.className = 'primary-emotion';
    primaryEmotionDiv.innerHTML = `
        ${getEmotionEmoji(primaryEmotion)} <strong>${primaryEmotion.toUpperCase()}</strong> 
        (${Math.round(confidence * 100)}% confidence)
    `;
    emotionResult.innerHTML = '';
    emotionResult.appendChild(emotionBars);
    emotionResult.appendChild(primaryEmotionDiv);
}
function getEmotionEmoji(emotion) {
    const emojis = {
        'joy': '😀',
        'sadness': '😢',
        'anger': '😠',
        'fear': '😨',
        'surprise': '😲',
        'disgust': '🤢',
        'neutral': '😐'
    };
    return emojis[emotion] || '😊';
}
function displayError(message) {
    document.getElementById('errorText').textContent = '❌ ' + message;
    document.getElementById('errorSection').style.display = 'block';
    document.getElementById('results').style.display = 'block';
}
function hideResults() {
    document.getElementById('results').style.display = 'none';
}

// ----- Loading Spinner -----
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}
function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// ----- Audio Visualizer -----
function startVisualizer(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    function draw() {
        analyser.getByteFrequencyData(dataArray);
        const bars = 30;
        visualizer.innerHTML = '';
        for (let i = 0; i < bars; i++) {
            const index = Math.floor((i / bars) * dataArray.length);
            const value = dataArray[index] / 255;
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            bar.style.height = (value * 60) + 'px';
            visualizer.appendChild(bar);
        }
        if (isRecording) requestAnimationFrame(draw);
    }
    draw();
}

// ----- Utility -----
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});
document.addEventListener('DOMContentLoaded', function() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported');
    }
});
