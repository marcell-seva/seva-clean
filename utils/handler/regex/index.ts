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

export const isIsoDateFormat = (date: string) => {
  const regEx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
  return regEx.test(date)
}

export const RegExOnlyAlphanumericAndSpace = /^[\w\s]*$/
export const RegExOnlyAlphabetsAndSpaces = /^[a-zA-Z ]*$/
