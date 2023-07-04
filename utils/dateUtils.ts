export const articleDateFormat = (date: Date, language: string): string => {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  return `${day} ${ToMonthString(month, language)} ${year}`
}

export const ToMonthString = (month: number, language: string) => {
  if (language === 'id') {
    return monthId(month)
  } else {
    return monthEn(month)
  }
}

export const monthId = (month: number) => {
  return {
    0: 'Januari',
    1: 'Februari',
    2: 'Maret',
    3: 'April',
    4: 'Mei',
    5: 'Juni',
    6: 'Juli',
    7: 'Agustus',
    8: 'September',
    9: 'Oktober',
    10: 'November',
    11: 'Desember',
  }[month]
}

const monthEn = (month: number) => {
  return {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  }[month]
}
