import {StyleSheet, Text, View} from 'react-native';
import AudioRecord from '../../components/AudioRecord';
// import Voice from '../../components/Voice';
function STTScreen() {
  return (
    <View style={styles.container}>
      <AudioRecord></AudioRecord>
      {/* <Voice></Voice> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default STTScreen;
