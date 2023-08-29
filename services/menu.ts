import { api } from 'services/api'

export const getMenus = () => {
  return api.getMenu()
}

export const getMobileWebTopMenu = () => {
  return api.getMobileHeaderMenu()
}

export const getMobileFooterMenu = () => {
  return api.getMobileFooterMenu()
}
