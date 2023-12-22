import { useState } from 'react'
import {
  decryptValue,
  encryptValue,
  encryptedPrefix,
} from 'utils/handler/encryption'
import { client } from 'utils/helpers/const'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = client ? localStorage.getItem(key) : null
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
      client && window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  const removeValue = () => {
    setStoredValue(null)
    client && window.localStorage.removeItem(key)
  }

  return [storedValue, setValue, removeValue]
}

export const useLocalStorageWithEncryption = <T>(
  key: string,
  initialValue: T,
) => {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      let item = client ? localStorage.getItem(key) : null
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
      client &&
        window.localStorage.setItem(
          key,
          encryptValue(JSON.stringify(valueToStore)),
        )
    } catch (error) {
      console.log(error)
    }
  }

  const removeValue = () => {
    setStoredValue(null)
    client && window.localStorage.removeItem(key)
  }

  return [storedValue, setValue, removeValue]
}
