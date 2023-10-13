import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/credit-qualification-result.module.scss'

import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { getLocalStorage } from 'utils/handler/localStorage'
import { CityOtrOption, NewFunnelCarVariantDetails } from 'utils/types'
import { getToken } from 'utils/handler/auth'
import { api } from 'services/api'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import { Triangle } from 'components/atoms/icon/Triangle'
import { Star } from 'components/atoms/icon/Star'
import { Firework } from 'components/atoms/icon/Firework'
import {
  cameraKtpUrl,
  ktpReviewUrl,
  loanCalculatorWithCityBrandModelVariantUrl,
} from 'utils/helpers/routes'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { HeaderMobile } from 'components/organisms'
import {
  Button,
  IconChevronDown,
  IconLoading,
  IconWhatsapp,
} from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { FooterStakeholder } from 'components/molecules/footerStakeholder'
import { CitySelectorModal } from 'components/molecules'
import { PopupCreditQualificationResult } from 'components/organisms/popoupCreditQualificationResult'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewLC,
} from 'utils/navigate'
import Image from 'next/image'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import { getCustomerInfoSeva, getCustomerKtpSeva } from 'utils/handler/customer'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'

const MainImageGreenMale = '/revamp/illustration/credit-result-green-male.webp'
const MainImageGreenFemale =
  '/revamp/illustration/credit-result-green-female.webp'
const MainImageYellowMale =
  '/revamp/illustration/credit-result-yellow-male.webp'
const MainImageYellowFemale =
  '/revamp/illustration/credit-result-yellow-female.webp'
const MainImageRedBackground =
  '/revamp/illustration/credit-result-red-background.webp'
const MainImageMagnifier = '/revamp/illustration/credit-result-magnifier.webp'

