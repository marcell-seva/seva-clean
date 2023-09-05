export const removeCarBrand = (value: string) => {
  const brandList = ['toyota', 'daihatsu', 'bmw', 'isuzu', 'peugeot']
  const firstWord = value.split(' ')[0]
  if (brandList.includes(firstWord.toLowerCase())) {
    return value.trim().substring(value.indexOf(' ') + 1)
  } else {
    return value
  }
}
