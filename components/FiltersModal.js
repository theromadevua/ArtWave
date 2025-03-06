import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { ColorFilter, CommonFiltersRow, SectionView } from './FilterViews'
import * as data from '../constants/data'
import { ap, capitalize, wp } from '../helpers/common'
import { colors } from '../constants/theme'
import Animated, { FadeInDown } from 'react-native-reanimated'

const FiltersModal = ({filters, modalRef, setFilters, onClose, onApply, onReset}) => {

  const snapPoints = useMemo(() => ['75%'], [])
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={BackdropComponent}
    >
      <BottomSheetView style={styles.contentContainer}>
        
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
             let sectionView = sections[sectionName]
             let sectionData = data.filters[sectionName]
             let title = capitalize(sectionName)
             return (
              <Animated.View entering={FadeInDown.springify().delay((index*100)+100)} key={sectionName}>
                <SectionView 
                  title={title} 
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName
                  })}
                  
                />
              </Animated.View>
             )
          })}


          <Animated.View entering={FadeInDown.springify().delay(500)} style={styles.buttons}>
              <Pressable style={styles.resetButton} onPress={onReset}>
                <Text style={[styles.buttonText, {color: colors.DARK_GRAY}]}>Reset</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={onApply}>
                <Text style={[styles.buttonText, {color: colors.WHITE}]}>Apply</Text>
              </Pressable>
          </Animated.View>

        </View>

      </BottomSheetView>
    </BottomSheetModal>
  )
}

const sections = {
  "order": (props) => <CommonFiltersRow {...props}/>,
  "orientation": (props) => <CommonFiltersRow {...props}/>,
  "type": (props) => <CommonFiltersRow {...props}/>,
  "colors": (props) => <ColorFilter {...props}/>
}



 
const BackdropComponent = ({ animatedIndex, style }) => {

  const containerStyle = [
    style,
    styles.overlay,
    StyleSheet.absoluteFill,
  ];

  return (
      <>
      {Platform.OS === 'web' ? (
        <View style={containerStyle}>
        </View>
        ) : (
        <View style={containerStyle}>
        </View>
      )}
      </>
  );
};


export default FiltersModal

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content: {
    maxWidth: 500,
    flex: 1,
    width: '100%',
    gap: 15,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  filterText: {
    fontSize: 20,
    fontFamily: 'outfit-medium',
    marginBottom: 15
  },
  buttons: {
    width: wp(100) - 30,
    height: 24 + 20,
    alignItems: 'end',
    gap: 10,
    flexDirection: 'row',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 15,
  },
  applyButton: {
    flex: 1,
    backgroundColor: colors.DARK_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 24 + 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: colors.LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 24 + 20,
  },
  buttonText: {
    fontSize: ap(0.65)
  }
})