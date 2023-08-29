export const countDaysDifference = (startDate: string, endDate: string) => {
  const diffTime = Math.abs(
    new Date(endDate).valueOf() - new Date(startDate).valueOf(),
  )
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
