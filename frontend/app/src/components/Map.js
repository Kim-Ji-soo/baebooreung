import NaverMapView, {Marker} from 'react-native-nmap';

const Map = props => {
  const coords = {
    latitude: props.coords.latitude,
    longitude: props.coords.longitude,
  };
  return (
    <NaverMapView
      showsMyLocationButton={true}
      style={{width: '80%', height: '30%'}}>
      <Marker coordinate={coords} pinColor="blue" />
    </NaverMapView>
  );
};

export default Map;
