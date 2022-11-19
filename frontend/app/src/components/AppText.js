import React from 'react';
import {Text} from 'react-native';

const AppText = props => {
  <Text
    {...props}
    style={{
      ...props.style,
      fontFamily: 'BMJUA_ttf',
    }}>
    {props.children}
  </Text>;
};

export default AppText;
