import React from 'react';
import './App.css';
import AudioStreamer from './AudioStreamer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Audio Streaming with WebSocket</h2>
        <AudioStreamer />
      </header>
    </div>
  );
}

export default App;