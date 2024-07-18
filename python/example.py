import json
import pyaudio
import asyncio
import websockets

SAMPLE_RATE = 16000
CHUNK_SIZE = int(SAMPLE_RATE * 0.5)
APIKEY = ""
URL = "wss://api.gowajee.ai/v1/speech-to-text/pulse/stream/transcribe"


def custom_print(message, newline=True):
    if newline:
        # Print message and start a new line
        print(message)
    else:
        # Print message but replace the same line
        print(message, end='\r', flush=True)


async def send_audio_chunks(websocket, py_stream):
    """
    This coroutine continuously reads audio data chunks from the microphone stream
    and sends them to the server through the WebSocket connection.
    """

    while True:

        data = py_stream.read(CHUNK_SIZE, exception_on_overflow=False)

        if not data:
            break

        await websocket.send(data)
        message = json.loads(await websocket.recv())

        if "output" in message:
            output = message["output"]
            results = output.get("results")  # Use .get for safer access
            transcription = results.get("transcript", "") if results else ""

            if output["event"] == "SpeakOn":
                custom_print(output["event"] + ": " +
                             transcription, newline=True)

            if output["event"] == "SpeakOff":
                custom_print(output["event"] + ": " + transcription)


async def microphone_to_websocket():
    """
    Establishes a WebSocket connection and starts sending microphone data.
    """
    async with websockets.connect(URL, extra_headers={"x-api-key": APIKEY}) as websocket:
        # Initialize PyAudio stream
        p = pyaudio.PyAudio()
        stream = p.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=SAMPLE_RATE,
            output=False,
            input=True,
            frames_per_buffer=CHUNK_SIZE,
        )

        await websocket.send(json.dumps({"sampleRate": SAMPLE_RATE}))
        message = json.loads(await websocket.recv())

        print(f"Received: {message}")

        # Start sending audio chunks asynchronously
        task = asyncio.create_task(send_audio_chunks(websocket, stream))
        await task

        # Wait for the WebSocket connection to close
        await websocket.wait_closed()

        # Close the PyAudio stream
        stream.stop_stream()
        stream.close()
        p.terminate()

if __name__ == "__main__":
    asyncio.run(microphone_to_websocket())
