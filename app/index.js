import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { hp, wp } from '../helpers/common'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../constants/theme'
import { useRouter } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'

const Index = () => {
  const router = useRouter()

   return (
    <View style={styles.container}>
      
        <Image source={require('../assets/images/bg.jpg')} style={styles.bgImage}/>
    
        <LinearGradient 
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
            style={styles.gradient}
            start={{x:0.5, y:0.5}}
            end={{x:0.5, y: 0.8}}
        />

        <Animated.View entering={FadeInDown.springify()} style={styles.contentContainer}>
    
          <View style={styles.textContainer}>
              <Text style={styles.title}>
                ArtWave
              </Text>
              <Text style={styles.punchline}>
                Beautiful Pictures and Backscapes
              </Text>
          </View>
          
          <View>
            <View style={[styles.startButton]}>
              <Text style={styles.startText}>Start Exploring</Text>
            </View>
            <Pressable 
              onPress={() => {router.push('/home')}} 
              style={[styles.startButton, {zIndex: 11, position: 'absolute', bottom: 0, opacity: 0}]}
            >
            <Text style={styles.startText}>Start Exploring</Text>
            </Pressable>
          </View>

        </Animated.View>
 
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    paddingBottom: hp(5),
  },
  title: {
    fontSize: hp(5.5),
    color: colors.BLACK,
    fontFamily: 'outfit-bold',
    marginVertical: -15,
  },
  punchline: {
    fontSize: hp(2),
    color: colors.DARK_GRAY,
    fontFamily: 'outfit',
  },
  startButton: {
    backgroundColor: colors.DARK_GRAY,
    color: colors.WHITE,
    paddingVertical: hp(1.7),
    width: wp(85),
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 15,
  },
  startText: {
    color: colors.WHITE,
    fontSize: hp(2.4),
    fontFamily: 'outfit'
  },
  animatedImage: {
    width: wp(50),
    height: wp(50),
    left: (wp(25) - (wp(15) / 2)),
    marginBottom: -50,
    zIndex: 10,
    resizeMode: 'contain'
  },
  textContainer: {
    alignItems: 'center',
    width: wp(100),
    gap: 20,
  },
  gradient: {
    width: '100%',
    height: hp(80),
    bottom: 0,
    position: 'absolute'
  }
})

export default Index