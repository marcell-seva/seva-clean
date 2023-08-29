import axios from 'axios'
import { useState, useEffect } from 'react'

export function useFetch<T>(url: string, headers?: any) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const checkingEmptyHeaders = (headers: any) => {
    if (headers) {
      const checkHeadersEmpty = Object.values(headers).every(
        (x) => x === null || x === '' || x === undefined,
      )
      if (checkHeadersEmpty) return true
      return false
    }

    return false
  }

  const withAxios = async (urls: string, headers?: any) => {
    if (checkingEmptyHeaders(headers)) return
    try {
      const result = await axios(urls, { headers })
      setData(result.data)
      setLoading(false)
    } catch (e) {
      console.log('error', e)
      withFetch(urls, headers)
    }
  }

  const withFetch = (urls: string, headers?: any) => {
    if (checkingEmptyHeaders(headers)) return
    fetch(urls, { method: 'GET', headers })
      .then((result) => result.json())
      .then((json) => {
        setData(json.data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.response?.data.err)
        setLoading(false)
      })
  }

  const runQuery = async () => {
    setLoading(true)
    withAxios(url, headers)
  }

  useEffect(() => {
    runQuery()
  }, [url])

  return { data, loading, error, refetch: runQuery }
}
