import NaverMapView, {Marker} from 'react-native-nmap';
import {useSelector} from 'react-redux';

const Map = props => {
  const myLocation = props.myLocation;
  const targetLocation = props.targetLocation;
  return (
    <NaverMapView
      center={{...myLocation, zoom: 16}}
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
      }}>
      <Marker coordinate={myLocation} />
      <Marker coordinate={targetLocation} />
    </NaverMapView>
  );
};

export default Map;
