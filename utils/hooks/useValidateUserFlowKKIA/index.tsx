import Router from 'next/router'
import { useEffect } from 'react'
import { SessionStorageKey } from 'utils/enum'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { loanCalculatorDefaultUrl } from 'utils/helpers/routes'

export const useValidateUserFlowKKIA = (possiblePreviousPages: string[]) => {
  useEffect(() => {
    const lastVisitedPageKKIAFlow =
      getSessionStorage<string>(SessionStorageKey.LastVisitedPageKKIAFlow) ?? ''

    const isPreviousPageValid = possiblePreviousPages.some((item) =>
      lastVisitedPageKKIAFlow.startsWith(item),
    )

    if (!isPreviousPageValid) {
      // use ".replace()" so that user wont get redirect again when click back
      Router.replace(loanCalculatorDefaultUrl)
    }
  }, [])
}
