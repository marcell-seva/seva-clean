import { useState } from 'react'
import {
  decryptValue,
  encryptedPrefix,
  encryptValue,
} from 'utils/encryptionUtils'

export const useSessionStorage = <T>(key: string, initialValue: T) => {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: ((newValue: T) => T) | T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }
  const removeValue = () => {
    setStoredValue(null)
    window.sessionStorage.removeItem(key)
  }
  return [storedValue, setValue, removeValue]
}

export const useSessionStorageWithEncryption = <T>(
  key: string,
  initialValue: T,
) => {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      let item = window.sessionStorage.getItem(key)
      if (item?.includes(encryptedPrefix)) {
        item = decryptValue(item)
      }

      // if decrypt failed, return default value
      if (item === '') {
        return initialValue
      } else {
        return item ? JSON.parse(item) : initialValue
      }
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: ((newValue: T) => T) | T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.sessionStorage.setItem(
        key,
        encryptValue(JSON.stringify(valueToStore)),
      )
    } catch (error) {
      console.log(error)
    }
  }
  const removeValue = () => {
    setStoredValue(null)
    window.sessionStorage.removeItem(key)
  }
  return [storedValue, setValue, removeValue]
}
