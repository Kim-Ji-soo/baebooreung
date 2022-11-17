import {useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  Pressable,
  PermissionsAndroid,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Mic from '../assets/images/mic.png';
import MicOFF from '../assets/images/micoff.png';
import SoundRecorder from 'react-native-sound-recorder';
import RNFS from 'react-native-fs';
import axios from 'axios';
import {voice} from '../api/api';
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default function AudioRecord(props) {
  const [mic, setMic] = useState(false);
  const formData = new FormData();

  const requestRecordingAudioPermission = async () => {
    try {
      granted = await PermissionsAndroid.request(
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

  const startRecord = async () => {
    try {
      await SoundRecorder.start(
        SoundRecorder.PATH_DOCUMENT + '/voice.mp4',
      ).then(function () {
        console.log(
          'started recording : ' + SoundRecorder.PATH_DOCUMENT + '/voice.mp4',
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecord = async () => {
    await SoundRecorder.stop().then(function (res) {
      console.log('stopped recording, audio file saved at: ' + res.path);
    });

    await RNFS.readFile(
      RNFS.DocumentDirectoryPath + '/voice.mp4',
      'base64',
    ).then(result => {
      const base64Result = result.toString();
      axios({
        url: voice.speechToText(),
        method: 'post',
        data: {
          file: base64Result,
        },
      })
        .then(res => {
          props.propFunction(res.data.text);
          console.log(res.data.text);
        })
        .catch(e => {
          console.log(e);
        });
    });
  };

  useEffect(() => {
    requestRecordingAudioPermission();
  }, []);

  return (
    <View style={styles.container}>
      {!mic && (
        <Pressable
          onPress={() => {
            startRecord();
            setMic(!mic);
          }}>
          <Image source={Mic} style={styles.image} />
        </Pressable>
      )}
      {mic && (
        <Pressable
          onPress={() => {
            stopRecord();
            setMic(!mic);
          }}>
          <Image source={MicOFF} style={styles.image} />
        </Pressable>
      )}
      {/* <Text>{text}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 5,
    padding: 5,
    borderRadius: 10,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 10,
    shadowOpacity: 0.4,
  },
  image: {
    resizeMode: 'stretch',
    width: 30,
    height: 30,
  },
});
