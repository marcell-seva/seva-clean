import { createContext } from 'react'
import { NavbarItemResponse } from 'utils/types/utils'

interface MenuContextType {
  dataMenu: NavbarItemResponse[]
}

export const MenuContext = createContext<MenuContextType>({
  dataMenu: [],
})
