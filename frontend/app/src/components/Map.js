import NaverMapView, {Marker} from 'react-native-nmap';
import {StyleSheet} from 'react-native';
const Map = props => {
  const coords = {
    latitude: props.coords.latitude,
    longitude: props.coords.longitude,
  };
  return (
    <NaverMapView
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
      }}
      center={{...coords, zoom: 14}}>
      <Marker coordinate={coords} />
    </NaverMapView>
  );
};

export default Map;
