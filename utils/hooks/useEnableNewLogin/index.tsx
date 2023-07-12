import { useEffect, useState } from 'react'

export const useEnableNewLogin = () => {
  const [enableNewLogin, setEnableNewLogin] = useState(true)

  useEffect(() => {
    // === not needed again for now ===
    // if (process.env.REACT_APP_ENVIRONMENT === 'production') {
    //   fetch('https://api.sslpots.com/api/base-conf')
    //     .then((response) => response.json())
    //     .then((json) => {
    //       setEnableNewLogin(json.data.attributes.enable_login)
    //     })
    // }
    setEnableNewLogin(true)
  }, [])

  return enableNewLogin
}
