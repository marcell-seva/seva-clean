import { maxPageWidthNumber, screenWidth } from 'styles/globalStyle'

export const getClientWidth = () =>
  Math.min(screenWidth as number, maxPageWidthNumber)
