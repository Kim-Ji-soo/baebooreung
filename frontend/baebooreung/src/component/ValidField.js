import React, {useState} from 'react';
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
    <form noValidate autoComplete="off">
      <TextField
        id="standard-name"
        label="Name"
        variant="outlined"
        value={value}
        onChange={onChange}

        InputLabelProps={{
          classes: {
            root: {
              color: 'red !important',
            },
          },
        }}
        InputProps={{
          classes: {
            root: {
              '&$cssFocused $notchedOutline': {
                borderColor: `red !important`,
              },
            },
            notchedOutline: {
              borderWidth: '3px',
              borderColor: 'red !important',
            },
          },
        }}
      />
    </form>
  );
}

export default ValidField;