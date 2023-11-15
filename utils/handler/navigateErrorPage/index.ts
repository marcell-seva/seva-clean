import { client } from 'const/const'

export const clientInteractionNavigateToErrorPage = (statusCode?: number) => {
  if (client) {
    if (statusCode === 404) {
      import('next/router')
        .then((mod) => mod.default)
        .then((Router) => Router.push({ pathname: '/404' }))
    } else if (statusCode === 500) {
      import('next/router')
        .then((mod) => mod.default)
        .then((Router) => Router.push({ pathname: '/500' }))
    }
  }
}
