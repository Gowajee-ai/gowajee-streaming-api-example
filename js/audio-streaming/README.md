# Gowajee Streaming API React.js Example

This React.js example demonstrates how to use the Gowajee Streaming API for real-time speech-to-text transcription. The application captures audio from the microphone, sends it to the Gowajee Streaming API via WebSocket, and displays the transcribed text in a web page.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Description](#description)

## Requirements

- Node.js and npm

## Installation
    ```bash
    npm install
    ```

## Configuration

Set Your API Key and WebSocket URL:

Replace the placeholder APIKEY and URL with your actual API key and WebSocket URL in the src/AudioStreamer.js file.

    ```js
    const APIKEY = "your-api-key-here";
    const URL = "wss://api.gowajee.ai/v1/speech-to-text/pulse/stream/transcribe";
    ```

Set Buffer Size in Seconds (optional):

Modify the chunkSize constant in the src/AudioStreamer.js file to change the buffer size. By default, it's set to 0.5 seconds.

    ```js
    const chunkSize = 0.5; // Buffer size in seconds
    ```

Usage

Start the Development Server

    ```bash
    npm start
    ```

Access the Application
Open your web browser and go to http://localhost:3000 to see the example in action.

## Description

The application performs the following steps:

Captures audio data from the microphone using the Web Audio API.
Converts the audio data to 16-bit PCM format.
Sends the audio data to the Gowajee Streaming API via WebSocket.
Receives transcription results from the server and displays them on the web page.