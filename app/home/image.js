import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Easing,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ap, wp } from '../../helpers/common';
import { Entypo, Octicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';
import * as MediaLibrary from 'expo-media-library';
import { Animated as RNAnimated } from 'react-native';
import Animated from 'react-native-reanimated';
import { FadeInDown } from 'react-native-reanimated';

const ImageComponent = () => {
    const router = useRouter();
    const item = useLocalSearchParams();
    const [status, setStatus] = useState('loading');
    const uri = item?.webformatURL;
    const fileName = item?.previewURL.split('/').pop();
    const imageUrl = uri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    const fadeAnim = useRef(new RNAnimated.Value(0)).current;
    const backgroundOpacity = useRef(new RNAnimated.Value(0)).current;
    const imageScale = useRef(new RNAnimated.Value(0.9)).current;
    
    const getPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Необходимо разрешение для сохранения изображений.');
            }
        }
    };

    useEffect(() => {
        RNAnimated.timing(fadeAnim, {
            toValue: 1,
            duration: 200, 
            useNativeDriver: true,
        }).start();
        RNAnimated.timing(imageScale, {
            toValue: 1,
            duration: 200, 
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
        RNAnimated.timing(backgroundOpacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, []);

    const onLoad = () => {
        setStatus('loaded');
    };
    const onError = () => {
        setStatus('Failed to Load Image');
    };

    const getSize = () => {
        const aspectRatio = item?.imageWidth / item?.imageHeight;
        const maxWidth = Dimensions.get('window').width > 700 ? 700 : wp(92);
        let calculateHeight = maxWidth / aspectRatio;
        let calculateWidth = maxWidth;

        if (aspectRatio < 1) {
            calculateWidth = calculateHeight * aspectRatio;
        }
        return {
            width: calculateWidth,
            height: calculateHeight,
        };
    };

    const handleDownloadImage = async () => {
        getPermission();
        setStatus('downloading');
        let uri = await downloadFile();
        if (uri) {
            showToast('Image downloaded');
        }
    };

    const handleShareImage = async () => {
        setStatus('sharing');
        let uri = await downloadFile();
        if (uri) {
            await Sharing.shareAsync(uri);
        }
        setStatus('');
    };

    const downloadFile = async () => {
        try {
            if (Platform.OS !== 'web') {
                const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
                await MediaLibrary.createAssetAsync(uri);
                setStatus('');
                return uri;
            } else {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(blobUrl);
                setStatus('');
                return null;
            }
        } catch (error) {
            console.log(error.message);
            Alert.alert('Image', error.message);
            setStatus('');
            return null;
        }
    };

    const showToast = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'bottom',
        });
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <View
            style={[
                styles.container,
            ]}
        >
            <BlurView experimentalBlurMethod='dimezisBlurView' intensity={90} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={[getSize()]}>
                <RNAnimated.View style={[styles.loading, {opacity: backgroundOpacity}]}>
                    {status === 'loading' && (
                        <ActivityIndicator size="large" color="white" />
                    )}
                </RNAnimated.View>
                <RNAnimated.Image
                    onLoad={onLoad}
                    onError={onError}
                    transition={100}
                    style={[styles.image, getSize(), {opacity: backgroundOpacity, transform: [{scale: imageScale}]}]}
                    source={{
                        uri: uri,
                    }}
                />
            </View>
            <View style={styles.buttons}>
                <Animated.View entering={FadeInDown.springify().delay(100)} >
                    <Pressable onPress={handleClose} style={styles.button}>
                        <Octicons name="x" size={22} color={colors.WHITE} />
                    </Pressable>
                </Animated.View>
                <Animated.View entering={FadeInDown.springify().delay(200)} >
                    {status === 'downloading' ? (
                        <View style={styles.button}>
                            <ActivityIndicator size="small" color="white" />
                        </View>
                    ) : (
                        <Pressable style={styles.button} onPress={handleDownloadImage}>
                            <Octicons name="download" size={22} color={colors.WHITE} />
                        </Pressable>
                    )}
                </Animated.View>
                <Animated.View entering={FadeInDown.springify().delay(300)} >
                    {status === 'sharing' ? (
                        <View style={styles.button}>
                            <ActivityIndicator size="small" color="white" />
                        </View>
                    ) : (
                        <Pressable style={styles.button} onPress={handleShareImage}>
                            <Entypo name="share" size={22} color={colors.WHITE} />
                        </Pressable>
                    )}
                </Animated.View>
            </View>
        </View>
    );
};

export default ImageComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    image: {
        height: 400,
        width: wp(70),
        borderRadius: 15,
    },
    loading: {
        position: 'absolute',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    buttons: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 50,
    },
    button: {
        height: ap(2),
        width: ap(2),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
});
