import NaverMapView, {Marker} from 'react-native-nmap';
import {StyleSheet} from 'react-native';
const Map = props => {
  return (
    <NaverMapView
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
      }}></NaverMapView>
  );
};

export default Map;
