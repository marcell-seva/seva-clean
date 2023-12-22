/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/perusahaan-pembiayaan.module.scss'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { FormLCState } from 'pages/kalkulator-kredit/[[...slug]]'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { IconCheckedBox, IconChevronLeft } from 'components/atoms/icon'
import {
  instantApprovalReviewPage,
  loanCalculatorDefaultUrl,
} from 'utils/helpers/routes'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { ProgressBar } from 'components/atoms/progressBar'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
  trackEventCountly,
  valueForUserTypeProperty,
  valueForInitialPageProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { NewFunnelCarVariantDetails } from 'utils/types'
import { SimpleCarVariantDetail } from 'utils/types/utils'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'

const LogoPrimary = '/revamp/icon/logo-primary.webp'
const LogoACC = '/revamp/icon/logo-acc.webp'
const LogoQuestionMark = '/revamp/icon/logo-question-mark.png'
const LogoTAF = '/revamp/icon/logo-taf.webp'

export interface Params {
  brand: string
  model: string
  tab: string
}

interface OptionProps {
  title: string
  desc?: string
  logo: any
  isActive?: boolean
  isDisabled?: boolean
  onClick: any
}
const LeasingCompanyOptionPage = () => {
  useProtectPage()
  const [descDisabledCard, setDescDisabledCard] = useState<string>()
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const ptbc = kkFlowType && kkFlowType === 'ptbc'
  const [dataCar, setDataCar] = useState<NewFunnelCarVariantDetails>()
  const [option, setOption] = useState<'none' | '' | 'acc' | 'taf'>('none')
  const [loading, setLoading] = useState(false)
  const { fincap } = useFinancialQueryData()
  const [agreement, setAgreement] = useState<boolean>(false)
  const [isDisableTAF, setIsDisableTAF] = useState<boolean>(false)
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const router = useRouter()
  const kkForm: FormLCState | null = getLocalStorage(
    LocalStorageKey.KalkulatorKreditForm,
  )
  const dataReviewLocalStorage = getLocalStorage('qualification_credit')
  const dataReview = dataReviewLocalStorage

  const termsAndConditionsUrl = 'https://www.seva.id/info/syarat-dan-ketentuan/'
  const privacyPolicyUrl = 'https://www.seva.id/info/kebijakan-privasi/'
  const AgreementTerms: React.FC = (): JSX.Element => (
    <div className={styles.agreementTerms}>
      <div
        onMouseDown={() => {
          if (!agreement)
            trackEventCountly(
              CountlyEventNames.WEB_INSTANT_APPROVAL_FINANCING_SK_CLICK,
            )
          setAgreement(!agreement)
        }}
        className={styles.checkBox}
      >
        <IconCheckedBox isActive={agreement} width={16} height={16} />
      </div>
      <p className={styles.textOption}>
        Saya menyetujui{' '}
        <a
          className={styles.textRedirect}
          target="_blank"
          href={termsAndConditionsUrl}
          rel="noreferrer"
        >
          Syarat & Ketentuan
        </a>{' '}
        dan{' '}
        <a
          className={styles.textRedirect}
          target="_blank"
          href={privacyPolicyUrl}
          rel="noreferrer"
        >
          Kebijakan Privasi
        </a>{' '}
        SEVA serta data saya digunakan untuk pengajuan kredit.
      </p>
    </div>
  )

  const Option: React.FC<OptionProps> = ({
    title,
    desc,
    logo,
    isActive,
    isDisabled = false,
    onClick,
  }) => (
    <button
      className={`${styles.card} ${isActive && styles.active} ${
        isDisabled && styles.disabled
      }`}
      disabled={isDisabled}
      onClick={onClick}
    >
      <div className={styles.bundleLogo}>
        <Image
          src={logo}
          alt="acc-logo"
          width={40}
          height={40}
          className={styles.logo}
        />
      </div>
      <div className={styles.content}>
        <p className={styles.titleText}>{title}</p>
        {desc !== '' && <p className={styles.descText}>{desc}</p>}
      </div>
    </button>
  )

  const handleSetOption = (type: 'none' | '' | 'acc' | 'taf') => {
    if (option === type) {
      setOption('none')
    } else {
      const dataType = type === '' ? 'No preference' : type.toUpperCase()
      trackEventCountly(
        CountlyEventNames.WEB_INSTANT_APPROVAL_FINANCING_COMPANY_CLICK,
        { FINANCING_COMPANY: dataType },
      )
      setOption(type)
    }
  }

  const sendDataTrackerProceed = () => {
    const dataQualificationCredit = JSON.parse(
      localStorage.getItem('qualification_credit')!,
    )
    let peluangKreditBadge = 'Null'
    const oocupation = dataQualificationCredit.occupations?.replace('&', 'and')
    const pageReferrer =
      sessionStorage.getItem(SessionStorageKey.PageReferrerIA) || ''
    const badge =
      simpleCarVariantDetails.loanRank === 'Red'
        ? 'Sulit disetujui'
        : 'Mudah disetujui'

    if (fincap) {
      peluangKreditBadge = badge
      if (pageReferrer === 'Multi Unit Kualifikasi Kredit Result')
        peluangKreditBadge = 'Null'
    } else {
      peluangKreditBadge = 'Null'
    }
    const financingCompany =
      option === '' ? 'No preference' : option?.toUpperCase()
    const data = {
      PAGE_REFERRER: pageReferrer,
      PELUANG_KREDIT_BADGE: peluangKreditBadge,
      CAR_BRAND: dataCar?.modelDetail.brand ?? '',
      CAR_MODEL: dataCar?.modelDetail.model ?? '',
      CAR_VARIANT: dataCar?.variantDetail.name ?? '',
      OCCUPATION: oocupation,
      FINANCING_COMPANY: financingCompany,
      KUALIFIKASI_KREDIT_RESULT:
        creditQualificationResultStorage?.creditQualificationStatus +
        ' disetujui',
    }
    trackEventCountly(
      CountlyEventNames.WEB_INSTANT_APPROVAL_FINANCING_CTA_CLICK,
      data,
    )
  }
  const proceedFinancing = () => {
    setLoading(true)
    sendDataTrackerProceed()
    const data = {
      ...kkForm,
      leasingOption: option,
    }
    saveLocalStorage(LocalStorageKey.KalkulatorKreditForm, JSON.stringify(data))
    router.push(instantApprovalReviewPage)
  }

  const creditQualificationResultStorage: any =
    getLocalStorage(LocalStorageKey.CreditQualificationResult) ?? null

  const ktpData: any = getSessionStorage(SessionStorageKey.ReviewedKtpData)

  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )

  const sendDataTracker = () => {
    let peluangKreditBadge = 'Null'
    const pageReferrer =
      sessionStorage.getItem(SessionStorageKey.PageReferrerIA) || ''
    const badge =
      simpleCarVariantDetails.loanRank === 'Red'
        ? 'Sulit disetujui'
        : 'Mudah disetujui'

    if (fincap) {
      peluangKreditBadge = badge
      if (pageReferrer === 'Multi Unit Kualifikasi Kredit Result')
        peluangKreditBadge = 'Null'
    } else {
      peluangKreditBadge = 'Null'
    }
    const data = {
      PAGE_REFERRER: pageReferrer,
      PELUANG_KREDIT_BADGE: peluangKreditBadge,
      CAR_BRAND: dataCar?.modelDetail.brand ?? '',
      CAR_MODEL: dataCar?.modelDetail.model ?? '',
      KTP_COMPLETENESS: ktpData.length === 1 ? 'Main' : 'Main + Spouse',
      USER_TYPE: valueForUserTypeProperty(),
      INITIAL_PAGE: valueForInitialPageProperty(),
    }

    if (ptbc) {
      trackEventCountly(
        CountlyEventNames.WEB_PTBC_INSTANT_APPROVAL_FINANCING_COMPANY_VIEW,
      )
    } else {
      trackEventCountly(
        CountlyEventNames.WEB_INSTANT_APPROVAL_FINANCING_COMPANY_VIEW,
        data,
      )
    }
  }

  const getInformationCarDetail = async () => {
    try {
      const response = await getCarVariantDetailsById(
        simpleCarVariantDetails.variantId, // get cheapest variant
      )
      setDataCar(response)
    } catch (error) {}
  }

  useEffect(() => {
    if (simpleCarVariantDetails) getInformationCarDetail()
    if (kkForm !== null) {
      const brand = kkForm.model?.brandName
      if (
        brand === 'Isuzu' ||
        brand === 'Peugeot' ||
        brand === 'BMW' ||
        brand === 'Hyundai'
      ) {
        setIsDisableTAF(true)
        setDescDisabledCard(
          'Perusahaan ini belum bisa digunakan untuk mobil yang kamu pilih.',
        )
      }
    } else if (dataReview === null) {
      router.replace(loanCalculatorDefaultUrl)
    }
    if (ptbc) setIsDisableTAF(true)
  }, [])

  useAfterInteractive(() => {
    if (dataCar) sendDataTracker()
  }, [dataCar])

  useEffect(() => {
    if (agreement && option !== 'none') setIsFilled(true)
    else setIsFilled(false)
  }, [agreement, option])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.container}>
        <div>
          <div className={styles.formHeader}>
            <div className={styles.backButton} onClick={() => router.back()}>
              <IconChevronLeft width={24} height={24} color="#13131B" />
            </div>
            <Image src={LogoPrimary} alt="back" width={58} height={35} />
          </div>
          <ProgressBar percentage={87} colorPrecentage="#51A8DB" />
        </div>
        <h2 className={styles.headerText}>Pilih Perusahaan Pembiayaan</h2>
        <Option
          isActive={option === ''}
          onClick={() => handleSetOption('')}
          logo={LogoQuestionMark}
          title="Saya tidak memiliki preferensi"
        />
        <Option
          isActive={option === 'acc'}
          onClick={() => handleSetOption('acc')}
          logo={LogoACC}
          title="ACC (Astra Credit Companies)"
        />
        <Option
          isDisabled={isDisableTAF}
          isActive={option === 'taf'}
          onClick={() => handleSetOption('taf')}
          logo={LogoTAF}
          title="TAF (Toyota Astra Finance)"
          desc={descDisabledCard}
        />
        <AgreementTerms />
        <div className={styles.button}>
          <Button
            disabled={loading || !isFilled}
            loading={loading}
            version={
              isFilled ? ButtonVersion.PrimaryDarkBlue : ButtonVersion.Disable
            }
            size={ButtonSize.Big}
            onClick={() => proceedFinancing()}
          >
            Lanjutkan
          </Button>
        </div>
      </div>
    </>
  )
}
export default LeasingCompanyOptionPage
