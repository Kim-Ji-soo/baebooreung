import {useEffect} from 'react';
import {View, Text} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const Cam = () => {
  // const cameraPermission = getCameraPermissionStatus();
  // const microphonePermission = getMicrophonePermissionStatus();
  const newCameraPermission = Camera.requestCameraPermission();
  const newMicrophonePermission = Camera.requestMicrophonePermission();

  useEffect(() => {
    newCameraPermission;
    newMicrophonePermission;
  }, []);

  const devices = useCameraDevices();
  const device = devices.back;

  if (device == null)
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );
  return <Camera style={{flex: 1}} device={device} isActive={true} />;
};

export default Cam;
