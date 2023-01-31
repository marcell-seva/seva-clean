export const timeSince = (date: string) => {
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
