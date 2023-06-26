import axios from 'axios'
import endpoints from 'helpers/endpoints'

export const getMenus = () => {
  return axios.get(endpoints.menu)
}

export const getMobileWebTopMenu = () => {
  return axios.get(endpoints.mobileWebTopMenu)
}

export const getMobileFooterMenu = () => {
  return axios.get(endpoints.mobileBottomMenu)
}
