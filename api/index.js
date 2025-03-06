import axios from "axios"
import { isVertical } from "../helpers/common"
import { API_KEY } from '@env';

const API_URL = `https://pixabay.com/api/?key=${API_KEY}`

const formatUrl = (params) => {
    let url = API_URL + "&per_page=25" + "&safesearch=false" + "&editors_choice=false"
    if(!params) return url
    if(!params.orientation) params.orientation = isVertical()
    let paramKeys = Object.keys(params)
    paramKeys.map(key=>{
        let value = key == 'q' ? encodeURIComponent(params[key]) : params[key]
        url += `&${key}=${value}`
    })
    return url
}

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params))
        return {success: true, data: response.data}
    } catch (error) {
        console.log('api error', error)
        return {success: false, msg: error.message}
    }
}