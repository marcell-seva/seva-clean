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
import { api } from 'services/api'
import { AxiosResponse } from 'axios'
import { AnnouncementBoxDataType } from 'utils/types/utils'
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
import { CitySelectorModal } from 'components/molecules'
import { ToastType } from 'utils/types/models'
import { DeleteAccountModal } from 'components/molecules/deleteAccountModal'
import { deleteAccount } from 'utils/handler/customer'

export default function index() {
  useProtectPage()
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
  const [reason, setReason] = useState('')
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const [isOpenDeleteAccountModal, setIsOpenDeleteAccountModal] =
    useState(false)
  const { showToast, RenderToast } = useToast()
  const [toastMessageType, setToastMessageType] = useState<
    'general' | 'rejected'
  >('general')

  useEffect(() => {
    checkCitiesData()
    getAnnouncementBox()
    trackDeleteAccountReasonPageView()
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

  const onChangeReason = (value: string) => {
    setReason(value)
  }

  const onClickArrowHandler = (event: any) => {
    event.preventDefault()
    inputRef.current?.focus()
  }

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
    if (!!getToken() && !!getToken()?.phoneNumber) {
      deleteAccount({
        phoneNumber: getToken()?.phoneNumber ?? '',
        reason: reason,
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
        setShowAnnouncementBox={setShowAnnouncementBox}
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
        cityListFromApi={cityListApi}
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
