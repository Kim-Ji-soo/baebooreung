import {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import DetailGPS from '../../components/DetailGPS';

function DetailGPSScreen(props) {
  useEffect(() => {
    const headerTitle = props.route.params.headerTitle;
    props.navigation.setOptions({headerTitle: headerTitle});
  }, []);
  return (
    <View style={styles.container}>
      <DetailGPS
        routeName={props.route.params.headerTitle}
        routeList={props.route.params.routeList}></DetailGPS>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DetailGPSScreen;
