import { useEffect } from 'react'
import urls from 'utils/helpers/url'

const RedirectPage = () => {
  useEffect(() => {
    window.location.href = urls.internalUrls.carResultsUrl
  }, [])

  return null
}

export default RedirectPage

export const getServerSideProps = async ({ res }: any) => {
  res.setHeader('location', urls.internalUrls.carResultsUrl)
  res.statusCode = 301
  res.end()

  return { props: {} }
}
