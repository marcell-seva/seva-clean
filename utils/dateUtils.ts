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

export const differentDateStatus = (date: Date) => {
  const now = new Date()
  const difference = now.getTime() - date.getTime()
  const days = Math.ceil(difference / (1000 * 3600 * 24)) - 1
  const week = Math.round(difference / (1000 * 60 * 60 * 24 * 7))
  const month = Math.round(difference / (1000 * 60 * 60 * 24 * 30))
  const year = now.getFullYear() - date.getFullYear()

  if (days === 0) {
    return 'Hari ini'
  } else if (days === 1) {
    return 'Kemarin'
  } else if (days < 7) {
    return `${days} Hari yang lalu`
  } else if (days < 14) {
    return `Minggu lalu`
  } else if (days < 28) {
    return `${week} Minggu lalu`
  } else if (days < 31) {
    return 'Bulan lalu'
  } else if (days < 366) {
    return `${month} Bulan lalu`
  } else {
    return `${year} Tahun lalu`
  }
}

export const getYear = () => {
  return new Date().getFullYear()
}

export const getDayName = (day: number) => {
  const weekday = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ]

  return weekday[day]
}

export const isToday = (someDate: Date) => {
  const today = new Date()
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  )
}

export const formatDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day < 10 ? '0' + day : day}/${
    month < 10 ? '0' + month : month
  }/${year}`
}
