import { client } from 'const/const'

export const clientInteractionNavigateToErrorPage = (statusCode?: number) => {
  if (client) {
    const currentUrlPathname = window.location.pathname
    if (currentUrlPathname !== '/404' && statusCode === 404) {
      import('next/router')
        .then((mod) => mod.default)
        .then((Router) => Router.push({ pathname: '/404' }))
    } else if (currentUrlPathname !== '/500' && statusCode === 500) {
      import('next/router')
        .then((mod) => mod.default)
        .then((Router) => Router.push({ pathname: '/500' }))
    }
  }
}

type serverSideManualNavigateToErrorPageReturnType = (statusCode?: number) => {
  // use type "true" because GetServerSideProps doesnt accept "boolean"
  notFound: true
}

export const serverSideManualNavigateToErrorPage: serverSideManualNavigateToErrorPageReturnType =
  (statusCode?: number) => {
    if (statusCode === 404) {
      return {
        notFound: true,
      }
    } else {
      // this will cover other error including "TypeError" -> code 500
      throw new Error()
    }
  }
