import React, { useEffect, useState } from 'react'
import { BottomSheet, BottomSheetProps } from 'react-spring-bottom-sheet'
import styles from 'styles/components/organisms/landingIA.module.scss'
import { colors } from 'styles/colors'
import { SendKualifikasiKreditRequest } from 'utils/types/utils'
import { useRouter } from 'next/router'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import {
  cameraKtpUrl,
  creditQualificationResultUrl,
  ktpReviewUrl,
} from 'utils/helpers/routes'
import { Button, IconLoading, Toast } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { FooterStakeholder } from 'components/molecules/footerStakeholder'
import Image from 'next/image'
import { getToken } from 'utils/handler/auth'
import { getCustomerKtpSeva } from 'utils/handler/customer'
import { postCreditQualification } from 'services/api'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { fetchCustomerSpouseKtp } from 'utils/httpUtils/customerUtils'

const generalTrack = {
  PAGE_REFERRER: '',
  CAR_BRAND: '',
  CAR_MODEL: '',
  CAR_VARIANT: '',
  TENOR_OPTION: '',
  TENOR_RESULT: '',
  INCOME_CHANGE: '',
  INSURANCE_TYPE: '',
  PROMO_AMOUNT: '',
  TEMAN_SEVA_STATUS: '',
  PELUANG_KREDIT_BADGE: '',
  FINCAP_FILTER_USAGE: '',
}

const LandingIAImage = '/revamp/illustration/landing-ia.webp'
const BGLanding = '/revamp/illustration/bg-landing-ia.webp'

interface LandingIAProps extends Omit<BottomSheetProps, 'children'> {
  onClose: () => void
  dataToCaasDaas: SendKualifikasiKreditRequest
  isSendLeadsOnClickButton?: boolean
  dataTrack: () => typeof generalTrack
}

