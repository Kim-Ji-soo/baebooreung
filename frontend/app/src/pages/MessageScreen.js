import {StyleSheet, View} from 'react-native';
import ManagerChat from "../components/ManagerChat"

function MessageScreen({navigation}){
    return(
        <View style={styles.container}>
            <ManagerChat navigation={navigation}></ManagerChat>
        </View>
    )
}
const styles = StyleSheet.create({
    container : {
        flex: 1,
        flexDirection : 'row',
        backgroundColor : 'white',
    }
});
export default MessageScreen;