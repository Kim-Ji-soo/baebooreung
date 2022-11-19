from flask import Flask, jsonify
from flask import request

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

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
        # encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        audio_channel_count=2,
        language_code='ko-KR')

    # Detects speech in the audio file
    response = client.recognize(config=config, audio=audio)
    return_str = []
    for result in response.results:
        return_str.append(result.alternatives[0].transcript)
    return return_str


@app.route('/file', methods=['POST'])
def getFile(file=None):
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'File is missing', 404

        data = request.files['file']
        filename = data.filename
        data_text = run_quickstart(data)
        data = {'text' : ' '.join(data_text)}
        print(data)
        return jsonify(data)
    return 'ok'


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int("5000"), debug=True)