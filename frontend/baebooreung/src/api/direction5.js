import axios from 'axios';

const X_NCP_APIGW_API_KEY_ID = "i3oq00t777"
const X_NCP_APIGW_API_KEY = "SKQeRSOuZty3XKmuYfGHjQ2GNGUUS6c3wGhroXsG"
const headers = {
  "X-NCP-APIGW-API-KEY-ID": X_NCP_APIGW_API_KEY_ID,
  "X-NCP-APIGW-API-KEY" : X_NCP_APIGW_API_KEY
}

export const direction5 = () => {
  const url = `/map-direction-15/v1/driving?start=126.9109,35.1802&goal=126.9108,35.1804&waypoints=126.9027,35.1749`
  axios.get(url, {
    headers: headers
  }).then((res) => {
    const path = res.data.route.traoptimal[0].path
    console.log(res.data.route.traoptimal[0].path)
  })
}