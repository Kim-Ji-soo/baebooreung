import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import * as encoding from 'text-encoding';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/pages/HomeScreen';
import MyPageScreen from './src/pages/MyPageScreen';
import GPSScreen from './src/pages/GPSScreen';
import MessageScreen from './src/pages/MessageScreen';
import DetailWorkScreen from './src/pages/DetailWorkScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Provider} from 'react-redux';
import store from './src/redux/store';

// <-- driver App pages -->
import Gps from './src/pages/driverApp/Gps';
import MainScreen from './src/pages/driverApp/MainScreen';
import TestMap from './src/pages/driverApp/TestMap';
import Login from './src/pages/driverApp/Login';
import SignUp from './src/pages/driverApp/SignUp';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const isManager = false;

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen
        name="DetailWork"
        component={DetailWorkScreen}
        options={{
          headerStyle: {
            backgroundColor: '#29b6f6',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}></Stack.Screen>
      <Stack.Screen
        name="Gps"
        component={Gps}
        options={{
          headerStyle: {
            backgroundColor: '#29b6f6',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}></Stack.Screen>
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <NavigationContainer>
          {isManager ? (
            // <-- manager 로그인 시-->
            <Tab.Navigator initialRouteName="HomeStack">
              <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                  title: '홈',
                  headerShown: false,
                  tabBarIcon: ({color, size}) => (
                    <Icon name="home" color={color} size={size}></Icon>
                  ),
                }}></Tab.Screen>

              <Tab.Screen
                name="Message"
                component={MessageScreen}
                options={{
                  title: '메세지',
                  headerStyle: {
                    backgroundColor: '#29b6f6',
                  },
                  headerTitleAlign: 'center',
                  headerTintColor: '#ffffff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  tabBarIcon: ({color, size}) => (
                    <Icon name="chat" color={color} size={size}></Icon>
                  ),
                }}></Tab.Screen>
              <Tab.Screen
                name="GPS"
                component={GPSScreen}
                options={{
                  title: '실시간위치',
                  headerStyle: {
                    backgroundColor: '#29b6f6',
                  },
                  headerTitleAlign: 'center',
                  headerTintColor: '#ffffff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  tabBarIcon: ({color, size}) => (
                    <Icon name="gps-fixed" color={color} size={size}></Icon>
                  ),
                }}></Tab.Screen>
              <Tab.Screen
                name="MyPage"
                component={MyPageScreen}
                options={{
                  title: '마이페이지',
                  headerStyle: {
                    backgroundColor: '#29b6f6',
                  },
                  headerTitleAlign: 'center',
                  headerTintColor: '#ffffff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  tabBarIcon: ({color, size}) => (
                    <Icon name="person" color={color} size={size}></Icon>
                  ),
                }}></Tab.Screen>
            </Tab.Navigator>
          ) : (
            // <-- driver 로그인 시-->
            <Tab.Navigator initialRouteName="Gps">
              <Tab.Screen
                name="Gps"
                component={Gps}
                options={{
                  title: 'Gps',
                  headerStyle: {
                    backgroundColor: '#29b6f6',
                  },
                  headerShown: false,
                }}></Tab.Screen>
              <Tab.Screen
                name="home"
                component={MainScreen}
                options={{
                  title: 'Home',
                  headerStyle: {
                    backgroundColor: '#29b6f6',
                  },
                  headerShown: false,
                }}></Tab.Screen>
              <Tab.Screen
                name="TestMap"
                component={TestMap}
                options={{
                  title: 'naver',
                  headerStyle: {
                    backgroundColor: '#29b6f6',
                  },
                  headerShown: false,
                }}></Tab.Screen>
              <Tab.Screen
                name="Login"
                component={Login}
                options={{
                  title: 'Login',
                  headerStyle: {
                    backgroundColor: '#29b6f6',
                  },
                  headerShown: false,
                }}></Tab.Screen>
              <Tab.Screen
                name="SignUp"
                component={SignUp}
                options={{
                  title: 'SignUp',
                  headerStyle: {
                    backgroundColor: '#29b6f6',
                  },
                  headerShown: false,
                }}></Tab.Screen>
            </Tab.Navigator>
          )}
        </NavigationContainer>
      </Provider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
