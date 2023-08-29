import { useRouter } from 'next/router'
import { useEnableNewLogin } from 'utils/hooks/useEnableNewLogin'
import { useEffect } from 'react'
import { getToken } from 'utils/handler/auth'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { LoginSevaUrl, loginUrl } from 'utils/helpers/routes'

export const useProtectPage = () => {
  const enableNewLogin = useEnableNewLogin()
  const router = useRouter()
  const userToken = getToken()

  useEffect(() => {
    if (!userToken) {
      if (enableNewLogin) {
        savePageBeforeLogin(window.location.pathname)
        router.push(LoginSevaUrl)
      } else {
        router.push(loginUrl)
      }
    }
  }, [])
}
