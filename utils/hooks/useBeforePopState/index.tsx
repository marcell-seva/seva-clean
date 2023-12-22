import { useEffect } from 'react'
import Router from 'next/router'
import { saveSessionStorage } from 'utils/handler/sessionStorage'
import { SessionStorageKey } from 'utils/enum'

export const useBeforePopState = (func?: () => void) => {
  useEffect(() => {
    Router.beforePopState(({ as }) => {
      if (as !== Router.asPath) {
        saveSessionStorage(
          SessionStorageKey.LastVisitedPageKKIAFlow,
          Router.pathname,
        )
        func && func()
      }
      return true
    })

    return () => {
      Router.beforePopState(() => true)
    }
  }, [Router])
}
