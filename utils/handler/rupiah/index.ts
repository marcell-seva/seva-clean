export const rupiah = (num: number, isLargerThan?: boolean): string => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e6, symbol: ' Jt' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })

  const parsed = item
    ? (num / item.value).toFixed(2).replace(rx, '$1') + item.symbol
    : '0'

  if (isLargerThan) return `Rp > ${parsed.replace('.', ',')}`
  else return `Rp ${parsed.replace('.', ',')}`
}
