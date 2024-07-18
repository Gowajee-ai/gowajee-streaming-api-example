import React, { useEffect, useRef, useState } from "react";

const AudioStreamer = () => {
  const URL = "wss://api.gowajee.ai/v1/speech-to-text/pulse/stream/transcribe";
  const API_KEY = "";
  const sampleRate = 16000
  const chunkSize = 0.5

  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [processingTranscript, setProcessingTranscript] = useState("");
  const [transcription, setTranscription] = useState("");
  const ws = useRef(null);
  const audioRef = useRef(null);

  const initialMessage = {
    sampleRate: sampleRate,
    boostWordList: ["โกวาจี"],
    boostWordScore: 5,
  };

  const floatToInt16 = (float32Array) => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      int16Array[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
    }
    return int16Array;
  };

  const calculateBufferSize = (sampleRate, bufferSeconds) => {
    const rawSize = sampleRate * bufferSeconds;
    return 2 ** Math.ceil(Math.log2(rawSize)); // Round up to nearest power of 2
  };

  const startStreaming = async () => {
    try {
      // Initialize WebSocket connection
      ws.current = new WebSocket(URL + "?x-api-key=" + API_KEY);
      ws.current.onopen = () => {
        console.log("WebSocket connection opened");

        ws.current.send(JSON.stringify(initialMessage));
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "ASR_PULSE_STREAM") {
          const { event: asrEvent, results } = data.output;
          if (results && results.transcript) {
            if (asrEvent === "SpeakOn") {
              setProcessingTranscript(results.transcript);
            } else if (asrEvent === "SpeakOff") {
              setProcessingTranscript("");
              setTranscription((prev) => prev + "\n" + results.transcript);
            }
          }
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(mediaStream);
      audioRef.current.srcObject = mediaStream;

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)({ sampleRate });
      const source = audioContext.createMediaStreamSource(mediaStream);
      const bufferSize = calculateBufferSize(sampleRate, chunkSize);
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const float32Array = e.inputBuffer.getChannelData(0);
        const int16Array = floatToInt16(float32Array);
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(int16Array.buffer);
        }
      };

      setIsStreaming(true);
    } catch (err) {
      console.error("Error accessing the microphone", err);
    }
  };

  const stopStreaming = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsStreaming(false);

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup function
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div>
      <audio ref={audioRef} autoPlay style={{ display: "none" }} muted />

      <button onClick={isStreaming ? stopStreaming : startStreaming}>
        {isStreaming ? "Stop Streaming" : "Start Streaming"}
      </button>
      <div style={{ marginTop: "20px", maxWidth: "800px", padding: "10px" }}>
        <p style={{ whiteSpace: "pre", fontSize: "16px" }}>{transcription}</p>
        <p style={{ whiteSpace: "pre", fontSize: "16px", color: "red" }}>
          {processingTranscript}
        </p>
      </div>
    </div>
  );
};

export default AudioStreamer;
