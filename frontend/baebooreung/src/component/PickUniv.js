import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



export default function PickUniv() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ marginLeft: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">대학</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={age}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value={10}>전남대학교</MenuItem>
        <MenuItem value={20}>광주과학기술원</MenuItem>
      </Select>
    </FormControl>
  );
}