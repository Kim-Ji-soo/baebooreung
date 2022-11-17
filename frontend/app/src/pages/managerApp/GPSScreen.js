import {Text, View, StyleSheet} from 'react-native';
import ManagerGPS from '../../components/ManagerGPS';
function GPSScreen({navigation}) {
  return (
    <View style={styles.container}>
      <ManagerGPS navigation={navigation}></ManagerGPS>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GPSScreen;
