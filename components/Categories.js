import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import { colors } from '../constants/theme'
import { ap, hp, wp } from '../helpers/common';
import Animated, { FadeInRight } from 'react-native-reanimated';

const Categories = ({categories, handleChangeCategory, activeCategory}) => {
  
  const flatListRef = useRef()
  
  return (
    <FlatList
     ref={flatListRef}
     horizontal 
     contentContainerStyle={styles.flatListContainer}
     showsHorizontalScrollIndicator={false}
     data={categories}
     keyExtractor={item => item}
     renderItem={({item, index}) => (
        <CategoryItem
            flatListRef={flatListRef}
            title={item}
            index={index}
            isActive={activeCategory == item}
            handleChangeCategory={handleChangeCategory}
        /> 
     )}
    />
  )
}

const CategoryItem = ({flatListRef, title, index, isActive, handleChangeCategory}) => {
    


  const textCategoryStyle = {
    color: isActive ? colors.WHITE : colors.BLACK,
    fontSize: ap(0.65)
  }

  const categoryStyle = {
    backgroundColor: isActive ? 'rgba(0,0,0,0.5)' : colors.LIGHT_GRAY,
  }

  return (
      <Animated.View entering={FadeInRight.springify().delay((index*100)+100)}>
        <Pressable 
          onPress={() => {flatListRef.current.scrollToOffset({ animated: true, offset: 0 }); handleChangeCategory(isActive ? null : title)}} 
          style={[styles.category, categoryStyle]}
        >
            <Text style={[styles.title, textCategoryStyle]}>{title}</Text>
        </Pressable>
      </Animated.View>
    )
}

export default Categories

const styles = StyleSheet.create({
    flatListContainer: {
        paddingHorizontal: 15,
        gap: 8
    },
    category: {
      overflow: 'hidden',
      borderRadius: 99,
      padding: ap(0.2),
      paddingHorizontal: ap(0.6),
    },
    title: {
      fontFamily: 'outfit',
      color: colors.DARK_GRAY
    }
})