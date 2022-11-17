import {View, Text, Pressable, StyleSheet} from 'react-native';

const CustomButton = props => {
  const pressHandler = () => {
    props.onPress(props.data);
  };
  return (
    <View style={props.ButtonStyle}>
      <Pressable
        style={({pressed}) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={pressHandler}
        android_ripple={{color: '#999999'}}>
        <Text style={styles.buttonText}>{props.children}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonInnerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});

export default CustomButton;
