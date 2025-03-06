import { Pressable, StyleSheet, Text, View } from "react-native"
import { capitalize } from "../helpers/common"
import { colors } from "../constants/theme"

export const SectionView = ({title, content}) => {
    return <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>
        {content}
      </View>
    </View>
  }

  export const CommonFiltersRow = ({data, filters, setFilters, filterName}) => {
    
    const onSelect = (item) => {
      if (filters[filterName] == item){
        const newFilters = filters
        delete newFilters[filterName]
        setFilters({...newFilters})
        return
      }
      setFilters({...filters, [filterName]: item})
    }
    
    return (
    <View style={styles.flexRowWrap}>
      {data && data.map((item, index) => {
        let isActive = filters && filters[filterName] == item
        let backgroundColor = isActive ? colors.DARK_GRAY : colors.WHITE
        let color = isActive ? colors.WHITE : colors.BLACK
        return (
          <Pressable onPress={() => onSelect(item)} key={item} style={[styles.outlinedButton, {backgroundColor}]}>
            <Text style={[styles.outlinedButtonText, {color}]}>{capitalize(item)}</Text>
          </Pressable>
        )
      })}
    </View>
    )
  }

  export const ColorFilter = ({data, filters, setFilters, filterName}) => {
    
    const onSelect = (item) => {
      if (filters[filterName] == item){
        const newFilters = filters
        delete newFilters[filterName]
        setFilters({...newFilters})
        return
      }
      setFilters({...filters, [filterName]: item})
    }
    
    return (
    <View style={styles.flexRowWrap}>
      {data && data.map((item, index) => {
        let isActive = filters && filters[filterName] == item
        let borderColor = isActive ? colors.DARK_GRAY : colors.WHITE
        let shadowProperties = isActive ? {} : {
          elevation: 4, 
          shadowColor: "#000", 
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }
        return (
          <Pressable onPress={() => onSelect(item)} key={item}>
              <View style={[styles.colorWrapper, {borderColor}]}>
                <View style={[styles.color, {backgroundColor: item}, shadowProperties]}></View>
              </View>
          </Pressable>
        )
      })}
    </View>
    )
  }
  


const styles = StyleSheet.create({
  sectionContainer: {
    gap: 10
  }, 
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'outfit-medium'
  },
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  outlinedButtonText: {
    fontSize: 15,
    fontFamily: 'outfit',
  },
  colorWrapper: {
    borderColor: colors.DARK_GRAY,
    borderRadius: 12,
    borderWidth: 2,
    padding: 2,
  },
  color: {
    height: 30,
    width: 40,
    borderRadius: 10,
  }
})