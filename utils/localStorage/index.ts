export const getLocalStorage = (key: string) => {
  const dataInLocalstorage = localStorage.getItem(key)
  try {
    return dataInLocalstorage ? JSON.parse(dataInLocalstorage) : null
  } catch {
    return ''
  }
}
