import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

function ValidField () {
  
  const [value, setValue] = useState('');

  const onChange = (e)=> {
      setValue(e.target.value)
  }

  const validation =()=>{
    let check = /[~!@#$%^&*()_+|<>?:{}.,/;='"ㄱ-ㅎ | ㅏ-ㅣ |가-힣]/;
    return check.test(value);
  }

  return (
    <TextField
      id="standard-name"
      label="ID"
      variant="outlined"
      value={value}
      onChange={onChange}
      error={validation()}
      helperText={validation() ? "특수기호나 한글은 입력 하실 수 없습니다.":""}
    />
  );
}

export default ValidField;