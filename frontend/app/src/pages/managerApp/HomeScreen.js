import {StyleSheet, Text, View, ScrollView, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import ManagerHome from '../../components/MangaerHome';


const {height : SCREEN_HEIGHT, width : SCREEN_WIDTH} = Dimensions.get('window');

function HomeScreen({navigation}){
    return(
        <View style={styles.container}>
            <ManagerHome navigation={navigation}></ManagerHome>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
    }
});
export default HomeScreen;