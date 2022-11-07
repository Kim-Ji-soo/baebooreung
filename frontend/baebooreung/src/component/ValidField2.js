import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

// const [value, setValue] = useState('');

// const onChange = (e)=> {
//     setValue(e.target.value)
// }

// const validation =()=>{
//   let check = /[~!@#$%^&*()_+|<>?:{}.,/;='"ㄱ-ㅎ | ㅏ-ㅣ |가-힣]/;
//   return check.test(value);
// }

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },

  cssLabel: {
    color: 'red !important',
  },

  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `red !important`,
    },
  },

  cssFocused: {},

  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'red !important',
  },
});


class ValidField2 extends React.Component {
  state = {
    name: 'InputMode',
  };

  validation =()=>{
    let check = /[~!@#$%^&*()_+|<>?:{}.,/;='"ㄱ-ㅎ | ㅏ-ㅣ |가-힣]/;
    return check.test();
  }
  
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  render() {

    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="standard-name"
          label="Name"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
          variant="outlined"
          helperText={this.validation() ? "특수기호나 한글은 입력 하실 수 없습니다.":""}

          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
            inputMode: 'numeric',
          }}
        />
      </form>
    );
  }
}

ValidField2.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ValidField2);
