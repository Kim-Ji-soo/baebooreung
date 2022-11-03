import axios from 'axios';

const baseUrl = 'http://k7c207.p.ssafy.io:8000/user-service/';

export const login = async props => {
  await axios({
    method: 'POST',
    url: baseUrl + 'login',
    data: {
      email: props.email,
      password: props.password,
    },
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
};

export const join = async props => {
  await axios({
    method: 'POST',
    url: baseUrl + 'join',
    data: {
      email: props.email,
      password: props.password,
      name: props.name,
      grade: props.grade,
      phone: props.phone,
      region: props.region, // type : int
    },
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
};
