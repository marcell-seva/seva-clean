export const getBrandAndModelValue = (value: string) => {
  if (value && value.length !== 0 && value.includes('-')) {
    return value
      .replaceAll('-', ' ')
      .toLowerCase()
      .split(' ')
      .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  } else if (value && value.length !== 0) {
    return value
      .replaceAll('-', ' ')
      .toLowerCase()
      .split(' ')
      .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  } else {
    return 'Null'
  }
}

export const getBrandValue = (value: string) => {
  if (value) {
    return value
      .replaceAll('-', ' ')
      .toLowerCase()
      .split(' ')
      .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  }
}
