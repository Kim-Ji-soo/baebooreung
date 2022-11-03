import axios from 'axios';

baseUrl = 'http://k7c207.p.ssafy.io:8082/kafka';
export const sendGps = props => {
  axios({
    method: 'POST',
    url: baseUrl + '/gps',
    data: {
      userId: props.userId,
      latitude: props.latitude,
      longitude: props.longitude,
      requestDateTime: props.requestDateTime,
    },
    headers: {},
  })
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });
};
