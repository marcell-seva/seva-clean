export const removeCarModel = (value: string) => {
  if (value) {
    return value.split(' ')[0]
  }
}
