import React, { useState } from 'react'
import { BottomSheet, BottomSheetProps } from 'react-spring-bottom-sheet'
import styles from 'styles/components/organisms/landingIA.module.scss'
import { colors } from 'styles/colors'
import { SendKualifikasiKreditRequest } from 'utils/types/utils'
import { useRouter } from 'next/router'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { saveSessionStorage } from 'utils/handler/sessionStorage'
import {
  cameraKtpUrl,
  creditQualificationResultUrl,
  ktpReviewUrl,
} from 'utils/helpers/routes'
import { Button, IconLoading } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { FooterStakeholder } from 'components/molecules/footerStakeholder'
import Image from 'next/image'
import { getToken } from 'utils/handler/auth'
import { getCustomerKtpSeva } from 'utils/handler/customer'
import { postCreditQualification } from 'services/api'

const LandingIAImage = '/revamp/illustration/landing-ia.webp'
const BGLanding = '/revamp/illustration/bg-landing-ia.webp'

interface LandingIAProps extends Omit<BottomSheetProps, 'children'> {
  onClose: () => void
  dataToCaasDaas: SendKualifikasiKreditRequest
}

export const LandingIA = ({
  open,
  dataToCaasDaas,
  onClose,
  ...props
}: LandingIAProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState<'ia' | 'reject' | ''>('')

  const gotoIA = async () => {
    setLoading('ia')
    try {
      const sendKK = await postCreditQualification(dataToCaasDaas, {
        headers: { Authorization: getToken()?.idToken },
      })
      saveLocalStorage(
        LocalStorageKey.CreditQualificationResult,
        JSON.stringify(sendKK.data),
      )
      const dataKTPUser = await getCustomerKtpSeva()
      saveSessionStorage(SessionStorageKey.OCRKTP, 'kualifikasi-kredit')
      if (sendKK) {
        saveLocalStorage(
          LocalStorageKey.CreditQualificationLeadPayload,
          JSON.stringify(dataToCaasDaas),
        )
        if (dataKTPUser.data[0]) {
          saveSessionStorage(SessionStorageKey.KTPUploaded, 'uploaded')
          onClose()
          router.push(ktpReviewUrl)
        } else {
          saveSessionStorage(SessionStorageKey.KTPUploaded, 'not upload')
          onClose()
          router.push(cameraKtpUrl)
        }
      }
      setLoading('')
    } catch (e: any) {
      if (e.response.data.code === 'NO_NIK_REGISTERED') {
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'not upload')
        onClose()
        router.push(cameraKtpUrl)
      }
      setLoading('')
    }
  }

  const rejectToIA = async () => {
    setLoading('reject')
    try {
      const res = await postCreditQualification(dataToCaasDaas, {
        headers: { Authorization: getToken()?.idToken },
      })
      // posibility return "creditQualificationStatus": null
      saveLocalStorage(
        LocalStorageKey.CreditQualificationLeadPayload,
        JSON.stringify(dataToCaasDaas),
      )
      onClose()
      saveLocalStorage(
        LocalStorageKey.CreditQualificationResult,
        JSON.stringify(res.data),
      )
      router.push(creditQualificationResultUrl)
    } catch (e) {
      setLoading('')
    }
  }
  return (
    <BottomSheet
      open={open}
      header={<Header />}
      // maxHeight={700}
      onDismiss={onClose}
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
          disabled={loading === 'reject'}
          loading={loading === 'ia'}
        >
          Lanjut Instant Approval
        </Button>
        <div className={styles.rejectButtonWrapper}>
          <div role="button" onClick={rejectToIA}>
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
          <Image src={BGLanding} alt="illustration" />
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
