import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/pages/delete-account-reason.module.scss'
import clsx from 'clsx'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { SessionStorageKey } from 'utils/enum'
import { CityOtrOption } from 'utils/types'
import { useToast } from 'components/atoms/OldToast/Toast'

import { MobileWebTopMenuType, SearchUsedCar } from 'utils/types/utils'
import { Button, IconChevronDown, InputSelect } from 'components/atoms'
import { removeInformationWhenLogout } from 'utils/logoutUtils'
import {
  trackDeleteAccountPopupClose,
  trackDeleteAccountPopupCTACancelClick,
  trackDeleteAccountPopupCTAYesClick,
  trackDeleteAccountReasonPageCTAClick,
  trackDeleteAccountReasonPageView,
} from 'helpers/amplitude/seva20Tracking'
import { deleteAccountSuccessUrl } from 'utils/helpers/routes'
import { HeaderMobile } from 'components/organisms'
import { reasonOptions } from 'config/deleteAccount.config'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { ToastType } from 'utils/types/models'
import { deleteAccount } from 'utils/handler/customer'
import { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useUtils } from 'services/context/utilsContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { MobileWebFooterMenuType } from 'utils/types/props'
import dynamic from 'next/dynamic'
import {
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getAnnouncementBox as gab,
  getUsedCarSearch,
} from 'services/api'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const CitySelectorModal = dynamic(
  () => import('components/molecules').then((mod) => mod.CitySelectorModal),
  { ssr: false },
)

const DeleteAccountModal = dynamic(
  () =>
    import('components/molecules/deleteAccountModal').then(
      (mod) => mod.DeleteAccountModal,
    ),
  { ssr: false },
)

export default function AlasanHapusAkun({
  dataMobileMenu,
  dataFooter,
  dataCities,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useProtectPage()
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const {
    cities,
    dataAnnouncementBox,
    saveDataAnnouncementBox,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataSearchUsedCar,
  } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const [reason, setReason] = useState('')
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const [isOpenDeleteAccountModal, setIsOpenDeleteAccountModal] =
    useState(false)
  const { showToast, RenderToast } = useToast()
  const [toastMessageType, setToastMessageType] = useState<
    'general' | 'rejected'
  >('general')

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

  const onChangeReason = (value: string) => {
    setReason(value)
  }

  const onClickArrowHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
  }

  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    saveDataSearchUsedCar(dataSearchUsedCar)
    getAnnouncementBox()
  }, [])

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

  useAfterInteractive(() => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        saveShowAnnouncementBox(isShowAnnouncement as boolean)
      } else {
        saveShowAnnouncementBox(true)
      }
    } else {
      saveShowAnnouncementBox(false)
    }
  }, [dataAnnouncementBox])

  const renderRightIconInputSelect = () => {
    return (
      <div
        onMouseDown={onClickArrowHandler}
        onClick={onClickArrowHandler}
        style={{ cursor: 'pointer' }}
      >
        <IconChevronDown width={25} height={25} color={'#13131B'} />
      </div>
    )
  }

  const onClickNext = () => {
    trackDeleteAccountReasonPageCTAClick({
      Reason: reason,
    })
    setIsOpenDeleteAccountModal(true)
  }

  const onClickModalCtaConfirm = () => {
    trackDeleteAccountPopupCTAYesClick({
      Reason: reason,
    })
    if (!!getToken()) {
      deleteAccount({
        createdBy: reason,
      })
        .then(() => {
          removeInformationWhenLogout()
          router.push(`${deleteAccountSuccessUrl}?reason=${reason}`)
        })
        .catch((e: any) => {
          if (
            e?.response?.status === 400 ||
            e?.response?.status === 401 ||
            e?.response?.status === 404 ||
            e?.response?.status === 500
          ) {
            setToastMessageType('rejected')
          } else {
            setToastMessageType('general')
          }
          showToast()
        })
    } else {
      setToastMessageType('rejected')
      showToast()
    }
  }

  const renderToastMessage = () => {
    if (toastMessageType === 'general') {
      return (
        <span className={styles.toastMessage}>
          Oops, koneksi kamu terputus.
          <br />
          Silakan coba kembali.
        </span>
      )
    } else if (toastMessageType === 'rejected') {
      return (
        <span className={styles.toastMessage}>
          Maaf, permintaan kamu gagal diproses.
          <br />
          Silakan coba kembali.
        </span>
      )
    } else {
      return <></>
    }
  }

  return (
    <div className={styles.container}>
      <HeaderMobile
        isActive={isActive}
        setIsActive={setIsActive}
        style={{ withBoxShadow: true, position: 'fixed' }}
        emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
        setShowAnnouncementBox={saveShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
      />
      <div
        className={clsx({
          [styles.content]: !showAnnouncementBox,
          [styles.contentWithSpace]: showAnnouncementBox,
        })}
      >
        <h2 className={styles.title}>Mengapa kamu menghapus akun?</h2>

        <span className={styles.inputLabel}>Pilih Alasan</span>
        <InputSelect
          ref={inputRef}
          placeholderText="Pilih Alasan"
          value={reason}
          options={reasonOptions}
          onChange={onChangeReason}
          highlightSelectedOption={true}
          rightIcon={renderRightIconInputSelect}
          isClearable={false}
          isSearchable={false}
        />
      </div>

      <div className={styles.floatingWrapper}>
        <Button
          size={ButtonSize.Big}
          version={ButtonVersion.PrimaryDarkBlue}
          disabled={!reason}
          onClick={onClickNext}
        >
          Selanjutnya
        </Button>
      </div>

      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cities}
      />
      <DeleteAccountModal
        open={isOpenDeleteAccountModal}
        onCancel={() => {
          trackDeleteAccountPopupClose({
            Reason: reason,
          })
          setIsOpenDeleteAccountModal(false)
        }}
        emitClickCtaCancel={() => {
          trackDeleteAccountPopupCTACancelClick({
            Reason: reason,
          })
          setIsOpenDeleteAccountModal(false)
        }}
        emitClickCtaConfirm={onClickModalCtaConfirm}
      />
      <RenderToast
        type={ToastType.Error}
        messageAsComponent={renderToastMessage}
        overridePositionToBottom={true}
        duration={3}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
  dataSearchUsedCar: SearchUsedCar[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  const params = new URLSearchParams()
  params.append('query', ' ' as string)

  try {
    const [menuMobileRes, footerRes, cityRes, dataSearchRes]: any =
      await Promise.all([
        getMobileHeaderMenu(),
        getMobileFooterMenu(),
        getCities(),
        getUsedCarSearch('', { params }),
      ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        dataSearchUsedCar: dataSearchRes.data,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
