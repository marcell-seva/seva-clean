import { DOT } from 'utils/stringUtils'

export const prefixWithZero = (originalNumber: number | string) => {
  return `0${originalNumber}`.slice(-2)
}

export const addSeparator = (
  value: string,
  separator = DOT,
  length = 3,
): string => {
  const tmp = value?.replace(separator, '')
  const reg = new RegExp('\\B(?=(\\d{' + length + '})+(?!\\d))', 'g')
  return tmp?.replace(reg, separator)
}

export const filterNonDigitCharacters = (input: string) => {
  const nonDigits = new RegExp(/[^\d]+/g)
  return input.replace(nonDigits, '')
}

export const onlyLettersAndSpaces = (str: string) => {
  return /^[A-Za-z\s]*$/.test(str)
}

export const onlyEmailFormat = (str: string) => {
  return /^[a-zA-Z 0-9\@\.\_\-]*$/.test(str)
}

export const emailValidation = (email: string) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return re.test(email)
}
