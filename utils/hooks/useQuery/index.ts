import { useRouter } from 'next/router'

export const useQuery = <T>(keys: string[]): T => {
  const router = useRouter()
  const params = router.query

  return keys.reduce((acc, current) => {
    return { ...acc, ...{ [current]: params[current] } }
  }, {}) as T
}
