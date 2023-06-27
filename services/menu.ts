import axios from 'axios'
import endpoints from 'helpers/endpoints'
import { API } from 'utils/api'

export const getMenus = () => {
  return API.get(endpoints.menu)
}

export const getMobileWebTopMenu = () => {
  return API.get(endpoints.mobileWebTopMenu)
}

export const getMobileFooterMenu = () => {
  return API.get(endpoints.mobileBottomMenu)
}
