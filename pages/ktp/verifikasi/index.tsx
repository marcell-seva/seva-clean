import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/ktp-verifikasi.module.scss'
import elementId from 'helpers/elementIds'
import { colors } from 'styles/colors'
import { useRouter } from 'next/router'
import { useQuery } from 'utils/hooks/useQuery'
import { useGalleryContext } from 'services/context/galleryContext'
import {
  cameraKtpUrl,
  formKtpUrl,
  loanCalculatorDefaultUrl,
  uploadKtpSpouseQueryParam,
} from 'utils/helpers/routes'
import { Button, IconChevronLeft, IconLoading, Toast } from 'components/atoms'
import { ProgressBar } from 'components/atoms/progressBar'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { IconLockFill } from 'components/atoms/icon/LockFill'
import PopupError from 'components/organisms/popupError'
import { DocumentType, SessionStorageKey, UploadDataKey } from 'utils/enum'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import Image from 'next/image'

import { getToken } from 'utils/handler/auth'
import { postUploadKTPFile } from 'services/api'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { useValidateUserFlowKKIA } from 'utils/hooks/useValidateUserFlowKKIA'
import { defineRouteName } from 'utils/navigate'
import { FormLCState } from 'utils/types/utils'

const LogoPrimary = '/revamp/icon/logo-primary.webp'

