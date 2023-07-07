import { million } from 'const/const'
export const parsedMonthlyIncome = (payload: number): string => {
  if (payload >= 200 * million) {
    return '>200M'
  } else if (payload >= 150 * million && payload < 200 * million) {
    return '150M-200M'
  } else if (payload >= 100 * million && payload < 150 * million) {
    return '100M-150M'
  } else if (payload >= 75 * million && payload < 100 * million) {
    return '75M-100M'
  } else if (payload >= 50 * million && payload < 75 * million) {
    return '50M-75M'
  } else if (payload >= 20 * million && payload < 50 * million) {
    return '20M-50M'
  } else if (payload >= 10 * million && payload < 20 * million) {
    return '10M-20M'
  } else if (payload >= 8 * million && payload < 10 * million) {
    return '8M-10M'
  } else if (payload >= 6 * million && payload < 8 * million) {
    return '6M-8M'
  } else if (payload >= 4 * million && payload < 6 * million) {
    return '4M-6M'
  } else if (payload >= 2 * million && payload < 4 * million) {
    return '2M-4M'
  } else return '<2M'
}
