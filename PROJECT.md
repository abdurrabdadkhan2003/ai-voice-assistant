# AI Voice Assistant – Technical Project Document

## 1. Problem Statement & Objectives

Spoken communication is rich but hard to analyze without tools: raw audio is not searchable, and understanding tone and key points is time-consuming.

The objective of this project is to build a **local AI assistant** that:
- Transcribes speech to text.
- Detects the emotional tone of the content.
- Generates a concise summary of the transcript.

All of this should run on a user's machine, without sending data to external APIs.

---

## 2. Technical Approach / Methodology

- Use a **speech-to-text model** (Whisper-based) to convert audio input into text.
- Feed the transcript into a **DistilRoBERTa classifier** to infer emotion or sentiment.
- Pass the same transcript to a **BART summarization model** to generate a short, human-readable summary.
- Wrap this pipeline behind a **Flask server**, exposing a simple web interface for recording or uploading audio.
- Use JavaScript on the frontend to handle audio input and display results dynamically.

Data flow:
`Audio input → Whisper transcription → DistilRoBERTa emotion detection → BART summarization → HTML UI display`

---

## 3. Implementation Details

### Backend

- `app.py` defines Flask routes for:
  - Rendering the main HTML page.
  - Accepting audio files (via POST).
  - Running the transcription–emotion–summary pipeline and returning results.

- The models are loaded at startup to avoid repeated initialization overhead.
- File handling ensures temporary audio is processed and discarded appropriately.

### Frontend

- `templates/` contains the main page:
  - Audio upload or recording controls.
  - Sections to display transcript, emotion label, and summary.

- `static/` holds:
  - CSS for layout, colors, and responsive design.
  - JavaScript for:
    - Capturing audio (if using the browser's MediaRecorder).
    - Sending audio to the backend via fetch/POST.
    - Updating the DOM with the returned JSON response.

### Architecture Characteristics

- Clear separation of concerns:
  - UI (HTML/CSS/JS)
  - API layer (Flask routes)
  - ML inference (Python model code)

- Designed so additional models (e.g., toxicity detection, keyword extraction) can be added to the pipeline without major refactors.

---
## 4. Key Learnings & Challenges Solved

- **Model integration latency:** Learned to load models once at startup to keep per-request latency low.
- **Handling audio in web apps:** Managed browser audio capture, file upload, and backend parsing.
- **Chaining different model types:** Combined speech-to-text and NLP models in a coherent pipeline.
- **User experience:** Designed a simple UI to make complex AI behavior understandable to non-technical users.

---

## 5. Tools & Libraries Used

- **Programming Language:** Python
- **Web Framework:** Flask
- **NLP / ML Models:** Whisper (speech-to-text), DistilRoBERTa (emotion classification), BART (summarization)
- **Frontend:** HTML, CSS, JavaScript
- **Environment / Dependency Management:** `venv`, `pip`, `requirements.txt`

*(You can add exact library names/versions here once finalized.)*

---

## 6. Results & Deliverables

Deliverables:

- A local web application that accepts audio and returns:
  - Text transcript
  - Emotion label
  - Abstractive summary

- A documented codebase with:
  - `app.py` backend
  - `templates/` and `static/` frontend resources
  - `requirements.txt` for reproducible setup

This project demonstrates the ability to build an **end-to-end AI product** rather than isolated model experiments, which is valuable for ML, NLP, and applied AI roles.
