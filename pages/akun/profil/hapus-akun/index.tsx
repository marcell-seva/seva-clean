import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/delete-account.module.scss'

import clsx from 'clsx'
import {
  trackDeleteAccountPageView,
  trackProfileDeleteAccountConsentPageCTAClick,
} from 'helpers/amplitude/seva20Tracking'
import { useRouter } from 'next/router'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { SessionStorageKey } from 'utils/enum'
import { CityOtrOption } from 'utils/types'
import { api } from 'services/api'
import { AxiosResponse } from 'axios'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import { deleteAccountReasonUrl } from 'utils/helpers/routes'
import { HeaderMobile } from 'components/organisms'
import { IconCheckedBox } from 'components/atoms/icon'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { CitySelectorModal } from 'components/molecules'

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
  const [isBoxChecked, setIsBoxChecked] = useState(false)

  useEffect(() => {
    checkCitiesData()
    getAnnouncementBox()
    trackDeleteAccountPageView()
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

  const onClickCheckBox = () => {
    setIsBoxChecked((prev) => !prev)
  }

  const onClickNext = () => {
    trackProfileDeleteAccountConsentPageCTAClick()
    router.push(deleteAccountReasonUrl)
  }

  return (
    <div className={styles.container}>
      <HeaderMobile
        isActive={isActive}
        setIsActive={setIsActive}
        style={{ withBoxShadow: true, position: 'fixed' }}
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
        <h2 className={styles.title}>Hapus Akun</h2>
        <span className={styles.subtitle}>
          Penghapusan akun bersifat permanen. Demi keamanan kamu, kami akan
          memverifikasi permintaan penghapusan akun kamu berdasarkan hal
          berikut:
        </span>

        <h2 className={styles.title}>Kebijakan Penghapusan Akun</h2>
        <ol className={`${styles.subtitle} ${styles.orderedListStyle}`}>
          <li className={styles.listItemStyle}>
            Pemesanan dan transaksi yang sedang berlangsung harus diselesaikan
            terlebih dahulu sebelum penghapusan akun dilakukan.
          </li>
          <br />
          <li className={styles.listItemStyle}>
            Semua voucher akan menjadi tidak valid setelah akun kamu dihapus
          </li>
          <br />
          <li className={styles.listItemStyle}>
            Setelah berhasil menghapus akun kamu, kamu tidak dapat mengakses
            layanan SEVA melalui akun yang lama
          </li>
          <br />
          <li className={styles.listItemStyle}>
            Data kamu terkait dengan layanan SEVA akan dihapus.
          </li>
        </ol>
      </div>

      <div className={styles.floatingWrapper}>
        <div className={styles.checkboxSection}>
          <div
            role="button"
            className={styles.iconWrapper}
            onClick={onClickCheckBox}
          >
            <IconCheckedBox isActive={isBoxChecked} width={16} height={16} />
          </div>
          <span className={styles.checkboxText}>
            Saya menyetujui Syarat & Ketentuan penghapusan akun.
          </span>
        </div>

        <Button
          size={ButtonSize.Big}
          version={ButtonVersion.PrimaryDarkBlue}
          disabled={!isBoxChecked}
          onClick={onClickNext}
        >
          Lanjutkan
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
