import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {Alert} from 'react-native';

function firebase() {
  // background, quit
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);
}