export const LandingIA = ({
  open,
  dataToCaasDaas,
  onClose,
  isSendLeadsOnClickButton = true,
  dataTrack,
  ...props
}: LandingIAProps) => {
  const {
    PAGE_REFERRER,
    PELUANG_KREDIT_BADGE,
    CAR_BRAND,
    CAR_MODEL,
    CAR_VARIANT,
  } = dataTrack()
  const router = useRouter()
  const [loading, setLoading] = useState<'ia' | 'reject' | ''>('')
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
  )
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const isInPtbcFlow = kkFlowType && kkFlowType === 'ptbc'

  const trackLandingIA = () => {
    setTimeout(() => {
      if (isInPtbcFlow) {
        trackEventCountly(
          CountlyEventNames.WEB_PTBC_INSTANT_APPROVAL_POPUP_VIEW,
        )
      } else {
        trackEventCountly(
          CountlyEventNames.WEB_INSTANT_APPROVAL_POPUP_VIEW,
          dataTrack(),
        )
      }
    }, 500)
  }

  const trackLandingIAContinue = (ktpStatus: string) => {
    const track = {
      PAGE_REFERRER,
      PELUANG_KREDIT_BADGE,
      CAR_BRAND,
      CAR_MODEL,
      CAR_VARIANT,
      KTP_INPUT_STATE: ktpStatus,
    }
    setTimeout(() => {
      if (isInPtbcFlow) {
        trackEventCountly(
          CountlyEventNames.WEB_PTBC_INSTANT_APPROVAL_POPUP_CONTINUE_CLICK,
        )
      } else {
        trackEventCountly(
          CountlyEventNames.WEB_INSTANT_APPROVAL_POPUP_CONTINUE_CLICK,
          track,
        )
      }
    }, 500)
  }

  const trackLandingIASkip = () => {
    const track = {
      PAGE_REFERRER,
      PELUANG_KREDIT_BADGE,
      CAR_BRAND,
      CAR_MODEL,
      CAR_VARIANT,
    }
    setTimeout(() => {
      trackEventCountly(
        CountlyEventNames.WEB_INSTANT_APPROVAL_POPUP_SKIP_CLICK,
        track,
      )
    }, 500)
  }

  const gotoIA = async () => {
    setLoading('ia')
    try {
      if (isSendLeadsOnClickButton) {
        const sendKK = await postCreditQualification(dataToCaasDaas, {
          headers: { Authorization: getToken()?.idToken },
        })
        saveLocalStorage(
          LocalStorageKey.CreditQualificationResult,
          JSON.stringify(sendKK.data),
        )
      }

      const dataKTPUser = await getCustomerKtpSeva()
      const dataKTPSpouse = await fetchCustomerSpouseKtp()
      saveSessionStorage(SessionStorageKey.OCRKTP, 'kualifikasi-kredit')
      saveSessionStorage(
        SessionStorageKey.PreviousPage,
        JSON.stringify({ refer: window.location.pathname }),
      )
      if (dataKTPUser.data[0]) {
        if (dataKTPSpouse) {
          trackLandingIAContinue('Main + Spouse')
        } else {
          trackLandingIAContinue('Main')
        }
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'uploaded')
        saveSessionStorage(
          SessionStorageKey.LastVisitedPageKKIAFlow,
          window.location.pathname,
        )
        router.push(ktpReviewUrl)
        onClose()
      } else {
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'not upload')
        saveSessionStorage(
          SessionStorageKey.LastVisitedPageKKIAFlow,
          window.location.pathname,
        )
        router.push(cameraKtpUrl)
        onClose()
      }
    } catch (e: any) {
      if (e.response.data.code === 'NO_NIK_REGISTERED') {
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'not upload')
        saveSessionStorage(
          SessionStorageKey.LastVisitedPageKKIAFlow,
          window.location.pathname,
        )
        saveSessionStorage(
          SessionStorageKey.PreviousPage,
          JSON.stringify({ refer: window.location.pathname }),
        )
        trackLandingIAContinue('Null')
        router.push(cameraKtpUrl)
        onClose()
      } else if (e?.response?.data?.message) {
        setToastMessage(`${e?.response?.data?.message}`)
        setIsOpenToast(true)
      } else {
        setToastMessage(
          'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
        )
        setIsOpenToast(true)
      }
    }
  }

  const rejectToIA = async () => {
    trackLandingIASkip()
    setLoading('reject')
    try {
      if (isSendLeadsOnClickButton) {
        const res = await postCreditQualification(dataToCaasDaas, {
          headers: { Authorization: getToken()?.idToken },
        }) // posibility return "creditQualificationStatus": null
        saveLocalStorage(
          LocalStorageKey.CreditQualificationResult,
          JSON.stringify(res.data),
        )
      }

      saveLocalStorage(
        LocalStorageKey.CreditQualificationLeadPayload,
        JSON.stringify(dataToCaasDaas),
      )
      saveSessionStorage(
        SessionStorageKey.PreviousPage,
        JSON.stringify({ refer: window.location.pathname }),
      )
      onClose()
      router.push(creditQualificationResultUrl)
    } catch (e: any) {
      if (e?.response?.data?.message) {
        setToastMessage(`${e?.response?.data?.message}`)
      } else {
        setToastMessage(
          'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
        )
      }
      setIsOpenToast(true)
      setLoading('')
    }
  }

  useEffect(() => {
    if (open) {
      trackLandingIA()
    }
  }, [open])

  return (
    <BottomSheet
      open={open}
      header={<Header />}
      maxHeight={900}
      onDismiss={() => {
        const track = {
          PAGE_REFERRER,
          CAR_BRAND,
          CAR_MODEL,
        }
        trackEventCountly(
          CountlyEventNames.WEB_INSTANT_APPROVAL_POPUP_CLOSE_CLICK,
          track,
        )
        onClose()
      }}
      className={'landing'}
      {...props}
    >
      <div className={styles.body}>
        <span className={styles.infotext}>
          Cukup <span className={styles.semiboldText}>siapkan KTP-mu</span>{' '}
          untuk dapatkan{' '}
          <span className={styles.semiboldText}>
            hasil persetujuan kredit instan{' '}
          </span>
          dari perusahaan pembiayaan Astra. Tidak perlu survey ke rumah!
        </span>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          onClick={gotoIA}
          disabled={loading === 'reject' || loading === 'ia'}
          loading={loading === 'ia'}
        >
          Lanjut Instant Approval
        </Button>
        <div className={styles.rejectButtonWrapper}>
          <div role="button" onClick={!loading ? rejectToIA : undefined}>
            Tidak, Terima Kasih{' '}
          </div>
          {loading === 'reject' && (
            <div className={styles.icon}>
              <IconLoading width={14} height={14} color={colors.shadesGrey25} />
            </div>
          )}
        </div>
      </div>
      <FooterStakeholder />
      <Toast
        width={339}
        open={isOpenToast}
        text={toastMessage}
        typeToast={'error'}
        onCancel={() => setIsOpenToast(false)}
        closeOnToastClick
      />
    </BottomSheet>
  )
}

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <div className={styles.header}>
          <span className={styles.titleInfo}>
            Mau Hasil yang <span className={styles.boldText}>Pasti</span> dan{' '}
            <span className={styles.boldText}>Cepat?</span> Yuk, Lanjut ke Tahap{' '}
            <span className={styles.boldText}>Instant Approval</span>
          </span>
          <Image
            src={BGLanding}
            alt="illustration"
            width={570}
            height={710}
            style={{ height: 'auto' }}
          />
        </div>
      </div>
      <Image
        src={LandingIAImage}
        className={styles.imgLanding}
        width={212}
        height={213}
        alt="Landing Instant Approval"
      />
    </div>
  )
}
