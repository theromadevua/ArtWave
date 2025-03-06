import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from './ImageCard';



const {width, height} = Dimensions.get('window')

const ImageGrid = ({images, router}) => {
  const columns = height === width ? 3 : height > width ? 2 : 4;


  return (
    <View style={styles.container}>
        <MasonryFlashList
            data={images}
            numColumns={columns}
            contentContainerStyle={styles.listContainerStyle}
            renderItem={({ item, index }) => {return <ImageCard router={router} item={item} index={index} columns={columns}/>}}
            estimatedItemSize={200}
        />
    </View>
  )
}

export default ImageGrid

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      width: '100%',
    },
    listContainerStyle: {
    }
})