export default function CreditQualificationResultPage() {
  useProtectPage()
  const router = useRouter()
  const creditQualificationResultStorage: any =
    getLocalStorage(LocalStorageKey.CreditQualificationResult) ?? null
  const creditQualificationStatus =
    creditQualificationResultStorage?.creditQualificationStatus ?? ''
  const creditOccupationStatus =
    creditQualificationResultStorage?.occupation ?? ''
  const isOccupationPass = creditOccupationStatus.toLowerCase() === 'pass'
  const dataReview: any = getLocalStorage(LocalStorageKey.QualifcationCredit)

  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [showAnnouncementBox, setShowAnnouncementBox] = useState<
    boolean | null
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ) ?? true,
  )
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [isLoadingContinueApproval, setIsLoadingContinueApproval] =
    useState(false)
  const [isLoadingWhatsApp, setIsLoadingWhatsApp] = useState(false)
  const [carData, setCarData] = useState<NewFunnelCarVariantDetails | null>(
    null,
  )
  const [customerGender, setCustomerGender] = useState('male')

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

  const getCarDetails = () => {
    if (dataReview?.variantId) {
      getCarVariantDetailsById(dataReview?.variantId).then((res) => {
        setCarData(res)
      })
    }
  }

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva()
      .then((response) => {
        // setLoadShimmer2(false)
        if (!!response[0].gender) {
          setCustomerGender(response[0].gender)
        }
      })
      .catch((err) => {
        console.error(err)
        // setLoadShimmer2(false)
        // showToast()
      })
  }

  useEffect(() => {
    checkCitiesData()
    getAnnouncementBox()
    getCarDetails()
    getCurrentUserInfo()
  }, [])

  const getChipText = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return 'Kualifikasi Kredit Sulit'
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return 'Kualifikasi Kredit Sedang'
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return 'Kualifikasi Kredit Mudah'
    } else {
      return 'Kualifikasi Kredit Sedang'
    }
  }

  const renderHeaderIcon = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return (
        <>
          <div className={styles.headerIconLeft}>
            <Triangle width={12} height={12} color="#FED2B9" />
          </div>
          <div className={styles.headerIconRight}>
            <Triangle width={12} height={12} color="#FED2B9" />
          </div>
        </>
      )
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return (
        <>
          <div className={styles.headerIconLeft}>
            <Star width={16} height={18} color="#F1C551" />
          </div>
          <div className={styles.headerIconRight}>
            <Firework width={30} height={30} color="#FCCC51" />
          </div>
        </>
      )
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return (
        <>
          <div className={styles.headerIconLeft}>
            <Firework width={30} height={30} color="#5FC19E" />
          </div>
          <div className={styles.headerIconRight}>
            <Star width={13} height={15} color="#D8EDE6" />
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className={styles.headerIconLeft}>
            <Star width={16} height={18} color="#F1C551" />
          </div>
          <div className={styles.headerIconRight}>
            <Firework width={30} height={30} color="#FCCC51" />
          </div>
        </>
      )
    }
  }

  const getHeading2Text = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return 'Yah... Lumayan Mepet Nih'
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return 'Hmm... Masih Bisa Dicoba'
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return 'Yeay, Pilihanmu Cocok!'
    } else {
      return 'Hmm... Masih Bisa Dicoba'
    }
  }

  const getHeading3Text = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return 'Jangan menyerah, SEVA akan bantu kamu menemukan solusi terbaik'
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return 'Kredit mobil yang kamu ajukan punya peluang untuk mendapatkan persetujuan'
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return 'Selamat! Mobil dan paket kredit yang kamu pilih sudah sesuai dengan profilmu'
    } else {
      return 'Kredit mobil yang kamu ajukan punya peluang untuk mendapatkan persetujuan'
    }
  }

  const getMainImageSource = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'mudah' &&
      customerGender.toLowerCase() === 'male'
    ) {
      return MainImageGreenMale
    } else if (
      creditQualificationStatus.toLowerCase() === 'mudah' &&
      customerGender.toLowerCase() === 'female'
    ) {
      return MainImageGreenFemale
    } else if (
      creditQualificationStatus.toLowerCase() === 'sedang' &&
      customerGender.toLowerCase() === 'male'
    ) {
      return MainImageYellowMale
    } else if (
      creditQualificationStatus.toLowerCase() === 'sedang' &&
      customerGender.toLowerCase() === 'female'
    ) {
      return MainImageYellowFemale
    } else if (customerGender.toLowerCase() === 'male') {
      return MainImageYellowMale
    } else if (customerGender.toLowerCase() === 'female') {
      return MainImageYellowFemale
    }
  }

  const renderMainImage = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return (
        <div
          className={clsx(styles.mainImageWrapper, styles.mainImageWrapperRed)}
        >
          <Image
            className={styles.mainImageIllustration}
            alt="credit-result-illustration"
            src={MainImageRedBackground}
            width={327.13}
            height={188.14}
          />
          <Image
            className={styles.carImageRed}
            alt="car-image"
            src={carData?.variantDetail?.images[0] || ''}
            width={86.84}
            height={65.3}
          />
          <Image
            className={styles.magnifierImage}
            alt="magnifier-illustration"
            src={MainImageMagnifier}
            width={155.88}
            height={141.09}
          />
        </div>
      )
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return (
        <div
          className={clsx(
            styles.mainImageWrapper,
            styles.mainImageWrapperYellow,
          )}
        >
          <Image
            className={styles.mainImageIllustration}
            alt="credit-result-illustration"
            src={getMainImageSource() || ''}
            width={311}
            height={198.62}
          />
          <Image
            className={styles.carImage}
            alt="car-image"
            src={carData?.variantDetail?.images[0] || ''}
            width={86.84}
            height={65.3}
          />
        </div>
      )
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return (
        <div
          className={clsx(
            styles.mainImageWrapper,
            styles.mainImageWrapperGreen,
          )}
        >
          <Image
            className={styles.mainImageIllustration}
            alt="credit-result-illustration"
            src={getMainImageSource() || ''}
            width={317.08}
            height={197.11}
          />
          <Image
            className={styles.carImage}
            alt="car-image"
            src={carData?.variantDetail?.images[0] || ''}
            width={86.84}
            height={65.3}
          />
        </div>
      )
    } else {
      return (
        <div
          className={clsx(
            styles.mainImageWrapper,
            styles.mainImageWrapperYellow,
          )}
        >
          <Image
            className={styles.mainImageIllustration}
            alt="credit-result-illustration"
            src={getMainImageSource() || ''}
            width={311}
            height={198.62}
          />
          <Image
            className={styles.carImage}
            alt="car-image"
            src={carData?.variantDetail?.images[0] || ''}
            width={86.84}
            height={65.3}
          />
        </div>
      )
    }
  }

  const onClickLearnMore = () => {
    setIsOpenPopup(true)
  }

  const onClickContinueApproval = async () => {
    setIsLoadingContinueApproval(true)
    try {
      const dataKTPUser = await getCustomerKtpSeva()
      saveSessionStorage(SessionStorageKey.OCRKTP, 'kualifikasi-kredit')
      if (dataKTPUser.data.length > 0) {
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'uploaded')
        router.push(ktpReviewUrl)
      } else {
        router.push(cameraKtpUrl)
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'not upload')
      }
      setIsLoadingContinueApproval(false)
    } catch (e: any) {
      if (e?.response?.data?.code === 'NO_NIK_REGISTERED') {
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'not upload')
        router.push(cameraKtpUrl)
      }
      setIsLoadingContinueApproval(false)
    }
  }

  const onClickWhatsapp = async () => {
    const carName = `${carData?.modelDetail?.brand} ${carData?.modelDetail?.model} ${carData?.variantDetail?.name}`
    const dpAmount =
      formatNumberByLocalization(
        dataReview?.loanDownPayment,
        LanguageCode.en,
        1000000,
        10,
      ) ?? '-'
    const installment =
      formatNumberByLocalization(
        dataReview?.loanMonthlyInstallment,
        LanguageCode.en,
        1000000,
        10,
      ) ?? '-'
    let message = `Halo, saya tertarik melakukan kualifikasi kredit untuk mobil ${carName} di kota ${
      dataReview?.citySelector ?? '-'
    } dengan DP sebesar Rp ${dpAmount} jt, cicilan per bulan Rp ${installment} jt, dan tenor ${
      dataReview?.loanTenure ?? '-'
    } tahun.`

    if (!!dataReview?.promoCode && !!dataReview?.temanSevaTrxCode) {
      message =
        message +
        ` Serta menggunakan promo ${dataReview?.promoCode} dan kode referral ${dataReview?.temanSevaTrxCode}.`
    } else if (!!dataReview?.promoCode && !dataReview?.temanSevaTrxCode) {
      message = message + ` Serta menggunakan promo ${dataReview?.promoCode}.`
    } else if (!dataReview?.promoCode && !!dataReview?.temanSevaTrxCode) {
      message =
        message +
        ` Serta menggunakan kode referral ${dataReview?.temanSevaTrxCode}.`
    }
    setIsLoadingWhatsApp(true)
    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()
    setIsLoadingWhatsApp(false)
    window.open(`${whatsAppUrl}?text=${encodeURI(message)}`, '_blank')
  }

  const onClickClosePopup = () => {
    setIsOpenPopup(false)
  }

  const onDismissPopup = () => {
    setIsOpenPopup(false)
  }

  const getLoanCalculatorDestinationUrl = () => {
    const cityNameSlug = dataReview?.citySelector
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const brandSlug = carData?.modelDetail.brand
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const modelSlug = carData?.modelDetail.model
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const variantSlug = carData?.variantDetail.name
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
      .replace('/', '')
    if (cityNameSlug && brandSlug && modelSlug && variantSlug) {
      return loanCalculatorWithCityBrandModelVariantUrl
        .replace(':cityName', cityNameSlug)
        .replace(':brand', brandSlug)
        .replace(':model', modelSlug)
        .replace(':variant', variantSlug)
    }
    return loanCalculatorWithCityBrandModelVariantUrl.replace(
      '/:cityName/:brand/:model/:variant',
      '',
    )
  }

  if (!creditOccupationStatus) return <></>

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
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
            [styles.content]: true,
            [styles.contentWithAnnouncementBox]: showAnnouncementBox,
          })}
        >
          <div className={styles.chipAndIconWrapper}>
            <div
              className={clsx({
                [styles.chipWrapper]: true,
                [styles.redChip]:
                  creditQualificationStatus.toLowerCase() === 'sulit' ||
                  !isOccupationPass,
                [styles.yellowChip]:
                  creditQualificationStatus.toLowerCase() === 'sedang' ||
                  creditQualificationStatus.toLowerCase() === '',
                [styles.greenChip]:
                  creditQualificationStatus.toLowerCase() === 'mudah',
              })}
            >
              <span className={styles.chipText}>{getChipText()}</span>
            </div>
            {renderHeaderIcon()}
          </div>

          <div className={styles.headingSection}>
            <h2 className={styles.heading2}>{getHeading2Text()}</h2>
            <h3 className={styles.heading3}>{getHeading3Text()}</h3>
            <button
              className={styles.learnMoreButton}
              onClick={onClickLearnMore}
            >
              <span className={styles.smallButtonText}>
                Pelajari Lebih Lanjut
              </span>
              <div className={styles.iconWrapper}>
                <IconChevronDown width={16} height={16} />
              </div>
            </button>
          </div>

          {renderMainImage()}

          <span className={clsx(styles.bodyText, styles.subtitle)}>
            Mau hasil yang pasti dan cepat secara langsung dari perusahaan
            pembiayaan Astra? Yuk, lanjut ke tahap Instant Approval!
          </span>

          <div className={styles.buttonSection}>
            <Button
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              onClick={onClickContinueApproval}
            >
              {isLoadingContinueApproval ? (
                <div className={`${styles.iconWrapper} rotateAnimation`}>
                  <IconLoading width={16} height={16} />
                </div>
              ) : (
                'Lanjut Instant Approval'
              )}
            </Button>
            <Button
              version={ButtonVersion.Secondary}
              size={ButtonSize.Big}
              onClick={onClickWhatsapp}
            >
              {isLoadingWhatsApp ? (
                <div className={`${styles.iconWrapper} rotateAnimation`}>
                  <IconLoading width={16} height={16} />
                </div>
              ) : (
                <div className={styles.whatsappButtonContent}>
                  <div className={styles.iconWrapper}>
                    <IconWhatsapp width={16} height={16} />
                  </div>
                  Hubungi Agen SEVA
                </div>
              )}
            </Button>
          </div>
        </div>
        <FooterStakeholder />
      </div>

      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
      <PopupCreditQualificationResult
        isOpen={isOpenPopup}
        onClickClosePopup={onClickClosePopup}
        onDismissPopup={onDismissPopup}
        loanCalculatorDestinationUrl={getLoanCalculatorDestinationUrl()}
        onClickContinueApproval={onClickContinueApproval}
        onClickChangeCreditPlan={() => {
          saveDataForCountlyTrackerPageViewLC(PreviousButton.PopUpUbahData)
        }}
      />
    </>
  )
}
