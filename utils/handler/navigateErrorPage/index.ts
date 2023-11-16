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

export const serverSideManualNavigateToErrorPage = (statusCode?: number) => {
  if (statusCode === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  } else {
    // this will cover other error including "TypeError"
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    }
  }
}
