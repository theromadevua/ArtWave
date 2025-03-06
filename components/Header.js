
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { hp, isWeb, wp } from '../helpers/common';

const Header = ({openFiltersModal, scrollY, searchInputRef, search, setSearch, handleSearch, handleTextDebounce}) => {

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: scrollY > 1 ? 1 : 0, 
            duration: 100,
            useNativeDriver: false,
            easing: Easing.linear,
        }).start();
    }, [scrollY]);
    
    const backgroundColorStyle = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
    });

    const ShadowStyle = {
        elevation: 4, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    }

  return (
    <Animated.View style={[styles.header, { backgroundColor: backgroundColorStyle}, scrollY > 1 && ShadowStyle]}>
        <View style={{flexDirection: 'row', gap: 20}}>
            {scrollY < 1 && isWeb && <Pressable>
                <Text style={[styles.title, {color: scrollY > 1 ? 'black' : 'white'}]}>ArtWave</Text>
            </Pressable>}
            {scrollY > 1 && (
                <View style={[styles.searchBar]}>
                    <Feather name="search" size={24} color={colors.GRAY} />
                    <TextInput
                        ref={searchInputRef}
                        value={search}
                        onChangeText={(text) => {
                            setSearch(text);
                            handleTextDebounce(text);
                        }}
                        placeholder="Search wallpapers"
                        style={styles.searchInput}
                    />
                    {search && (
                        <Pressable style={styles.closeIcon} onPress={() => { setSearch(''); handleTextDebounce(''); }}>
                            <Ionicons name="close" size={24} color={colors.GRAY} />
                        </Pressable>
                    )}
                </View>
            )}
        </View>
        <Pressable onPress={openFiltersModal}>
            <FontAwesome6 name="bars-staggered" size={22} color={scrollY > 1 ? 'black' : 'white'} />
        </Pressable>
    </Animated.View>
  )
}

export default Header

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: wp(100),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        gap: 20,
        zIndex: 10,
        height: 60,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: colors.LIGHT_GRAY,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 30,
        width: wp(70),
        maxWidth: 400,
    },
    title: {
        fontSize: hp(4),
        fontFamily: 'outfit',
        color: colors.WHITE,
    },
    searchInput: {
        paddingHorizontal: 10,
        fontSize: hp(1.8),
        fontFamily: 'outfit',
        outlineStyle: 'none',
        width: wp(70) - 20 - 50,
    },
    closeIcon: {
        backgroundColor: colors.LIGHT_GRAY,
        borderRadius: 10,
    },
})