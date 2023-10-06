import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/delete-account-success.module.scss'

import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import {
  trackDeleteAccountSuccessPageView,
  trackDeleteAccountSucessCTAClick,
} from 'helpers/amplitude/seva20Tracking'
import { useRouter } from 'next/router'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { SessionStorageKey } from 'utils/enum'
import { CityOtrOption } from 'utils/types'
import { api } from 'services/api'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import { rootUrl } from 'utils/helpers/routes'
import { HeaderMobile } from 'components/organisms'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { CitySelectorModal } from 'components/molecules'
import Image from 'next/image'

const MainImage = '/revamp/illustration/approved.webp'

export default function index() {
  const router = useRouter()

  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [showAnnouncementBox, setShowAnnouncementBox] = useState<
    boolean | null
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ),
  )
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    checkCitiesData()
    getAnnouncementBox()
    trackDeleteAccountSuccessPageView()

    const timer = setTimeout(() => {
      navigateHandler()
    }, 5000)

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      api.getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  const getAnnouncementBox = () => {
    api
      .getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      .then((res: AxiosResponse<{ data: AnnouncementBoxDataType }>) => {
        if (res.data === undefined) {
          setShowAnnouncementBox(false)
        }
      })
  }

  const navigateHandler = () => {
    router.push(rootUrl)
  }

  const onClickCta = () => {
    trackDeleteAccountSucessCTAClick({
      Reason: (router.query.reason as string) || '',
    })
    navigateHandler()
  }

  return (
    <div className={styles.container}>
      <HeaderMobile
        isActive={isActive}
        setIsActive={setIsActive}
        style={{
          position: 'fixed',
        }}
        emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
        setShowAnnouncementBox={setShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
      />
      <div
        className={clsx({
          [styles.content]: !showAnnouncementBox,
          [styles.contentWithSpace]: showAnnouncementBox,
        })}
      >
        <Image
          src={MainImage}
          alt="delete-account-success-main-image"
          width="224"
          height="225"
          className={styles.mainImage}
        />

        <h2 className={styles.title}>
          Permintaan untuk menghapus akun berhasil
        </h2>

        <span className={styles.subtitle}>
          Terima kasih atas dukunganmu.
          <br />
          Kami berharap dapat membantu kamu
          <br />
          kembali pada kesempatan lainnya.
        </span>

        <span className={styles.countdown}>
          Halaman ini akan tertutup
          <br />
          otomatis dalam {countdown} detik
        </span>
      </div>

      <div className={styles.floatingWrapper}>
        <Button
          size={ButtonSize.Big}
          version={ButtonVersion.PrimaryDarkBlue}
          onClick={onClickCta}
        >
          Kembali ke Beranda
        </Button>
      </div>

      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
    </div>
  )
}
