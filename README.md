# AI Voice Assistant 🎙️

Local AI voice assistant that **transcribes speech, detects emotion, and summarizes text directly in your browser** using Whisper, DistilRoBERTa, and BART — no API keys, no cloud, fully private.

---

## 📋 Overview

This project is a full-stack AI voice assistant that turns raw audio into structured insights: transcript, detected emotional tone, and an abstractive summary. It runs locally on your machine with a simple web UI powered by Flask, HTML/CSS, and JavaScript. The goal is to showcase practical end-to-end AI application skills: model integration, UX, and deployment-ready structure for real-world use.

---

## 🎯 Key Features

- 🎤 **Speech-to-text transcription** using a Whisper-based pipeline for converting spoken audio into text.
- 😊 **Emotion detection** on transcribed text using DistilRoBERTa to classify the dominant sentiment or emotion.
- 🧠 **Abstractive text summarization** using a BART model to generate concise summaries from long transcripts.
- 🌐 **Browser-based UI** built with HTML, CSS, and JavaScript for recording/uploading audio and viewing results.
- 🔒 **Fully local processing** — no external APIs or cloud services, keeping data on the user's machine.
- 🧩 **Modular Flask backend** with clear separation between routing, inference logic, and templates.
- 🧪 **Easily extensible** to plug in different models or add new analysis steps (e.g., keyword extraction, topic detection).

---
## 📋 Project Artifacts / Deliverables

This repository includes:

- `app.py` – Flask backend serving the web interface and orchestrating model inference.
- `templates/` – HTML templates for the main UI page.
- `static/` – CSS, JavaScript, and front-end assets for recording, styling, and displaying results.
- `requirements.txt` – Python dependencies required to run the app.
- `README/` – Additional documentation and helper notes from earlier iterations (can be archived if needed).

Optional (to add later):

- `PROJECT.md` – Detailed technical write-up.
- `USAGE.md` – Example flows and API-style usage.
- `SETUP.md` – Extended, step-by-step installation.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+ installed locally.
- A virtual environment (recommended) to isolate dependencies.
- A modern browser (Chrome/Edge/Firefox) with microphone access enabled.

### Setup Steps

1. **Clone the repository**
   ```
   git clone https://github.com/abdurrabdadkhan2003/ai-voice-assistant.git
   cd ai-voice-assistant
   ```

2. **Create and activate a virtual environment**
   ```
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux / macOS
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```
   python app.py
   ```

5. **Open in browser**

   Visit:
   ```
   http://127.0.0.1:5000
   ```

6. **Use the app**

   - Record or upload an audio clip.
   - Submit the audio and view the transcript, emotion label, and generated summary in the UI.

---
## 🗠 Technologies & Skills Demonstrated

**Core Technologies**

- Python, Flask web framework.
- Whisper-based speech-to-text pipeline.
- DistilRoBERTa for emotion/sentiment classification.
- BART for abstractive summarization.
- HTML, CSS, JavaScript for the frontend UI.

**Machine Learning / NLP Skills**

- Model selection and integration for speech and text tasks.
- Chaining models: transcription → emotion classification → summarization.
- Handling model inputs/outputs and latency trade-offs for interactive apps.

**Software Engineering Skills**

- Building a small full-stack AI product (frontend + backend + models).
- Structuring a Flask project with static assets and templates.
- Environment isolation, dependency management, and reproducible setup.

**Soft Skills**

- Problem framing: turning "voice assistant" into clear features and UX.
- Communication: documenting how to run and extend the project.
- Iterative improvement: starting from a basic prototype and evolving into a portfolio-ready project.

---

## 💹 Results & Impact

- End-to-end latency suitable for short voice clips on a local machine, enabling interactive experimentation.
- Demonstrates real-world ability to combine **speech, NLP, and web development** into a single cohesive project.
- Strong portfolio signal for roles involving applied NLP, multimodal AI, and ML product engineering.

*(You can later add concrete metrics such as average transcription time for a 10-second clip, or qualitative examples of emotion detection accuracy.)*

---

## 🔍 Future Enhancements

Planned or possible improvements:

- Add **speaker diarization** or multi-speaker handling for conversations.
- Support **multiple languages** for transcription and summarization.
- Provide **downloadable reports** (transcript + summary + emotion analysis as a text or PDF file).
- Add **REST API endpoints** so other apps can send audio and receive JSON responses.
- Containerize the app with Docker for easier deployment.
- Replace or fine-tune models for better performance on domain-specific speech (e.g., support calls, lectures).

---

## 👤 About

**Author:** Abdur Rab Dad Khan  
**Role in this project:** End-to-end developer and ML engineer

- Designed the system architecture and feature set.
- Integrated Whisper, DistilRoBERTa, and BART into a single pipeline.
- Built the Flask backend and browser UI.
- Managed environment setup, dependencies, and documentation.
