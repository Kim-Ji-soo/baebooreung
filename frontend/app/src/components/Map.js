import NaverMapView, {Marker} from 'react-native-nmap';
import {StyleSheet} from 'react-native';
const Map = props => {
  const coords = {
    latitude: props.coords.latitude,
    longitude: props.coords.longitude,
  };
  const P2 = {latitude: 37.565383, longitude: 126.976292};
  return (
    <NaverMapView
      style={{width: props.width, height: props.height}}
      center={{...coords, zoom: 16}}>
      <Marker coordinate={coords} />
    </NaverMapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
