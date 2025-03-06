import { View, Text, Platform, StatusBar, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { ap } from '../helpers/common';

const Layout = () => {

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'jersey': require('./../assets/fonts/Jersey25-Regular.ttf'),
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  if (!fontsLoaded) {
    return (
      <View>
        <Text>Problem with fonts...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home/index" />
          <Stack.Screen name="home/image" options={{ presentation: 'transparentModal', animation: 'fade' }} />
        </Stack>

        {isMounted && (
          <Toast
            config={{
              success: ({ text1 }) => (
                <View style={styles.toast}>
                  <Text style={styles.toastText}>{text1}</Text>
                </View>
              ),
            }}
            visibilityTime={2500}
            position="bottom"
            bottomOffset={40}
          />
        )}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>

  );

};


export default Layout;


const styles = StyleSheet.create({
  toast: {
      padding: 15,
      paddingHorizontal: 30,
      borderRadius: 99,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)'
  },
  toastText: {
      fontSize: ap(0.7),
      fontFamily: 'outfit',
      color: 'white'
  }
});