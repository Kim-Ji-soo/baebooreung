import * as React from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function PickDate() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="날짜"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField size='small' sx={{ marginRight:3, marginLeft:1, width:150}} {...params} />}
      />
    </LocalizationProvider>
  );
}
