import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Work from '../../components/Work';

const MainScreen = () => {
  return (
    <View style={styles.MainRootContainer}>
      <View style={styles.MainHeader}>
        <Text style={styles.MainHeaderText}>대시보드</Text>
      </View>
      <ScrollView>
        <Work />
        <Work />
        <Work />
        <Work />
      </ScrollView>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  MSContainer: {
    flex: 1,
  },
  MainHeader: {
    padding: 5,
  },
  MainHeaderText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
