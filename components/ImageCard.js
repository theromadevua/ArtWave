import { Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { getImageSize, wp } from '../helpers/common'

const ImageCard = ({item, index, columns, router}) => {
    const getImageHeight = () => {
        let {imageHeight: height, imageWidth: width} = item
        return {height: getImageSize(height, width)}
    }

  return (
    <Pressable onPress={() => {router.push({pathname: 'home/image', params: {...item}})}} style={[styles.imageWrapper, styles.spacing]}>
        <Image 
            transition={1000} 
            style={[styles.image, getImageHeight()]} 
            source={{uri: item?.webformatURL}}
        />
    </Pressable>
  )
}

export default ImageCard

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: '100%'
    },
    imageWrapper: {
        borderRadius: 18,
        overflow: 'hidden',
        borderCurve: 'continuous',
        marginBottom: 10
    },
    spacing: {
        marginHorizontal: 5
    }
})