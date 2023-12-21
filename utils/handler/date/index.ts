type ArticleDateFormatOption = {
  collapsedMonth: boolean
}

export const articleDateFormat = (
  date: Date,
  language: string,
  option?: ArticleDateFormatOption,
): string => {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  const monthString = ToMonthString(month, language)

  return `${day} ${
    option?.collapsedMonth ? monthString?.substring(0, 3) : monthString
  } ${year}`
}

export const timeSince = (date: string): string => {
  const todayDate: any = new Date()
  const parsedDate: any = new Date(date)
  const restDate = todayDate - parsedDate
  var seconds: any = Math.floor(restDate / 1000)

  var interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' tahun lalu'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' bulan lalu'
  }
  interval = seconds / 604800
  if (interval > 1) {
    return Math.floor(interval) + ' minggu lalu'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' hari lalu'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' jam lalu'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' menit lalu'
  }
  return Math.floor(seconds) + ' detik lalu'
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
    return `${days} hari yang lalu`
  } else if (days < 14) {
    return `minggu lalu`
  } else if (days < 28) {
    return `${week} minggu lalu`
  } else if (days < 31) {
    return 'bulan lalu'
  } else if (days < 366) {
    return `${month} bulan lalu`
  } else {
    return `${year} tahun lalu`
  }
}

export const countDaysDifference = (startDate: string, endDate: string) => {
  const diffTime = Math.abs(
    new Date(endDate).valueOf() - new Date(startDate).valueOf(),
  )
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
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

export const addZero = (i: any) => {
  if (i < 10) {
    i = '0' + i
  }
  return i
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

export const convertStringDateToMonthYear = (data: string) => {
  const date = new Date(data)
  const monthNumb = date.toLocaleString('default', { month: 'numeric' })
  const month = monthId(parseInt(monthNumb) - 1)
  const year = date.getFullYear()
  const result = `${month} ${year}`
  return result
}
