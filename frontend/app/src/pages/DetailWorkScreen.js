import { useEffect } from 'react';
import {Text, View} from 'react-native';

function DetailWorkScreen(props){
    useEffect(()=>{
        const headerTitle = props.route.params.headerTitle;
        props.navigation.setOptions({headerTitle : headerTitle});
    },[])
    return(
        <View>
        </View>
    )
}

export default DetailWorkScreen;