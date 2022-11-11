import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function PickRegion() {
  const [region, setRegion] = React.useState('');

  const handleChange = (event) => {
    setRegion(event.target.value);
  };

  return (
    <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">지역</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={region}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value={"seoul"}>서울</MenuItem>
        <MenuItem value={"gwangju"}>광주</MenuItem>
      </Select>
    </FormControl>
  );
}