import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  PermissionsAndroid,
  TouchableHighlight,
  Image,
} from 'react-native';
import {useState, useEffect} from 'react';
import Voice from '@react-native-community/voice';
import Mic from '../assets/images/mic.png';
export default function VoiceRecognition() {
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  const requestRecordingAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the record_audio');
      } else {
        console.log('record_audio permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onSpeechStart = e => {
    console.log('onSpeechStart : ', e);
    setStarted('√');
  };
  const onSpeechEnd = e => {
    console.log('onSpeechEnd : ', e);
    setEnd('√');
  };
  const onSpeechError = e => {
    console.log('onSpeechResult : ', e);
    setError(JSON.stringify(e.error));
  };
  const onSpeechResults = e => {
    //speechRecognizer가 끝날때 인식됨
    console.log('onSpeechResults: ', e);
    setResults(e.value);
  };
  const onSpeechPartialResults = e => {
    // 어느 결과든 계산될때 호출? 해봐야알듯?
    console.log('onSpeechPartitialResults : ', e);
    setPartialResults(e.value);
  };
  const onSpeechVolumeChanged = e => {
    //pitch가 바뀌었다고 인지되었을때 호출
    console.log('onSpeechVolumeChanged : ', e);
    setPitch(e.value);
  };

  useEffect(() => {
    requestRecordingAudioPermission();
    console.log(Voice.getSpeechRecognitionServices());
    //(setting callback)
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecognizing = async () => {
    try {
      await Voice.start('ko-KR');
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Speech to Text Conversion</Text>
        {/* <Button
          title="request permission"
          onPress={requestRecordingAudioPermission}
        /> */}
        <Text style={styles.textStyle}>Click on Mike</Text>
        <TouchableHighlight onPress={startRecognizing}>
          <Image source={Mic} style={styles.image} />
        </TouchableHighlight>
        <Text style={styles.textStyle}>Partial Results</Text>
        <ScrollView>
          {partialResults.map((result, index) => {
            return (
              <Text key={`partial-result-${index}`} style={styles.textStyle}>
                {result}
              </Text>
            );
          })}
        </ScrollView>
        <Text style={styles.textStyle}>Results</Text>
        <ScrollView style={{marginBottom: 42}}>
          {results.map((result, index) => {
            return (
              <Text key={`result-${index}`} style={styles.textStyle}>
                {result}
              </Text>
            );
          })}
        </ScrollView>
        <View horizontal style={styles.horizontalView}>
          <TouchableHighlight
            onPress={stopRecognizing}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Stop</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={cancelRecognizing}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={destroyRecognizer}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Destroy</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    textAlign: 'center',
    padding: 12,
  },
  imageButton: {
    width: 50,
    height: 50,
  },
  horizontalView: {
    flexDirection: 'row',
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
});
