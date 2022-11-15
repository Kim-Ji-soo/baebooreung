import NaverMapView, {Marker} from 'react-native-nmap';
import {useSelector} from 'react-redux';

const Map = props => {
  const lunchRoute = useSelector(state => state.work.lunchRoute);
  console.log('Map', lunchRoute);
  const position = {
    latitude: props.coords.latitude,
    longitude: props.coords.longitude,
  };
  return (
    <NaverMapView
      center={{...position, zoom: 16}}
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
      }}>
      <Marker coordinate={props.myLocation} />
      <Marker coordinate={props.targetLocation} />
    </NaverMapView>
  );
};

export default Map;
