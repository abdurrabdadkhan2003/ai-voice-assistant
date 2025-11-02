from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import torch
import numpy as np
from transformers import pipeline
import logging
import tempfile
import traceback

app = Flask(__name__)
CORS(app)
os.environ['CUDA_VISIBLE_DEVICES'] = ''

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("🚀 Loading AI models... (This takes ~30-60 seconds on first run)")

try:
    print("📻 Loading Whisper (Speech Recognition)...")
    whisper_pipeline = pipeline(
        "automatic-speech-recognition",
        model="openai/whisper-base",
        device=-1
    )
    print("✓ Whisper loaded!")

    print("💭 Loading DistilRoBERTa (Emotion Detection)...")
    emotion_pipeline = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        return_all_scores=True,
        device=-1
    )
    print("✓ DistilRoBERTa loaded!")

    print("📝 Loading BART (Summarization)...")
    summarizer_pipeline = pipeline(
        "summarization",
        model="facebook/bart-large-cnn",
        device=-1
    )
    print("✓ BART loaded!")

    print("\n✨ All models loaded successfully!")

except Exception as e:
    print(f"❌ Error loading models: {e}")
    logger.error(f"Model loading error: {traceback.format_exc()}")

def transcribe_audio(audio_file_path):
    try:
        result = whisper_pipeline(audio_file_path)
        return result["text"].strip()
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        return f"Error transcribing audio: {str(e)}"

def classify_emotion(text):
    try:
        if not text or len(text.strip()) == 0:
            return {"error": "Empty text"}

        results = emotion_pipeline(text)
        emotion_dict = {}
        max_score = 0
        primary_emotion = "neutral"

        for item in results[0]:
            label = item['label']
            score = round(item['score'], 4)
            emotion_dict[label] = score

            if score > max_score:
                max_score = score
                primary_emotion = label

        emotion_dict["primary_emotion"] = primary_emotion
        emotion_dict["confidence"] = round(max_score, 4)

        return emotion_dict
    except Exception as e:
        logger.error(f"Emotion classification error: {e}")
        return {"error": str(e)}

def summarize_text(text, max_length=150, min_length=50):
    try:
        if not text or len(text.strip()) < 50:
            return "Text too short to summarize. Need at least 50 characters."

        summary = summarizer_pipeline(
            text,
            max_length=max_length,
            min_length=min_length,
            do_sample=False
        )

        return summary[0]["summary_text"]
    except Exception as e:
        logger.error(f"Summarization error: {e}")
        return f"Error summarizing: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']

        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
            audio_file.save(tmp.name)
            temp_path = tmp.name

        try:
            transcribed_text = transcribe_audio(temp_path)
            emotion = classify_emotion(transcribed_text)
            summary = summarize_text(transcribed_text)

            return jsonify({
                "success": True,
                "transcription": transcribed_text,
                "emotion": emotion,
                "summary": summary
            })
        finally:
            os.unlink(temp_path)

    except Exception as e:
        logger.error(f"Transcribe endpoint error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text'].strip()

        if not text:
            return jsonify({"error": "Empty text"}), 400

        emotion = classify_emotion(text)
        summary = summarize_text(text)

        return jsonify({
            "success": True,
            "emotion": emotion,
            "summary": summary
        })

    except Exception as e:
        logger.error(f"Analyze text endpoint error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "AI Voice Assistant is running!"
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🎉 AI Voice Assistant is running!")
    print("="*60)
    print("📱 Open your browser to: http://localhost:5000")
    print("🛑 To stop: Press CTRL+C")
    print("="*60 + "\n")

    app.run(
        debug=True,
        host='127.0.0.1',
        port=5000,
        use_reloader=False
    )
