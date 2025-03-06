import React from 'react';
import { Dimensions, Platform, StyleSheet, View, Image } from 'react-native';
import { hp } from '../helpers/common';

const { width, height } = Dimensions.get('window');

const ParticleBackground = ({children}) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    flex: 1,
    backgroundColor: 'white'
  },
  particleAnimation: {
    position: 'absolute',
    width: width,
    height: hp(100) + 40,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageBg: {
    position: 'absolute',
    width: width,
    height: hp(90),
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default ParticleBackground;
