import {Text, View, StyleSheet} from 'react-native';
import ManagerGPS from '../../components/ManagerGPS';
function GPSScreen() {
  return (
    <View style={styles.container}>
      <ManagerGPS></ManagerGPS>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GPSScreen;
