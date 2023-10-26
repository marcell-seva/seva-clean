import React, { useEffect } from 'react'
import { Profile } from 'components/organisms'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { CityOtrOption } from 'utils/types'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { MobileWebTopMenuType } from 'utils/types/utils'
import { useUtils } from 'services/context/utilsContext'
import { getToken } from 'utils/handler/auth'
import {
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getAnnouncementBox as gab,
} from 'services/api'

const ProfilePage = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataAnnouncementBox,
  } = useUtils()
  const getAnnouncementBox = async () => {
    try {
      const res: any = await gab({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    getAnnouncementBox()
  }, [])

  return (
    <>
      <Profile />
    </>
  )
}

export default ProfilePage

export const getServerSideProps: GetServerSideProps<{
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  try {
    const [menuMobileRes, footerRes, cityRes]: any = await Promise.all([
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
    ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e) {
    return {
      props: {
        dataMobileMenu: [],
        dataFooter: [],
        dataCities: [],
      },
    }
  }
}