const VerifyKtp = () => {
  useValidateUserFlowKKIA([cameraKtpUrl])
  const router = useRouter()
  const { ktpType }: { ktpType: string } = useQuery(['ktpType'])
  const [toast, setToast] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingReupload, setLoadingReupload] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState({
    status: false,
    action: '',
  })
  const { galleryFile, photoFile } = useGalleryContext()
  const file = photoFile
  const kkForm: FormLCState | null = getSessionStorage(
    SessionStorageKey.KalkulatorKreditForm,
  )
  const { fincap } = useFinancialQueryData()
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const isInPtbcFlow = kkFlowType && kkFlowType === 'ptbc'

  const getTitleText = () => {
    if (ktpType && ktpType.toLowerCase() === 'spouse') {
      return 'Foto KTP Pasangan'
    } else {
      return 'Foto KTP'
    }
  }

  const getSubtitleText = () => {
    if (ktpType && ktpType.toLowerCase() === 'spouse') {
      return 'Pastikan foto KTP pasanganmu terlihat jelas dan bisa dibaca.'
    } else {
      return 'Pastikan foto KTP terlihat jelas dan bisa dibaca.'
    }
  }

  const buildFileKTPData = (file: File, fileType: DocumentType) => {
    const formData = new FormData()
    formData.append(UploadDataKey.File, file)
    formData.append(UploadDataKey.FileType, fileType)
    return formData
  }

  const detectText = () => {
    setIsLoading(true)
    if (file) {
      postUploadKTPFile(buildFileKTPData(file, DocumentType.KTP), {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: getToken()?.idToken,
        },
      })
        .then((response) => {
          setIsLoading(false)
          localStorage.setItem('formKtp', JSON.stringify(response.data))
        })
        .catch(() => {
          setIsLoading(false)
          localStorage.removeItem('formKtp')
        })
        .finally(() => {
          saveSessionStorage(
            SessionStorageKey.LastVisitedPageKKIAFlow,
            window.location.pathname,
          )
          trackKTPVerification({ ktpContinue: true })
          if (ktpType && ktpType.toLowerCase() === 'spouse') {
            router.push(formKtpUrl + uploadKtpSpouseQueryParam)
          } else {
            router.push(formKtpUrl)
          }
        })
    }
  }

  const trackKTPVerification = ({ ktpContinue = false }) => {
    const prevPage = getSessionStorage(SessionStorageKey.PreviousPage) as any
    const brand = kkForm?.model?.brandName || 'Null'
    const model = kkForm?.model
      ? kkForm?.model?.modelName.replace(brand, '')
      : 'Null'
    const track = {
      KTP_PROFILE: ktpType ? 'Spouse' : 'Main',
      PAGE_REFERRER:
        prevPage && prevPage.refer ? defineRouteName(prevPage.refer) : 'Null',
      PELUANG_KREDIT_BADGE: fincap
        ? kkForm && kkForm.model?.loanRank
          ? kkForm.model.loanRank === 'Green'
            ? 'Mudah disetujui'
            : 'Sulit disetujui'
          : 'Null'
        : 'Null',
      CAR_BRAND: brand,
      CAR_MODEL: model,
    }

    if (ktpContinue) {
      trackEventCountly(
        CountlyEventNames.WEB_KTP_PAGE_PHOTO_SUCCESS_CONTINUE_CLICK,
        track,
      )
    } else {
      if (isInPtbcFlow) {
        trackEventCountly(
          CountlyEventNames.WEB_PTBC_KTP_PAGE_PHOTO_SUCCESS_VIEW,
          {
            KTP_PROFILE: ktpType ? 'Spouse' : 'Main',
          },
        )
      } else {
        trackEventCountly(
          CountlyEventNames.WEB_KTP_PAGE_PHOTO_SUCCESS_VIEW,
          track,
        )
      }
    }
  }

  useEffect(() => {
    trackKTPVerification({ ktpContinue: false })
  }, [])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.form_header}>
        <div
          className={styles.back__button}
          onClick={() => {
            saveSessionStorage(
              SessionStorageKey.LastVisitedPageKKIAFlow,
              window.location.pathname,
            )
            router.back()
          }}
        >
          <IconChevronLeft width={24} height={24} color="#13131B" />
        </div>
        <div className={styles.logo}>
          <Image
            src={LogoPrimary}
            alt="back"
            style={{ width: '58px', height: '34px', objectFit: 'contain' }}
            width={58}
            height={34}
          />
        </div>
        <main className={styles.wrapper}>
          <section className={styles.wrapper__form}>
            <ProgressBar percentage={50} colorPrecentage="#51A8DB" />
            <div className={styles.ktp__page__title}>
              <h2 className={`medium ${styles.info} ${styles.titleText}`}>
                {getTitleText()}
              </h2>
              <span className={styles.light__text}>{getSubtitleText()}</span>
            </div>
            <Image
              src={galleryFile || ''}
              alt="KTP Image"
              className={styles.ktp__preview__image}
              width={343}
              height={214}
            />
            <div className={styles.wrapper__button}>
              <Button
                version={ButtonVersion.Outline}
                size={ButtonSize.Big}
                disabled={loadingReupload}
                onClick={() => {
                  setLoadingReupload(true)
                  trackEventCountly(
                    CountlyEventNames.WEB_KTP_PAGE_PHOTO_SUCCESS_RETAKE_CLICK,
                  )
                  saveSessionStorage(
                    SessionStorageKey.LastVisitedPageKKIAFlow,
                    window.location.pathname,
                  )
                  router.back()
                }}
                loading={loadingReupload}
                data-testid={elementId.Profil.Button.FotoUlang}
              >
                Foto Ulang
              </Button>
              <Button
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                disabled={isLoading}
                onClick={() => detectText()}
                data-testid={elementId.Profil.Button.GunakanFotoIni}
                loading={isLoading}
              >
                {isLoading ? (
                  <div className={`${styles.iconWrapper} rotateAnimation`}>
                    <IconLoading width={14} height={14} color="#FFFFFF" />
                  </div>
                ) : (
                  'Gunakan Foto Ini'
                )}
              </Button>
            </div>
          </section>
        </main>
        <div className={styles.bottomIso}>
          <div className={styles.isoWrapper}>
            <IconLockFill width={14} height={14} color={colors.shadesGrey50} />
            <span className={styles.info}>
              Kami menjamin datamu aman dan terlindungi
            </span>
          </div>
        </div>
      </div>
      {toast ? (
        <Toast
          text={toast}
          maskClosable
          closeOnToastClick
          onCancel={() => {
            setToast('')
          }}
        />
      ) : null}
      <PopupError
        open={isModalOpen.status}
        onCancel={() => setIsModalOpen({ status: false, action: '' })}
        onCancelText={() => {
          setIsModalOpen({ status: false, action: '' })
          saveSessionStorage(
            SessionStorageKey.LastVisitedPageKKIAFlow,
            window.location.pathname,
          )
          router.back()
        }}
        cancelText={
          isModalOpen.action === 'cant_read' ? 'Coba Lagi' : 'Foto Ulang'
        }
        title={
          isModalOpen.action === 'cant_read'
            ? 'KTP Tidak Bisa Dibaca'
            : 'KTP Sudah Terdaftar'
        }
        subTitle={
          isModalOpen.action === 'cant_read'
            ? 'Pastikan KTP terlihat jelas, semua sudut terlihat, dan hindari objek di atas KTP-mu.'
            : 'Kamu hanya dapat menggunakan 1(satu) KTP/NIK.'
        }
        width={346}
      />
    </>
  )
}

export default VerifyKtp
