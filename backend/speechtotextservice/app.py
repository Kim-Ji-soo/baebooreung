from flask import Flask, jsonify
from flask import request
import os
from moviepy.editor import *
import base64


app = Flask(__name__)


@app.route('/speechtotext-service')
def hello_world():
    return 'Hello, World!'

@app.route('/speechtotext-service/stt', methods=['POST'])
def getFile():
    if request.method == 'POST':
        payload = request.get_json()
        mp4_b64 = payload['file']
        mp4_binary = base64.b64decode(mp4_b64)
        temp_path = os.path.dirname(os.path.realpath(__file__))
        with open(temp_path+"/voice.mp4", 'wb') as wfile:
            wfile.write(mp4_binary)

        video = AudioFileClip("voice.mp4")
        video.write_audiofile("audio.mp3")

        with open(temp_path+"/audio.mp3", 'rb') as f:
            data_text = run_quickstart(f)
            data = {'text': ' '.join(data_text)}
            return jsonify(data)
    return 'ok'

def run_quickstart(audio_file):
    # [START speech_quickstart]
    import io
    import os
    os.environ['GOOGLE_APPLICATION_CREDENTIALS']="/var/jenkins_home/baebooreung-credential.json"
    # Imports the Google Cloud client library
    # [START migration_import]
    from google.cloud import speech
    # [END migration_import]

    # Instantiates a client
    # [START migration_client]
    client = speech.SpeechClient()
    # [END migration_client]

    # The name of the audio file to transcribe
    file_name = os.path.join(
        os.path.dirname(__file__),
        '.',
        'voice.mp3')

    content = audio_file.read()
    audio = speech.RecognitionAudio(content=content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
        #encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        # encoding=speech.RecognitionConfig.AudioEncoding.FLAC ,
        sample_rate_hertz=44100,
        audio_channel_count=2,
        language_code='ko-KR')

    # Detects speech in the audio file
    response = client.recognize(config=config, audio=audio)
    return_str = []
    for result in response.results:
        return_str.append(result.alternatives[0].transcript)
    return return_str

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int("5000"), debug=True)