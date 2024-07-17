# Streaming Speech-to-Text Using WebSocket and PyAudio

This Python script captures audio from the microphone, sends it to a WebSocket server for real-time transcription, and prints the transcribed text to the console. The script uses the `pyaudio` library for audio capture and `websockets` for WebSocket communication.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Requirements

- Python 3.6+
- `pyaudio` library
- `websockets` library

## Installation

1. **Create a Virtual Environment (optional but recommended):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

2. **Install the Required Packages:**

    ```bash
    pip install pyaudio websockets
    ```

## Configuration

1. **Set Your API Key:**

    Replace the placeholder `APIKEY` with your actual API key in the script.

    ```python
    APIKEY = "your-api-key-here"
    ```

2. **Set the WebSocket URL:**

    Ensure the `URL` variable is set to the correct WebSocket endpoint for your speech-to-text service.

    ```python
    URL = "wss://api.gowajee.ai/v1/speech-to-text/pulse/stream/transcribe"
    ```

## Usage

To run the script, simply execute:

```bash
python example.py