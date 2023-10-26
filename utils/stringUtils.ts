export const DOT = '.'
export const COMMA = ','

export const filterNonLetterOrSpaceCharacters = (input: string) => {
  const notLetterOrSpace = new RegExp(/[^a-zA-Z ]+/g)
  return input.replace(notLetterOrSpace, '')
}

export const filterNonDigitCharacters = (input: string) => {
  const nonDigits = new RegExp(/[^\d]+/g)
  return input.replace(nonDigits, '')
}

const capitalizeSingleWord = (str: string) => {
  return (
    str.charAt(0).toUpperCase() +
    str.substring(1, str.length).toLocaleLowerCase()
  )
}
const capitalize = (str: string, character: ' ' | '/' | '-') => {
  const arr = str.split(character)
  return arr
    .map((item) => {
      return capitalizeSingleWord(item)
    })
    .join(character)
}
export const capitalizeWords = (str: string) => {
  const arr = str.split(' ')
  return arr
    .map((item) => {
      const array1 = item.split('/')
      return array1
        .map((item2) => {
          return capitalize(item2, '-')
        })
        .join('/')
    })
    .join(' ')
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

export const isAmountValid = (value: string): boolean => {
  return /(^[1-9](\d{6,8})$)/.test(value)
}

export const isAmountValidSpecialRate = (value: string): boolean => {
  return /(^[1-9](\d{6,9})$)/.test(value)
}
export const isZipCodeValid = (value: string): boolean => {
  return /(^[1-9](\d{4})$)/.test(value)
}

export const isEmailValid = (value: string): boolean => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value,
  )
}

export const maskPhoneNumber = (value: string): string => {
  const firstThreeCharacters = value.substring(0, 3)
  const lastFourCharacters = value.substring(value.length - 4)
  return `${firstThreeCharacters}****${lastFourCharacters}`
}

export const replaceSuffixWith = (value: string, newSuffix: string): string => {
  return value.replace(
    /\.[^.]+$/,
    newSuffix.indexOf(DOT) !== -1 ? newSuffix : `${DOT}${newSuffix}`,
  )
}
export const toNumber = (inputString: undefined | string) => {
  if (inputString) {
    return Number(inputString)
  } else return null
}

export const prefixWithZero = (originalNumber: number | string) => {
  return `0${originalNumber}`.slice(-2)
}

export const convertSlashesInStringToVerticalLines = (
  originalString: string,
) => {
  return originalString.replace(/\//g, '|')
}

export const removeWhitespacesAndToLowerCase = (input: string) => {
  return input.replace(/\s/g, '').toLowerCase()
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const removeWhitespaces = (input: string) => {
  return input.replace(/\s/g, '')
}

export const getMaskingName = (name: string) => {
  const nameArray = name.split(' ')
  nameArray.forEach((item, index) => {
    nameArray[index] = item.substring(0, 2) + '*'.repeat(item.length - 2)
  })
  return nameArray.join(' ')
}

export const getMaskingEmail = (email: string) => {
  const emailArray = email.split('@')

  if (emailArray[0].length > 6) {
    emailArray[0] =
      emailArray[0].substring(0, 2) +
      '*'.repeat(emailArray[0].length - 4) +
      emailArray[0].substring(emailArray[0].length - 2, emailArray[0].length)
  } else {
    emailArray[0] =
      emailArray[0].substring(0, 2) + '*'.repeat(emailArray[0].length - 3)
  }

  emailArray[1] =
    emailArray[1].charAt(0) +
    '*'.repeat(emailArray[1].length - 5) +
    emailArray[1].substring(emailArray[1].length - 4, emailArray[1].length)
  return emailArray.join('@')
}

export const getMaskingDob = async (dob: string) => {
  const dayjs = (await import('dayjs')).default
  const convertedDob = dayjs(dob).format('DD MMMM YYYY')
  const convertedDobArray = convertedDob.split(' ')
  convertedDobArray[0] = convertedDobArray[0].substring(0, 2)
  convertedDobArray[1] = '*'.repeat(convertedDobArray[1].length)
  convertedDobArray[2] =
    '*'.repeat(convertedDobArray[2].length - 2) +
    convertedDobArray[2].substring(
      convertedDobArray[2].length - 2,
      convertedDobArray[2].length,
    )
  return convertedDobArray.join(' ')
}

export const removeFirstWordFromString = (value: string) => {
  const trimmed = value.trim()
  return trimmed.trim().substring(trimmed.indexOf(' ') + 1)
}
