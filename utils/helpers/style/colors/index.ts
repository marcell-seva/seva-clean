import { prefixWithZero } from 'utils/handler/stringManipulation'

export const colors = {
  primary1: '#002373',
  primary2: '#D4D3ED',
  primary3: '#002373',
  primaryLight1: '#5CC9FC',
  primaryLight2: '#D6F1FE',
  primaryLight3: '#0023731a',
  primaryLight4: '#B3CCE6',
  primaryLight5: '#DEF1FA',
  primaryDark: '#042647',
  primarySky: '#CBE5F4',
  primarySky2: '#A8D3ED',
  primarySkyBlue10: '#EEF6FB',
  primarySkyBlue: '#51A8DB',
  primaryDarkBlue: '#05256E',
  primaryRed: '#D83130',
  primaryBlue: '#246ed4',
  primaryBlack: '#13131B',
  secondary: '#EC0A23',
  secondaryLight: '#DEF7DF',
  secondaryText: '#2CAA30',
  secondary20: '#FFEAC5',
  secondaryDark: '#E59300',
  secondaryDark2: '#F7AA20',
  secondaryDark3: '#031744',
  secondaryBrickRed: '#B4231E',
  line: '#E4E9F1',
  inputBg: '#F2F5F9',
  carBg: '#F7FAFF',
  white: '#FFFFFF',
  offWhite: '#FCFCFC',
  title: '#031838',
  black: '#000000',
  outlined: '#1C2F4C',
  placeholder: '#9EA3AC',
  author: '#51A8DB',
  background: '#F7F7FC',
  error: '#E01F2A',
  errorLight: '#F4D9DB',
  success: '#0EC996',
  successLight: '#DDF5EF',
  warning: '#FFD749',
  warningLight: '#F6ECD9',
  body: '#2F415E',
  body2: '#404040',
  label: '#52627A',
  pageBg: '#F4F6F9',
  plusIcon: '#14142B',
  modalShadow: '#111111',
  red: '#EC0A23',
  lightBlue: '#3f5a96',
  lightGrey: '#9fa3ac',
  transparentBlue: '#cfd6e5',
  transparentGrey: '#e7e8ea',
  greyscale: '#252525',
  supportSuccess: '#26C649',
  greyscale2: '#E4E9F1',
  offwhite: '#D4D4D4',
  shadesGrey25: '#CDD0D4',
} as const

type ColorName = keyof typeof colors

export const transparent = (colorName: ColorName, alpha: number): string => {
  if (alpha < 0 || alpha > 1) {
    return colors[colorName]
  }

  const hexa = Math.round(alpha * 255)
    .toString(16)
    .toUpperCase()

  return colors[colorName] + prefixWithZero(hexa)
}
