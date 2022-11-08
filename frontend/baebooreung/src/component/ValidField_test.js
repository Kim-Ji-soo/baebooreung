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
    width: 2000,
  },

  cssLabel: {
    color: '#4e8aff ',
  },

  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `#4e8aff`,
      borderWidth: '1px',
    },
  },

  cssFocused: {
  },

  notchedOutline: {
    borderWidth: '1px',
    borderColor: '#4e8aff',
  },
});


class ValidField2 extends React.Component {
  state = {
    name: '',
  };

  validation = (name)=>{
    let check = /[~!@#$%^&*()_+|<>?:{}.,/;='"ㄱ-ㅎ | ㅏ-ㅣ |가-힣]/;
    return check.test(name);
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
          error={this.validation(this.state.name)}
          helperText={this.validation(this.state.name) ? "특수기호나 한글은 입력 하실 수 없습니다.":""}

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
