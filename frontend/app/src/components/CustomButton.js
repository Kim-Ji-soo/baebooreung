import {View, Text, Pressable, StyleSheet} from 'react-native';

const CustomButton = props => {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({pressed}) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        // onPress={pressHandler}
        android_ripple={{color: '#999999'}}>
        <Text style={styles.buttonText}>{props.children}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderWidth: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonInnerContainer: {
    paddingVertical: 16,
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
