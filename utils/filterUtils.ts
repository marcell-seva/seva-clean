import { Currency } from './handler/calculation'

export const getConvertFilterIncome = (value: string) => {
  if (value.includes('-') || value.includes('<') || value.includes('>')) {
    if (value === '<2M') {
      return Currency('2000000')
    } else if (value === '2M-4M') {
      return Currency('3000000')
    } else if (value === '4M-6M') {
      return Currency('5000000')
    } else if (value === '6M-8M') {
      return Currency('7000000')
    } else if (value === '8M-10M') {
      return Currency('9000000')
    } else if (value === '10M-20M') {
      return Currency('15000000')
    } else if (value === '20M-50M') {
      return Currency('35000000')
    } else if (value === '50M-75M') {
      return Currency('62500000')
    } else if (value === '75M-100M') {
      return Currency('87500000')
    } else if (value === '100M-150M') {
      return Currency('125000000')
    } else if (value === '150M-200M') {
      return Currency('175000000')
    } else if (value === '>200M') {
      return Currency('200000000')
    } else {
      return value
    }
  }
  return Currency(value)
}

export const getConvertFilterIncomeToRange = (value: any) => {
  if (!value.includes('-') && !value.includes('<') && !value.includes('>')) {
    if (Number(value) > 0 && Number(value) <= 2000000) {
      return '<2M'
    } else if (Number(value) > 2000000 && Number(value) <= 4000000) {
      return '2M-4M'
    } else if (Number(value) > 4000000 && Number(value) <= 6000000) {
      return '4M-6M'
    } else if (Number(value) > 6000000 && Number(value) <= 8000000) {
      return '6M-8M'
    } else if (Number(value) > 8000000 && Number(value) <= 10000000) {
      return '8M-10M'
    } else if (Number(value) > 10000000 && Number(value) <= 20000000) {
      return '10M-20M'
    } else if (Number(value) > 20000000 && Number(value) <= 50000000) {
      return '20M-50M'
    } else if (Number(value) > 50000000 && Number(value) <= 75000000) {
      return '50M-75M'
    } else if (Number(value) > 75000000 && Number(value) <= 100000000) {
      return '75M-100M'
    } else if (Number(value) > 100000000 && Number(value) <= 150000000) {
      return '100M-150M'
    } else if (Number(value) > 150000000 && Number(value) <= 200000000) {
      return '150M-200M'
    } else if (Number(value) > 200000000) {
      return '>200M'
    } else {
      return ''
    }
  } else {
    return value
  }
}

export const getConvertDP = (value: any) => {
  if (Number(value) > 0 && Number(value) <= 30000000) return '30000000'
  else if (Number(value) > 30000000 && Number(value) <= 40000000)
    return '40000000'
  else if (Number(value) > 40000000 && Number(value) <= 50000000)
    return '50000000'
  else if (Number(value) > 50000000 && Number(value) <= 75000000)
    return '75000000'
  else if (Number(value) > 75000000 && Number(value) <= 100000000)
    return '100000000'
  else if (Number(value) > 100000000 && Number(value) <= 150000000)
    return '150000000'
  else if (Number(value) > 150000000 && Number(value) <= 250000000)
    return '250000000'
  else if (Number(value) > 250000000 && Number(value) <= 350000000)
    return '350000000'
  else if (Number(value) > 350000000) return '350000001'
  else return ''
}
