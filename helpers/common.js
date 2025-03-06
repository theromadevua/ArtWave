import { Dimensions, Platform } from "react-native"

const {width, height} = Dimensions.get('window')

export const wp = percentage => {
    return (width*percentage)/100
}

export const hp = percentage => {
    return (height*percentage)/100
}

export const ap = percentage => {
    return wp(percentage / 6) + hp(percentage * 2.5)
}

export const isWeb = () => {
    return Platform.OS == 'web'
}

export const isVertical = () => {
    return (height === width ? "all" : height > width ? "vertical" : "horizontal")
}

export const getImageSize = (imageHeight, imageWidth) => {
    const ratio = imageWidth / imageHeight
    const imageComponentWidth = (wp(100) - 40) / (height === width ? 3 : height > width ? 2 : 4)
    return imageComponentWidth / ratio
}

export const capitalize = str => {
    return str.replace(/\b\w/g, l => l.toUpperCase())
}