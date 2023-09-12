import { IconInfo, IconWhatsapp } from 'components/atoms'
import { useToast } from 'components/atoms/OldToast/Toast'
import { useUtils } from 'services/context/utilsContext'
// import { tracSelectV2LoanCalculatorSpeak } from 'helpers/amplitude/newLoanCalculatorEventTracking'
// import { WhatsAppContactUs } from 'pages/component/WhatsAppContactUs/WhatsAppContactUs'
import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  creditQualificationUrl,
  LoginSevaUrl,
  loginUrl,
} from 'utils/helpers/routes'
import { getCustomerAssistantWhatsAppNumber } from 'services/lead'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { getToken } from 'utils/handler/auth'
import { getModelName } from 'utils/carModelUtils/carModelUtils'
import { formatSortPrice } from 'utils/numberUtils/numberUtils'
import { convertSlashesInStringToVerticalLines } from 'utils/stringUtils'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { usedBrowser } from 'utils/window'
import urls from 'helpers/urls'
import { useContextCalculator } from 'services/context/calculatorContext'
import {
  CarVariantCreditTabParam,
  trackCarVariantCreditPageWaChatbot,
  trackRegularCalculatorWaChatbot,
  trackSpecialRateCalculatorWaChatbot,
} from 'helpers/amplitude/seva20Tracking'
import { setTrackEventMoEngage } from 'helpers/moengage'
// import { WhatsAppContactUsNewIcon } from 'pages/component/WhatsAppContactUs/WhatsAppContactUsNewIcon'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import elementId from 'helpers/elementIds'
import { usePreApprovalIntroModal } from 'components/molecules/PreApprovalIntroModal/usePreApprovalIntroModal'
import { SpecialRateList } from 'utils/types'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  CityOtrOption,
  NewFunnelCarVariantDetails,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import {
  InstallmentTypeOptions,
  NewFunnelLoanRank,
  ToastType,
} from 'utils/types/models'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { api } from 'services/api'
import { NonPassengerCars } from 'config/LoanCalculator.config'
import { tracSelectV2LoanCalculatorSpeak } from 'helpers/amplitude/newLoanCalculatorEventTracking'
import { useCar } from 'services/context/carContext'
import { useContextForm } from 'services/context/formContext'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'

const PromoAsuransi = '/revamp/illustration/PromoAsuransi.gif'
const AstraLogo = '/revamp/icon/AstraLogo.webp'

interface SpecialRateResultsProps {
  data: SpecialRateList[]
  carVariantDetails?: NewFunnelCarVariantDetails
  isNewRegularPage?: boolean
  isInGiiasCalc?: boolean
  eventName?: string
  onCheckLogin?: () => void
  carVariantPage?: boolean
  carModelDimension?: string | undefined
}

export const SpecialRateResults = ({
  data,
  carVariantDetails,
  isNewRegularPage = false,
  isInGiiasCalc = false,
  eventName = '',
  carVariantPage = false,
  onCheckLogin,
}: SpecialRateResultsProps) => {
  const enableSpecialRate = (data && data.length > 0) || false
  const [selectedLoan, setSelectedLoan] = useState<SpecialRateList>()
  const { currentLanguage } = useUtils()
  const [isActiveRow1, setIsActiveRow1] = useState('')
  const [isActiveRow2, setIsActiveRow2] = useState('')
  const [isActiveRow3, setIsActiveRow3] = useState('')
  const [isActiveRow4, setIsActiveRow4] = useState('')
  const [isActiveRow5, setIsActiveRow5] = useState('')
  const [isActiveRow6, setIsActiveRow6] = useState('')
  const [cirlceButtonRow1, setCircleButtonRow1] = useState(true)
  const [cirlceButtonRow2, setCircleButtonRow2] = useState(false)
  const [cirlceButtonRow3, setCircleButtonRow3] = useState(false)
  const [cirlceButtonRow4, setCircleButtonRow4] = useState(false)
  const [cirlceButtonRow5, setCircleButtonRow5] = useState(false)
  const [cirlceButtonRow6, setCircleButtonRow6] = useState(false)
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false)
  const [dpAmount, setDpAmount] = useState(
    data[0].dpAmount ? data[0].dpAmount : 0,
  )
  const [loanRank, setLoanRank] = useState('')
  const [monthlyInstallment, setMonthlyInstallment] = useState(
    data[0]?.installment || 0,
  )
  const [tenure, setTenure] = useState(data[0]?.tenure || 0)
  const [isSelectedLoanRankText, setIsSelectedLoanRankText] = useState('')
  const [isSelectedLoanRankBg, setIsSelectedLoanRankBg] = useState('')
  const { showModal: showPreapprovalModal, PreApprovalIntroModal } =
    usePreApprovalIntroModal()
  const { formSurveyValue: contextSurveyFormData } = useContextForm()
  // const { t } = useTranslation()
  const router = useRouter()
  const { showToast: showToastBrowser, RenderToast: RenderToastBrowser } =
    useToast()
  const { showToast, RenderToast } = useToast()
  const [, setSimpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [promoCode] = useSessionStorageWithEncryption<string>(
    SessionStorageKey.PromoCodeGiiass,
    '',
  )
  const [, setSelectedLoanTmp] = useLocalStorage<SpecialRateList | null>(
    LocalStorageKey.SelectedLoanTmp,
    null,
  )
  const { setSpecialRateResults } = useContextCalculator()
  const enableNewLogin = true
  const { recommendation } = useCar()

  const isCRM = useMemo(() => {
    const sessionRateType = getLocalStorage(LocalStorageKey.SelectedRateType)
    if (sessionRateType && sessionRateType === 'GIIASCRM') return true
    return false
  }, [data])

  const freeInsurance = useMemo(() => {
    const checkPassengerCar = NonPassengerCars.filter((item) =>
      carVariantDetails?.modelDetail.model.includes(item),
    )
    const checkBrand =
      carVariantDetails?.modelDetail.brand === 'Daihatsu' ||
      carVariantDetails?.modelDetail.brand === 'Toyota'
        ? true
        : false
    if (
      checkBrand &&
      checkPassengerCar.length === 0 &&
      isCRM &&
      isNewRegularPage
    )
      return true

    return false
  }, [isCRM, isNewRegularPage, carVariantDetails])

  useEffect(() => {
    setSelectedLoan(data[0])
    setSelectedLoan(data[0])
    setSelectedLoanTmp(data[0])
    const objData = {
      brand: carVariantDetails?.modelDetail.brand,
      model: carVariantDetails?.modelDetail.model,
      price: carVariantDetails?.variantDetail.priceValue,
      variant: carVariantDetails?.variantDetail.name,
      monthlyincome: contextSurveyFormData.totalIncome
        ? contextSurveyFormData.totalIncome?.value
        : '-',
      monthlyinstallment: data[0].installment,
      down_payment: data[0].dpAmount,
      loan_tenure: data[0].tenure,
      body_type: carVariantDetails?.variantDetail.bodyType
        ? carVariantDetails?.variantDetail.bodyType
        : '-',
    }
    setTrackEventMoEngage(
      'click_hitung_cicilan_regular_rate_calculator',
      objData,
    )

    if (data[0].loanRank == 'Green') {
      setIsSelectedLoanRankBg('#f1fbf9')
      setIsActiveRow1('Mudah')
      setIsSelectedLoanRankText('Mudah')
    }
    if (data[0].loanRank == 'Yellow') {
      setIsSelectedLoanRankBg('#F4D9DB')
      setIsActiveRow1('Sulit')
      setIsSelectedLoanRankText('Sulit')
    }
    if (data[0].loanRank == 'Red') {
      setIsSelectedLoanRankBg('#F4D9DB')
      setIsActiveRow1('Sulit')
      setIsSelectedLoanRankText('Sulit')
    }
    setCircleButtonRow1(true)
  }, [])

  const OnClicktRow1 = () => {
    setSelectedLoan(data[0])
    setSelectedLoanTmp(data[0])
    if (data[0]?.loanRank == 'Green') {
      setIsSelectedLoanRankBg('#f1fbf9')
      setIsActiveRow1('Mudah')
      setIsSelectedLoanRankText('Mudah')
    } else if (data[0]?.loanRank == 'Yellow' || data[0]?.loanRank == 'Red') {
      setIsSelectedLoanRankBg('#F4D9DB')
      setIsSelectedLoanRankText('Sulit')
      setIsActiveRow1('Sulit')
    }
    setDpAmount(Number(data[0].dpAmount))
    setLoanRank(String(data[0]?.loanRank))
    setMonthlyInstallment(Number(data[0].installment))
    setTenure(Number(data[0].tenure))
    setIsActiveRow2('none')
    setIsActiveRow3('none')
    setIsActiveRow4('none')
    setIsActiveRow5('none')
    setIsActiveRow6('none')
    setCircleButtonRow1(true)
    setCircleButtonRow2(false)
    setCircleButtonRow3(false)
    setCircleButtonRow4(false)
    setCircleButtonRow5(false)
    setCircleButtonRow6(false)
  }
  const OnClicktRow2 = () => {
    setSelectedLoan(data[1])
    setSelectedLoanTmp(data[1])
    if (data[1]?.loanRank == 'Green') {
      setIsSelectedLoanRankBg('#f1fbf9')
      setIsActiveRow2('Mudah')
      setIsSelectedLoanRankText('Mudah')
    } else if (data[1]?.loanRank == 'Yellow' || data[1]?.loanRank == 'Red') {
      setIsSelectedLoanRankBg('#F4D9DB')
      setIsSelectedLoanRankText('Sulit')
      setIsActiveRow2('Sulit')
    }
    setDpAmount(Number(data[1].dpAmount))
    setLoanRank(String(data[1]?.loanRank))
    setMonthlyInstallment(Number(data[1].installment))
    setTenure(Number(data[1].tenure))
    setIsActiveRow1('none')
    setIsActiveRow3('none')
    setIsActiveRow4('none')
    setIsActiveRow5('none')
    setIsActiveRow6('none')
    setCircleButtonRow1(false)
    setCircleButtonRow2(true)
    setCircleButtonRow3(false)
    setCircleButtonRow4(false)
    setCircleButtonRow5(false)
    setCircleButtonRow6(false)
  }
  const OnClicktRow3 = () => {
    setSelectedLoan(data[2])
    setSelectedLoanTmp(data[2])
    if (data[2]?.loanRank == 'Green') {
      setIsSelectedLoanRankBg('#f1fbf9')
      setIsSelectedLoanRankText('Mudah')
      setIsActiveRow3('Mudah')
    } else if (data[2]?.loanRank == 'Yellow' || data[2]?.loanRank == 'Red') {
      setIsSelectedLoanRankBg('#F4D9DB')
      setIsSelectedLoanRankText('Sulit')
      setIsActiveRow3('Sulit')
    }
    setDpAmount(Number(data[2].dpAmount))
    setLoanRank(String(data[2]?.loanRank))
    setMonthlyInstallment(Number(data[2].installment))
    setTenure(Number(data[2].tenure))
    setIsActiveRow2('none')
    setIsActiveRow1('none')
    setIsActiveRow4('none')
    setIsActiveRow5('none')
    setIsActiveRow6('none')
    setCircleButtonRow1(false)
    setCircleButtonRow2(false)
    setCircleButtonRow3(true)
    setCircleButtonRow4(false)
    setCircleButtonRow5(false)
    setCircleButtonRow6(false)
  }
  const OnClicktRow4 = () => {
    setSelectedLoan(data[3])
    setSelectedLoanTmp(data[3])
    if (data[3]?.loanRank == 'Green') {
      setIsSelectedLoanRankBg('#f1fbf9')
      setIsSelectedLoanRankText('Mudah')
      setIsActiveRow4('Mudah')
    } else if (data[3]?.loanRank == 'Yellow' || data[3]?.loanRank == 'Red') {
      setIsSelectedLoanRankBg('#F4D9DB')
      setIsSelectedLoanRankText('Sulit')
      setIsActiveRow4('Sulit')
    }
    setDpAmount(Number(data[3].dpAmount))
    setLoanRank(String(data[3]?.loanRank))
    setMonthlyInstallment(Number(data[3].installment))
    setTenure(Number(data[3].tenure))
    setIsActiveRow2('none')
    setIsActiveRow3('none')
    setIsActiveRow1('none')
    setIsActiveRow5('none')
    setIsActiveRow6('none')
    setCircleButtonRow1(false)
    setCircleButtonRow2(false)
    setCircleButtonRow3(false)
    setCircleButtonRow4(true)
    setCircleButtonRow5(false)
    setCircleButtonRow6(false)
  }
  const OnClicktRow5 = () => {
    setSelectedLoan(data[4])
    setSelectedLoanTmp(data[4])
    if (data[4]?.loanRank == 'Green') {
      setIsSelectedLoanRankBg('#f1fbf9')
      setIsSelectedLoanRankText('Mudah')
      setIsActiveRow5('Mudah')
    } else if (data[4]?.loanRank == 'Yellow' || data[4]?.loanRank == 'Red') {
      setIsSelectedLoanRankBg('#F4D9DB')
      setIsSelectedLoanRankText('Sulit')
      setIsActiveRow5('Sulit')
    }
    setDpAmount(Number(data[4].dpAmount))
    setLoanRank(String(data[4]?.loanRank))
    setMonthlyInstallment(Number(data[4].installment))
    setTenure(Number(data[4].tenure))
    setIsActiveRow2('none')
    setIsActiveRow3('none')
    setIsActiveRow4('none')
    setIsActiveRow1('none')
    setIsActiveRow6('none')
    setCircleButtonRow1(false)
    setCircleButtonRow2(false)
    setCircleButtonRow3(false)
    setCircleButtonRow4(false)
    setCircleButtonRow5(true)
    setCircleButtonRow6(false)
  }
  const OnClicktRow6 = () => {
    setSelectedLoan(data[5])
    setSelectedLoanTmp(data[5])
    if (data[5]?.loanRank == 'Green') {
      setIsSelectedLoanRankBg('#f1fbf9')
      setIsSelectedLoanRankText('Mudah')
      setIsActiveRow6('Mudah')
    } else if (data[5]?.loanRank == 'Yellow' || data[5]?.loanRank == 'Red') {
      setIsSelectedLoanRankBg('#F4D9DB')
      setIsSelectedLoanRankText('Sulit')
      setIsActiveRow6('Sulit')
    }

    setDpAmount(Number(data[5].dpAmount))
    setLoanRank(String(data[5]?.loanRank))
    setMonthlyInstallment(Number(data[5].installment))
    setTenure(Number(data[5].tenure))
    setIsActiveRow2('none')
    setIsActiveRow3('none')
    setIsActiveRow4('none')
    setIsActiveRow5('none')
    setIsActiveRow1('none')
    setCircleButtonRow1(false)
    setCircleButtonRow2(false)
    setCircleButtonRow3(false)
    setCircleButtonRow4(false)
    setCircleButtonRow5(false)
    setCircleButtonRow6(true)
  }

  const onInstalmentFreeModalButtonClick = () => {
    if (
      carVariantDetails &&
      selectedLoan?.tenure &&
      selectedLoan?.dpAmount &&
      selectedLoan?.installment &&
      selectedLoan?.loanRank
    ) {
      const simpleCarVariantDetails: SimpleCarVariantDetail = {
        modelId: carVariantDetails.modelDetail.id,
        variantId: carVariantDetails.variantDetail.id,
        loanTenure: selectedLoan?.tenure,
        loanDownPayment: selectedLoan?.dpAmount,
        loanMonthlyInstallment: selectedLoan?.installment,
        loanRank: selectedLoan?.loanRank,
        totalFirstPayment: selectedLoan?.totalFirstPayment,
        flatRate: selectedLoan?.interestRate,
      }
      setSimpleCarVariantDetails(simpleCarVariantDetails)
      setLoanRank(selectedLoan?.loanRank)
      setDpAmount(selectedLoan?.dpAmount)
    }
    showPreapprovalModal()
  }

  const { age, totalIncome } = contextSurveyFormData
  const goToWhatsApp = async () => {
    if (!carVariantDetails) {
      return
    }
    const {
      variantDetail: { name },
    } = carVariantDetails
    const modelName = getModelName(carVariantDetails.modelDetail)
    const message =
      `Halo, saya tertarik dengan ${modelName}, ${convertSlashesInStringToVerticalLines(
        name,
      )} dengan DP sebesar Rp ${dpAmount},` +
      ` cicilan per bulannya Rp ${monthlyInstallment}, dan tenor `
    const finalMessage = message.concat(`${tenure} tahun.`)

    const optionADDM = getLocalStorage(LocalStorageKey.SelectedAngsuranType)
    setLoadingWhatsApp(true)
    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()
    setLoadingWhatsApp(false)
    window.open(`${whatsAppUrl}?text=${encodeURI(finalMessage)}`, '_blank')

    tracSelectV2LoanCalculatorSpeak({
      loanRank: loanRank as NewFunnelLoanRank,
      age: String(age?.value),
      income: Number(totalIncome?.value),
      monthlyInstallments: monthlyInstallment,
      downPayment: dpAmount,
      tenure,
    })

    const trackerWACredit: CarVariantCreditTabParam = {
      Car_Brand: carVariantDetails.modelDetail.brand as string,
      Car_Model: carVariantDetails.modelDetail.model as string,
      Car_Variant: name,
      Income: `Rp${replacePriceSeparatorByLocalization(
        totalIncome?.value as number,
        LanguageCode.id,
      )}`,
      OTR: `Rp${replacePriceSeparatorByLocalization(
        carVariantDetails.variantDetail.priceValue,
        LanguageCode.id,
      )}`,
      DP: `Rp${formatSortPrice(dpAmount)} Juta`,
      Tenure: `Rp${String(tenure)} Tahun`,
      Cicilan: `Rp${formatSortPrice(monthlyInstallment)} jt/bln`,
      Pembayaran_Angsuran:
        optionADDM === InstallmentTypeOptions.ADDM
          ? 'Dibayar di muka'
          : 'dibayar di belakang',
      City: cityOtr?.cityName || 'Jakarta Pusat',
      Promo: promoCode || 'Null',
    }
    trackCarVariantCreditPageWaChatbot(trackerWACredit)

    if (window.location.pathname.includes('/kalkulator-kredit-promo')) {
      trackSpecialRateCalculatorWaChatbot()
    } else {
      trackRegularCalculatorWaChatbot()
    }
  }
  const saveSimpleCarData = () => {
    if (carVariantDetails) {
      const newSimpleCarVariantDetails: SimpleCarVariantDetail = {
        modelId: carVariantDetails.modelDetail.id,
        variantId: carVariantDetails.variantDetail.id,
        loanTenure: tenure,
        loanDownPayment: dpAmount,
        loanMonthlyInstallment: monthlyInstallment,
        loanRank: loanRank,
        totalFirstPayment: selectedLoan?.totalFirstPayment,
        flatRate: selectedLoan?.interestRate,
      }
      setSimpleCarVariantDetails(newSimpleCarVariantDetails)
    }
  }

  const onPreApprovalIntroStartButtonClick = () => {
    api
      .getSupportedBrowsers()
      .then((res: any) => {
        const loweredCaseList: string[] = []
        res.supportedLists.forEach((item: string) =>
          loweredCaseList.push(item.toLowerCase()),
        )

        if (!loweredCaseList.includes(usedBrowser.name?.toLowerCase() ?? '')) {
          showToastBrowser()
        } else {
          saveSimpleCarData()
          const moengageAttribute = {
            brand: carVariantDetails?.modelDetail.brand,
            model: carVariantDetails?.modelDetail.model,
            price: carVariantDetails?.variantDetail.priceValue.toString(),
            variants: carVariantDetails?.variantDetail.name,
            montly_instalment: selectedLoan?.installment.toString(),
            downpayment: selectedLoan?.dpAmount.toString(),
            loan_tenure: selectedLoan?.tenure.toString(),
            car_seat: carVariantDetails?.variantDetail.carSeats.toString(),
            fuel: carVariantDetails?.variantDetail.fuelType,
            transmition: carVariantDetails?.variantDetail.transmission,
            body_type: carVariantDetails?.variantDetail.bodyType,
            dimension:
              recommendation?.filter(
                (car) => car.id === carVariantDetails?.modelDetail.id,
              ).length > 0
                ? recommendation?.filter(
                    (car) => car.id === carVariantDetails?.modelDetail.id,
                  )[0].height
                : '',
          }

          saveLocalStorage(
            LocalStorageKey.MoengageAttribute,
            JSON.stringify(moengageAttribute),
          )
          setSpecialRateResults([])
          gotoTargetPage()
        }
      })
      .catch(() => showToast())
  }

  const gotoTargetPage = () => {
    if (getToken()) {
      goTopPreApprovalStartPage()
    } else {
      goToLoginPage()
    }
  }
  const goToLoginPage = () => {
    if (enableNewLogin) {
      savePageBeforeLogin(creditQualificationUrl)
      if (onCheckLogin) {
        onCheckLogin()
      } else {
        router.push(LoginSevaUrl)
      }
    } else {
      router.push(loginUrl)
    }
  }
  const goTopPreApprovalStartPage = () => router.push(creditQualificationUrl)

  const [hover, setHover] = useState(false)
  const onHover = () => {
    setHover(true)
  }

  const onLeave = () => {
    setHover(false)
  }

  const redAsterisk = () => {
    return <span style={{ color: 'red' }}>*</span>
  }

  const renderDisclaimerGiias = () => {
    return (
      <>
        <DisclaimerText>
          {redAsterisk()} Total Pembayaran Pertama = DP + Administrasi + Cicilan
          Pertama + Polis + TJH
        </DisclaimerText>
        <br />
        <DisclaimerText>
          {redAsterisk()} Cicilan Per Bulan: Sudah termasuk cicilan dan premi
          asuransi mobil
        </DisclaimerText>
        <br />
        <DisclaimerText>
          {redAsterisk()} Hasil perhitungan masih bersifat estimasi. Perhitungan
          final akan diberikan oleh partner SEVA
        </DisclaimerText>
        <br />
        <DisclaimerText>
          {redAsterisk()} Bunga Istimewa ini hanya berlaku di lokasi pameran
          {eventName}. Lakukan Instant Approval untuk mendapatkan Promo Asuransi
          di lokasi pameran {eventName}.
        </DisclaimerText>
        <br />
        <DisclaimerText>
          {redAsterisk()} Harga OTR dan perhitungan kredit diatas dapat berubah
          sewaktu-waktu tergantung kebijakan masing-masing wilayah
        </DisclaimerText>
        <br />
        <DisclaimerText>
          Baca Syarat dan Ketentuan lengkap{' '}
          <a href={urls.promoPageGiias + '#terms-and-conditions'}>
            <span
              style={{
                fontFamily: 'var(--open-sans-bold)',
                fontWeight: '700',
                textDecoration: 'underline',
              }}
            >
              di sini.
            </span>
          </a>
        </DisclaimerText>
      </>
    )
  }

  const renderToolTipText = () => {
    if (isSelectedLoanRankText == 'Sulit') {
      return (
        <StyledTextHoverRed>
          Pendapatanmu belum mencukupi syarat minimum pengajuan kredit mobil
          ini. Coba naikkan nominal DP atau pilih mobil lain.
        </StyledTextHoverRed>
      )
    } else {
      return (
        <>
          <StyledTextHoverGreen1>
            Pendapatanmu mencukupi syarat minimum pengajuan kredit mobil ini dan
            berpeluang besar untuk mendapatkan persetujuan.
          </StyledTextHoverGreen1>
          <br />
          <StyledTextHoverWrapper>
            <StyledTextHoverGreen2>
              Sudah lebih dari 100 pelanggan Astra dengan kombinasi pendapatan
              dan cicilan serupa yang pengajuan kreditnya disetujui!
            </StyledTextHoverGreen2>
          </StyledTextHoverWrapper>
        </>
      )
    }
  }

  return (
    <>
      {carVariantDetails && (
        <>
          <SpecialRateContent
            enable={enableSpecialRate}
            onCarVariant={carVariantPage}
          >
            {carVariantPage ? (
              <LoanRank>
                <LoanRankContentCarVariant
                  background={
                    isSelectedLoanRankBg === '#f1fbf9'
                      ? '#DEF7DF'
                      : isSelectedLoanRankBg
                  }
                >
                  <TextSmallLoanRank
                    loanRank={isSelectedLoanRankText}
                    onCarVariantPage={carVariantPage}
                  >
                    {'Peluang Kreditmu:' + ' ' + isSelectedLoanRankText}
                  </TextSmallLoanRank>
                  <TooltipText onMouseLeave={onLeave} onMouseOver={onHover}>
                    <IconInfo color={'#9EA3AC'} width={20} height={20} />
                  </TooltipText>
                </LoanRankContentCarVariant>
              </LoanRank>
            ) : (
              <LoanRank>
                <StyledHeaderCalculatorSectionMedium>
                  Pilih paket cicilan kamu
                </StyledHeaderCalculatorSectionMedium>
                <LoanRankContent background={isSelectedLoanRankBg}>
                  <TextSmallLoanRank
                    loanRank={isSelectedLoanRankText}
                    onCarVariantPage={carVariantPage}
                  >
                    {isSelectedLoanRankText}
                  </TextSmallLoanRank>
                  <TooltipText onMouseLeave={onLeave} onMouseOver={onHover}>
                    <IconInfo width={16} height={16} color={'#9EA3AC'} />
                  </TooltipText>
                </LoanRankContent>
              </LoanRank>
            )}

            {hover ? (
              <TooltipCard>
                <TooltipBox>{renderToolTipText()}</TooltipBox>
              </TooltipCard>
            ) : null}
            <LoanRankList>
              <LoanRankListHeader>
                <LoanRankFirstColumnHeader></LoanRankFirstColumnHeader>
                <LoanRankSecondColumnHeader>
                  <StyeldTextSmallRegularHeader>
                    Tenor
                  </StyeldTextSmallRegularHeader>
                </LoanRankSecondColumnHeader>
                <LoanRankThirdColumnHeader>
                  <StyeldTextSmallRegularHeader>
                    TPP{redAsterisk()}
                  </StyeldTextSmallRegularHeader>
                </LoanRankThirdColumnHeader>
                <LoanRankFourthColumnHeader>
                  <StyeldTextSmallRegularHeaderInstallment>
                    Cicilan per Bulan
                    {!carVariantPage && redAsterisk()}
                  </StyeldTextSmallRegularHeaderInstallment>
                </LoanRankFourthColumnHeader>
              </LoanRankListHeader>
              {/* content row1*/}
              {data && data.length > 0 && (
                <LoanRankListContentRow1
                  loanRank={isActiveRow1}
                  onClick={() => OnClicktRow1()}
                  className={'special-rate-credit-1-element'}
                >
                  <LoanRankFirstColumn>
                    <CircleButton1
                      className={'special-rate-credit-1-cicle-element'}
                      isActive={cirlceButtonRow1}
                    />
                  </LoanRankFirstColumn>
                  {isNewRegularPage ? (
                    <LoanRankSecondColumnNewRegular
                      carVariantPage={carVariantPage}
                    >
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow1}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[0].tenure + ' Thn'
                          : data[0].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextInterestText
                        onCreditTab={carVariantPage}
                        isRowSelected={cirlceButtonRow1}
                      >
                        {'Bunga ' + data[0].interestRate + '%'}
                      </StyledTextInterestText>
                    </LoanRankSecondColumnNewRegular>
                  ) : (
                    <LoanRankSecondColumn>
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow1}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[0].tenure + ' Thn'
                          : data[0].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextIsActiveBlueSmall
                        isRowSelected={cirlceButtonRow1}
                      >
                        {'Bunga ' + data[0].interestRate + '%'}
                      </StyledTextIsActiveBlueSmall>
                    </LoanRankSecondColumn>
                  )}
                  <LoanRankThirdColumn insurance={freeInsurance}>
                    <StyledTextIsActiveBlueInstallment
                      isRowSelected={cirlceButtonRow1}
                    >
                      {data[0].totalFirstPayment &&
                        'Rp ' +
                          replacePriceSeparatorByLocalization(
                            data[0].totalFirstPayment,
                            currentLanguage,
                          )}
                    </StyledTextIsActiveBlueInstallment>
                    {freeInsurance && (
                      <img src={PromoAsuransi} alt="promo asuransi" />
                    )}
                  </LoanRankThirdColumn>
                  <LoanRankFourthColumn>
                    <FourthColumnWrapper1>
                      <StyledTextIsActiveBlueInstallment
                        isRowSelected={cirlceButtonRow1}
                      >
                        {data[0].installment &&
                          'Rp ' +
                            replacePriceSeparatorByLocalization(
                              data[0].installment,
                              currentLanguage,
                            )}
                      </StyledTextIsActiveBlueInstallment>
                    </FourthColumnWrapper1>
                    <FourthColumnWrapper2>
                      <StyledTextIsActive isRowSelected={cirlceButtonRow1}>
                        {!isNewRegularPage
                          ? data[0].saveAmount &&
                            !data[0].saveAmount?.toString().includes('-') &&
                            data[0].saveAmount?.toString().length >= 7
                            ? 'Hemat hingga Rp ' +
                              data[0].saveAmount?.toString().slice(0, 1) +
                              ' jt'
                            : !data[0].saveAmount?.toString().includes('-') &&
                              data[0].saveAmount?.toString().length == 6 &&
                              data[0].saveAmount?.toString().length >= 3
                            ? 'Hemat hingga Rp ' +
                              data[0].saveAmount?.toString().slice(0, 3) +
                              ' rb'
                            : !data[0].saveAmount?.toString().includes('-') &&
                              data[0].saveAmount?.toString().length == 5 &&
                              data[0].saveAmount?.toString().length >= 3
                            ? 'Hemat hingga Rp ' +
                              data[0].saveAmount?.toString().slice(0, 2) +
                              ' rb'
                            : 'Promo Tenor Panjang'
                          : data[0].saveAmount &&
                            !data[0].saveAmount?.toString().includes('-') &&
                            data[0].saveAmount?.toString().length >= 7
                          ? 'Hemat hingga Rp ' +
                            data[0].saveAmount?.toString().slice(0, 1) +
                            ' jt'
                          : !data[0].saveAmount?.toString().includes('-') &&
                            data[0].saveAmount?.toString().length == 6 &&
                            data[0].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[0].saveAmount?.toString().slice(0, 3) +
                            ' rb'
                          : !data[0].saveAmount?.toString().includes('-') &&
                            data[0].saveAmount?.toString().length == 5 &&
                            data[0].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[0].saveAmount?.toString().slice(0, 2) +
                            ' rb'
                          : null}
                      </StyledTextIsActive>
                    </FourthColumnWrapper2>
                  </LoanRankFourthColumn>
                </LoanRankListContentRow1>
              )}
              {/* row 2*/}
              {data.length > 1 && (
                <LoanRankListContentRow2
                  onClick={() => OnClicktRow2()}
                  loanRank={isActiveRow2}
                  className={'special-rate-credit-2-element'}
                >
                  <LoanRankFirstColumn>
                    <CircleButton2
                      className={'special-rate-credit-2-cicle-element'}
                      isActive={cirlceButtonRow2}
                    />
                  </LoanRankFirstColumn>
                  {isNewRegularPage ? (
                    <LoanRankSecondColumnNewRegular
                      carVariantPage={carVariantPage}
                    >
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow2}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[1].tenure + ' Thn'
                          : data[1].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextInterestText
                        onCreditTab={carVariantPage}
                        isRowSelected={cirlceButtonRow2}
                      >
                        {'Bunga ' + data[1].interestRate + '%'}
                      </StyledTextInterestText>
                    </LoanRankSecondColumnNewRegular>
                  ) : (
                    <LoanRankSecondColumn>
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow2}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[1].tenure + ' Thn'
                          : data[1].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextIsActiveBlueSmall
                        isRowSelected={cirlceButtonRow2}
                      >
                        {'Bunga ' + data[1].interestRate + '%'}
                      </StyledTextIsActiveBlueSmall>
                    </LoanRankSecondColumn>
                  )}
                  <LoanRankThirdColumn insurance={freeInsurance}>
                    <StyledTextIsActiveBlueInstallment
                      isRowSelected={cirlceButtonRow2}
                    >
                      {data[1].totalFirstPayment &&
                        'Rp ' +
                          replacePriceSeparatorByLocalization(
                            data[1].totalFirstPayment,
                            currentLanguage,
                          )}
                    </StyledTextIsActiveBlueInstallment>
                    {freeInsurance && (
                      <img src={PromoAsuransi} alt="promo asuransi" />
                    )}
                  </LoanRankThirdColumn>
                  <LoanRankFourthColumn>
                    <FourthColumnWrapper1>
                      <StyledTextIsActiveBlueInstallment
                        isRowSelected={cirlceButtonRow2}
                      >
                        {data[1].installment &&
                          'Rp ' +
                            replacePriceSeparatorByLocalization(
                              data[1].installment,
                              currentLanguage,
                            )}
                      </StyledTextIsActiveBlueInstallment>
                    </FourthColumnWrapper1>
                    <FourthColumnWrapper2>
                      <StyledTextIsActive isRowSelected={cirlceButtonRow2}>
                        {data[1].saveAmount &&
                        !data[1].saveAmount?.toString().includes('-') &&
                        data[1].saveAmount?.toString().length >= 7
                          ? 'Hemat hingga Rp ' +
                            data[1].saveAmount?.toString().slice(0, 1) +
                            ' jt'
                          : !data[1].saveAmount?.toString().includes('-') &&
                            data[1].saveAmount?.toString().length == 6 &&
                            data[1].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[1].saveAmount?.toString().slice(0, 3) +
                            ' rb'
                          : !data[1].saveAmount?.toString().includes('-') &&
                            data[1].saveAmount?.toString().length == 5 &&
                            data[1].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[1].saveAmount?.toString().slice(0, 2) +
                            ' rb'
                          : null}
                      </StyledTextIsActive>
                    </FourthColumnWrapper2>
                  </LoanRankFourthColumn>
                </LoanRankListContentRow2>
              )}
              {/* row3 */}
              {data.length > 2 && (
                <LoanRankListContentRow3
                  onClick={() => OnClicktRow3()}
                  loanRank={isActiveRow3}
                  className={'special-rate-credit-3-element'}
                >
                  <LoanRankFirstColumn>
                    <CircleButton3
                      className={'special-rate-credit-3-cicle-element'}
                      isActive={cirlceButtonRow3}
                    />
                  </LoanRankFirstColumn>
                  {isNewRegularPage ? (
                    <LoanRankSecondColumnNewRegular
                      carVariantPage={carVariantPage}
                    >
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow3}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[2].tenure + ' Thn'
                          : data[2].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextInterestText
                        onCreditTab={carVariantPage}
                        isRowSelected={cirlceButtonRow3}
                      >
                        {'Bunga ' + data[2].interestRate + '%'}
                      </StyledTextInterestText>
                    </LoanRankSecondColumnNewRegular>
                  ) : (
                    <LoanRankSecondColumn>
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow3}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[2].tenure + ' Thn'
                          : data[2].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextIsActiveBlueSmall
                        isRowSelected={cirlceButtonRow3}
                      >
                        {'Bunga ' + data[2].interestRate + '%'}
                      </StyledTextIsActiveBlueSmall>
                    </LoanRankSecondColumn>
                  )}
                  <LoanRankThirdColumn insurance={freeInsurance}>
                    <StyledTextIsActiveBlueInstallment
                      isRowSelected={cirlceButtonRow3}
                    >
                      {data[2].totalFirstPayment &&
                        'Rp ' +
                          replacePriceSeparatorByLocalization(
                            data[2].totalFirstPayment,
                            currentLanguage,
                          )}
                    </StyledTextIsActiveBlueInstallment>
                    {freeInsurance && (
                      <img src={PromoAsuransi} alt="promo asuransi" />
                    )}
                  </LoanRankThirdColumn>
                  <LoanRankFourthColumn>
                    <FourthColumnWrapper1>
                      <StyledTextIsActiveBlueInstallment
                        isRowSelected={cirlceButtonRow3}
                      >
                        {data[2].installment &&
                          'Rp ' +
                            replacePriceSeparatorByLocalization(
                              data[2].installment,
                              currentLanguage,
                            )}
                      </StyledTextIsActiveBlueInstallment>
                    </FourthColumnWrapper1>
                    <FourthColumnWrapper2>
                      <StyledTextIsActive isRowSelected={cirlceButtonRow3}>
                        {data[2].saveAmount &&
                        !data[2].saveAmount?.toString().includes('-') &&
                        data[2].saveAmount?.toString().length >= 7
                          ? 'Hemat hingga Rp ' +
                            data[2].saveAmount?.toString().slice(0, 1) +
                            ' jt'
                          : !data[2].saveAmount?.toString().includes('-') &&
                            data[2].saveAmount?.toString().length == 6 &&
                            data[2].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[2].saveAmount?.toString().slice(0, 3) +
                            ' rb'
                          : !data[2].saveAmount?.toString().includes('-') &&
                            data[2].saveAmount?.toString().length == 5 &&
                            data[2].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[2].saveAmount?.toString().slice(0, 2) +
                            ' rb'
                          : null}
                      </StyledTextIsActive>
                    </FourthColumnWrapper2>
                  </LoanRankFourthColumn>
                </LoanRankListContentRow3>
              )}
              {/* row4 */}
              {data.length > 3 && (
                <LoanRankListContentRow4
                  onClick={() => OnClicktRow4()}
                  loanRank={isActiveRow4}
                  className={'special-rate-credit-4-element'}
                >
                  <LoanRankFirstColumn>
                    <CircleButton4
                      className={'special-rate-credit-4-cicle-element'}
                      isActive={cirlceButtonRow4}
                    />
                  </LoanRankFirstColumn>
                  {isNewRegularPage ? (
                    <LoanRankSecondColumnNewRegular
                      carVariantPage={carVariantPage}
                    >
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow4}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[3].tenure + ' Thn'
                          : data[3].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextInterestText
                        onCreditTab={carVariantPage}
                        isRowSelected={cirlceButtonRow4}
                      >
                        {'Bunga ' + data[3].interestRate + '%'}
                      </StyledTextInterestText>
                    </LoanRankSecondColumnNewRegular>
                  ) : (
                    <LoanRankSecondColumn>
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow4}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[3].tenure + ' Thn'
                          : data[3].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextIsActiveBlueSmall
                        isRowSelected={cirlceButtonRow4}
                      >
                        {'Bunga ' + data[3].interestRate + '%'}
                      </StyledTextIsActiveBlueSmall>
                    </LoanRankSecondColumn>
                  )}
                  <LoanRankThirdColumn insurance={false}>
                    <StyledTextIsActiveBlueInstallment
                      isRowSelected={cirlceButtonRow4}
                    >
                      {data[3].totalFirstPayment &&
                        'Rp ' +
                          replacePriceSeparatorByLocalization(
                            data[3].totalFirstPayment,
                            currentLanguage,
                          )}
                    </StyledTextIsActiveBlueInstallment>
                  </LoanRankThirdColumn>
                  <LoanRankFourthColumn>
                    <FourthColumnWrapper1>
                      <StyledTextIsActiveBlueInstallment
                        isRowSelected={cirlceButtonRow4}
                      >
                        {data[3].installment &&
                          'Rp ' +
                            replacePriceSeparatorByLocalization(
                              data[3].installment,
                              currentLanguage,
                            )}
                      </StyledTextIsActiveBlueInstallment>
                    </FourthColumnWrapper1>
                    <FourthColumnWrapper2>
                      <StyledTextIsActive isRowSelected={cirlceButtonRow4}>
                        {data[3].saveAmount &&
                        !data[3].saveAmount?.toString().includes('-') &&
                        data[3].saveAmount?.toString().length >= 7
                          ? 'Hemat hingga Rp ' +
                            data[3].saveAmount?.toString().slice(0, 1) +
                            ' jt'
                          : !data[3].saveAmount?.toString().includes('-') &&
                            data[3].saveAmount?.toString().length == 6 &&
                            data[3].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[3].saveAmount?.toString().slice(0, 3) +
                            ' rb'
                          : !data[3].saveAmount?.toString().includes('-') &&
                            data[3].saveAmount?.toString().length == 5 &&
                            data[3].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[3].saveAmount?.toString().slice(0, 2) +
                            ' rb'
                          : null}
                      </StyledTextIsActive>
                    </FourthColumnWrapper2>
                  </LoanRankFourthColumn>
                </LoanRankListContentRow4>
              )}
              {/* row 5 */}
              {data.length > 4 && (
                <LoanRankListContentRow5
                  onClick={() => OnClicktRow5()}
                  loanRank={isActiveRow5}
                  className={'special-rate-credit-5-element'}
                >
                  <LoanRankFirstColumn>
                    <CircleButton5
                      className={'special-rate-credit-5-cicle-element'}
                      isActive={cirlceButtonRow5}
                    />
                  </LoanRankFirstColumn>
                  {isNewRegularPage ? (
                    <LoanRankSecondColumnNewRegular
                      carVariantPage={carVariantPage}
                    >
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow5}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[4].tenure + ' Thn'
                          : data[4].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextInterestText
                        onCreditTab={carVariantPage}
                        isRowSelected={cirlceButtonRow5}
                      >
                        {'Bunga ' + data[4].interestRate + '%'}
                      </StyledTextInterestText>
                    </LoanRankSecondColumnNewRegular>
                  ) : (
                    <LoanRankSecondColumn>
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow5}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[4].tenure + ' Thn'
                          : data[4].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextIsActiveBlueSmall
                        isRowSelected={cirlceButtonRow5}
                      >
                        {'Bunga ' + data[4].interestRate + '%'}
                      </StyledTextIsActiveBlueSmall>
                    </LoanRankSecondColumn>
                  )}
                  <LoanRankThirdColumn insurance={false}>
                    <StyledTextIsActiveBlueInstallment
                      isRowSelected={cirlceButtonRow5}
                    >
                      {data[4].totalFirstPayment &&
                        'Rp ' +
                          replacePriceSeparatorByLocalization(
                            data[4].totalFirstPayment,
                            currentLanguage,
                          )}
                    </StyledTextIsActiveBlueInstallment>
                  </LoanRankThirdColumn>
                  <LoanRankFourthColumn>
                    <FourthColumnWrapper1>
                      <StyledTextIsActiveBlueInstallment
                        isRowSelected={cirlceButtonRow5}
                      >
                        {data[4].installment &&
                          'Rp ' +
                            replacePriceSeparatorByLocalization(
                              data[4].installment,
                              currentLanguage,
                            )}
                      </StyledTextIsActiveBlueInstallment>
                    </FourthColumnWrapper1>
                    <FourthColumnWrapper2>
                      <StyledTextIsActive isRowSelected={cirlceButtonRow5}>
                        {data[4].saveAmount &&
                        !data[4].saveAmount?.toString().includes('-') &&
                        data[4].saveAmount?.toString().length >= 7
                          ? 'Hemat hingga Rp ' +
                            data[4].saveAmount?.toString().slice(0, 1) +
                            ' jt'
                          : !data[4].saveAmount?.toString().includes('-') &&
                            data[4].saveAmount?.toString().length == 6 &&
                            data[4].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[4].saveAmount?.toString().slice(0, 3) +
                            ' rb'
                          : !data[4].saveAmount?.toString().includes('-') &&
                            data[4].saveAmount?.toString().length == 5 &&
                            data[4].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[4].saveAmount?.toString().slice(0, 2) +
                            ' rb'
                          : null}
                      </StyledTextIsActive>
                    </FourthColumnWrapper2>
                  </LoanRankFourthColumn>
                </LoanRankListContentRow5>
              )}
              {/* row 6*/}
              {data.length > 5 && (
                <LoanRankListContentRow6
                  onClick={() => OnClicktRow6()}
                  loanRank={isActiveRow6}
                  className={'special-rate-credit-6-element'}
                >
                  <LoanRankFirstColumn>
                    <CircleButton6
                      className={'special-rate-credit-6-cicle-element'}
                      isActive={cirlceButtonRow6}
                    />
                  </LoanRankFirstColumn>
                  {isNewRegularPage ? (
                    <LoanRankSecondColumnNewRegular
                      carVariantPage={carVariantPage}
                    >
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow1}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[5].tenure + ' Thn'
                          : data[5].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextInterestText
                        onCreditTab={carVariantPage}
                        isRowSelected={cirlceButtonRow1}
                      >
                        {'Bunga ' + data[5].interestRate + '%'}
                      </StyledTextInterestText>
                    </LoanRankSecondColumnNewRegular>
                  ) : (
                    <LoanRankSecondColumn>
                      <StyledTextIsActiveBlue
                        onCarVariant={carVariantPage}
                        isRowSelected={cirlceButtonRow1}
                        className={'special-rate-credit-1-year-element'}
                      >
                        {carVariantPage
                          ? data[5].tenure + ' Thn'
                          : data[5].tenure + ' Tahun'}
                      </StyledTextIsActiveBlue>
                      <StyledTextIsActiveBlueSmall
                        isRowSelected={cirlceButtonRow1}
                      >
                        {'Bunga ' + data[5].interestRate + '%'}
                      </StyledTextIsActiveBlueSmall>
                    </LoanRankSecondColumn>
                  )}
                  <LoanRankThirdColumn insurance={false}>
                    <StyledTextIsActiveBlueInstallment
                      isRowSelected={cirlceButtonRow6}
                    >
                      {data[5].totalFirstPayment &&
                        'Rp ' +
                          replacePriceSeparatorByLocalization(
                            data[5].totalFirstPayment,
                            currentLanguage,
                          )}
                    </StyledTextIsActiveBlueInstallment>
                  </LoanRankThirdColumn>
                  <LoanRankFourthColumn>
                    <FourthColumnWrapper1>
                      <StyledTextIsActiveBlueInstallment
                        isRowSelected={cirlceButtonRow6}
                      >
                        {data[5].installment &&
                          'Rp ' +
                            replacePriceSeparatorByLocalization(
                              data[5].installment,
                              currentLanguage,
                            )}
                      </StyledTextIsActiveBlueInstallment>
                    </FourthColumnWrapper1>
                    <FourthColumnWrapper2>
                      <StyledTextIsActive isRowSelected={cirlceButtonRow6}>
                        {data[5].saveAmount &&
                        !data[5].saveAmount?.toString().includes('-') &&
                        data[5].saveAmount?.toString().length >= 7
                          ? 'Hemat hingga Rp ' +
                            data[5].saveAmount?.toString().slice(0, 1) +
                            ' jt'
                          : !data[5].saveAmount?.toString().includes('-') &&
                            data[5].saveAmount?.toString().length == 6 &&
                            data[5].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[5].saveAmount?.toString().slice(0, 3) +
                            ' rb'
                          : !data[5].saveAmount?.toString().includes('-') &&
                            data[5].saveAmount?.toString().length == 5 &&
                            data[5].saveAmount?.toString().length >= 3
                          ? 'Hemat hingga Rp ' +
                            data[5].saveAmount?.toString().slice(0, 2) +
                            ' rb'
                          : null}
                      </StyledTextIsActive>
                    </FourthColumnWrapper2>
                  </LoanRankFourthColumn>
                </LoanRankListContentRow6>
              )}
            </LoanRankList>
          </SpecialRateContent>
          <WordingWrapper onCarVariant={carVariantPage}>
            {isInGiiasCalc ? (
              renderDisclaimerGiias()
            ) : (
              <>
                <DisclaimerText>
                  {redAsterisk()} Total Pembayaran Pertama = DP + Administrasi +
                  Cicilan Pertama + Polis + TJH
                </DisclaimerText>
                <br />
                <DisclaimerText>
                  {redAsterisk()} Cicilan Per Bulan: Sudah termasuk cicilan dan
                  premi asuransi mobil
                </DisclaimerText>
                <br />
                {/* <DisclaimerText>
                  {redAsterisk()} Harga di atas adalah harga normal. Lakukan
                  Instant Approval untuk mendapatkan tiket gratis dan Bunga
                  Istimewa di lokasi pameran GIIAS Surabaya 2022.
                </DisclaimerText> */}
              </>
            )}
          </WordingWrapper>
          {data && isNewRegularPage && isSelectedLoanRankText == 'Mudah' ? (
            <StyledApplyNow onCarVariant={carVariantPage}>
              {!carVariantPage && (
                <StyledInsuranceWrapper>
                  <StyledInsuranceImg src={AstraLogo} />
                  <StyledWrapperTextInsurance>
                    <StyledTextInsurance>
                      Penyedia asuransi didukung oleh
                    </StyledTextInsurance>
                    <StyledTextInsurance>
                      Asuransi Astra Garda Oto
                    </StyledTextInsurance>
                  </StyledWrapperTextInsurance>
                </StyledInsuranceWrapper>
              )}
              <StyledButtonNewRegularRateButton
                data-testid={elementId.InstantApproval.ButtonApplyIA}
                onClick={onInstalmentFreeModalButtonClick}
                id={'submit-pa-button-element'}
                className={'submit-pa-button-element'}
                onCarVariant={carVariantPage}
              >
                <StyledButtonNewRegularRateText onCarVariant={carVariantPage}>
                  Ajukan Instant Approval
                </StyledButtonNewRegularRateText>
              </StyledButtonNewRegularRateButton>
            </StyledApplyNow>
          ) : data && isNewRegularPage && isSelectedLoanRankText == 'Sulit' ? (
            <StyledApplyNow onCarVariant={carVariantPage}>
              <StyledButtonWhatsApp onClick={goToWhatsApp}>
                <StyledWhatsAppButtonText>
                  Ngobrol dengan Agen Kami
                  <IconWhatsapp width={24} height={24} />
                </StyledWhatsAppButtonText>
              </StyledButtonWhatsApp>
              {/* {carVariantPage ? (
              <WhatsAppContactUsNewIcon
                showDescription={false}
                onContactUsClick={goToWhatsApp}
                loading={loadingWhatsApp}
                buttonText={'newFunnelVariantDetailsPage.contactUs'}
              />
              ) : (
                <WhatsAppContactUs
                  showDescription={false}
                  onContactUsClick={goToWhatsApp}
                  loading={loadingWhatsApp}
                  buttonText={'newFunnelVariantDetailsPage.contactUs'}
                />
              )} */}
            </StyledApplyNow>
          ) : null}
          {data && !isNewRegularPage && isSelectedLoanRankText == 'Mudah' ? (
            <StyledApplyNow onCarVariant={carVariantPage}>
              <StyledButtonNewRegularRateButton
                onClick={onInstalmentFreeModalButtonClick}
                className={'special-rate-submit-pa-button-element'}
                onCarVariant={carVariantPage}
              >
                Ajukan Instant Approval
              </StyledButtonNewRegularRateButton>
            </StyledApplyNow>
          ) : data && !isNewRegularPage && isSelectedLoanRankText == 'Sulit' ? (
            <StyledApplyNow onCarVariant={carVariantPage}>
              <StyledButtonWhatsApp onClick={goToWhatsApp}>
                <StyledWhatsAppButtonText>
                  Ngobrol dengan Agen Kami
                  <IconWhatsapp width={24} height={24} />
                </StyledWhatsAppButtonText>
              </StyledButtonWhatsApp>
            </StyledApplyNow>
          ) : null}
          <PreApprovalIntroModal
            onPositiveButtonClick={onPreApprovalIntroStartButtonClick}
          />
          <RenderToast
            type={ToastType.Error}
            message={'Oops.. Sepertinya terjadi kesalahan. Coba lagi nanti.'}
          />
          <RenderToastBrowser
            type={ToastType.Error}
            message={
              'Mohon maaf, browser yang digunakan belum mendukung beberapa fitur kami. Silakan menggunakan browser Google Chrome atau Safari.'
            }
          />
        </>
      )}
    </>
  )
}

const LoanRank = styled.div`
  display: flex;
  justify-content: space-between;
  // 40px
  margin-bottom: 22px;
  @media (max-width: 1024px) {
    margin-bottom: 20px;
    align-items: center;
  }
`
const LoanRankContent = styled.div<{ background: string }>`
  background: ${({ background }) => background};
  opacity: 0.8;
  border-radius: 40px;
  width: 100px;
  height: 40px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

const LoanRankContentCarVariant = styled.div<{ background: string }>`
  background: ${({ background }) => background};
  opacity: 0.9;
  border-radius: 24px;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 24px;
  padding-right: 21px;
  @media (max-width: 1024px) {
    border-radius: 40px;
  }
`
const TextSmall = styled.span`
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  font-weight: 600;
  font-family: var(--kanyon);
`
const LoanRankList = styled.div`
  background: #ffffff;
  width: 100%;
  height: auto;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
  border-radius: 16px;
  border: 1px solid ${colors.line};
`
const LoanRankListHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.line};
  height: 81px;
  @media (max-width: 1024px) {
    height: 68px;
  }
`
const LoanRankListContentRow1 = styled.div<{ loanRank: string }>`
  background: ${({ loanRank }) =>
    loanRank == 'Mudah'
      ? `#f1fbf9`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : ''};
  display: flex;
  height: 81px;
  border-bottom: 1px solid ${colors.line};
  cursor: pointer;
  @media (max-width: 1024px) {
    height: 76px;
  }
`
const LoanRankListContentRow2 = styled.div<{ loanRank: string }>`
  background: ${({ loanRank }) =>
    loanRank == 'Mudah'
      ? `#f1fbf9`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : ''};
  display: flex;
  height: 81px;
  cursor: pointer;
  border-bottom: 1px solid ${colors.line};
  @media (max-width: 1024px) {
    height: 76px;
  }
`
const LoanRankListContentRow3 = styled.div<{ loanRank: string }>`
  background: ${({ loanRank }) =>
    loanRank == 'Mudah'
      ? `#f1fbf9`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : ''};
  display: flex;
  height: 81px;
  cursor: pointer;
  border-bottom: 1px solid ${colors.line};
  @media (max-width: 1024px) {
    height: 76px;
  }
`
const LoanRankListContentRow4 = styled.div<{ loanRank: string }>`
  background: ${({ loanRank }) =>
    loanRank == 'Mudah'
      ? `#f1fbf9`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : ''};
  display: flex;
  height: 81px;
  cursor: pointer;
  border-bottom: 1px solid ${colors.line};
  @media (max-width: 1024px) {
    height: 76px;
  }
`
const LoanRankListContentRow5 = styled.div<{ loanRank: string }>`
  background: ${({ loanRank }) =>
    loanRank == 'Mudah'
      ? `#f1fbf9`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : ''};
  display: flex;
  height: 81px;
  cursor: pointer;
  border-bottom: 1px solid ${colors.line};
  @media (max-width: 1024px) {
    height: 76px;
    border-radius: 0px 0px 10px 10px;
  }
`
const LoanRankListContentRow6 = styled.div<{ loanRank: string }>`
  background: ${({ loanRank }) =>
    loanRank == 'Mudah'
      ? `#f1fbf9`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : loanRank == 'Sulit'
      ? `#F4D9DB`
      : ''};
  display: flex;
  height: 81px;
  cursor: pointer;
  border-radius: 0px 0px 16px 16px;
  border-bottom: 1px solid ${colors.line};
  @media (max-width: 1024px) {
    height: 76px;
  }
`

const LoanRankFirstColumnHeader = styled.div`
  display: flex;
  margin: auto;
  width: 10%;
  justify-content: center;
  @media (max-width: 1024px) {
    margin-left: 10px;
    margin-right: 15px;
  }
`
const LoanRankFirstColumn = styled.div`
  display: flex;
  margin: auto;
  width: 10%;
  justify-content: center;

  @media (max-width: 1024px) {
    margin-left: 10px;
    margin-right: 15px;
    padding-bottom: 32px;
  }
`

const LoanRankSecondColumnHeader = styled.div`
  display: flex;
  width: 30%;
  margin: auto;
  align-items: center;

  @media (max-width: 1024px) {
    padding-left: 0px;
    width: 25%;
  }
`
const LoanRankSecondColumn = styled.div`
  display: flex;
  margin: auto;
  width: 30%;
  flex-direction: row;
  align-items: center;

  @media (max-width: 1024px) {
    align-items: start;
    flex-direction: column;
    width: 25%;
    padding-bottom: 20px;
  }
`
const LoanRankSecondColumnNewRegular = styled.div<{ carVariantPage: boolean }>`
  display: flex;
  margin: auto;
  width: ${({ carVariantPage }) => (carVariantPage ? '25%' : '30%')};
  flex-direction: column;

  @media (max-width: 1024px) {
    align-items: start;
    flex-direction: column;
    width: 25%;
    padding-bottom: 10px;
  }
`

const LoanRankThirdColumnHeader = styled.div`
  display: flex;
  width: 30%;
  margin: auto;
  align-items: center;

  @media (max-width: 1024px) {
    width: 35%;
  }
`

const LoanRankThirdColumn = styled.div<{ insurance: boolean }>`
  display: flex;
  width: 30%;
  margin: auto;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  @media (max-width: 1024px) {
    width: 35%;
    flex-direction: column;
    align-items: start;
    padding-top: 0px;
    padding-bottom: ${({ insurance }) => (insurance ? '20px' : '40px')};
  }
`
const LoanRankFourthColumnHeader = styled.div`
  display: flex;
  // 35%
  width: 39%;
  margin: auto;
  align-items: center;

  @media (max-width: 1024px) {
    width: 38%;
    padding-right: 15px;
  }
`
const LoanRankFourthColumn = styled.div`
  display: flex;
  // 35%
  width: 44%;
  flex-direction: row;
  margin: auto;
  align-items: center;
  padding-left: 19px;

  @media (max-width: 1024px) {
    width: 38%;
    flex-direction: column;
    padding-left: 0px;
  }
`

const CircleButton1 = styled.div<{ isActive: boolean }>`
  border: ${({ isActive }) =>
    isActive ? `7px solid ${colors.primary1}` : `4px solid ${colors.line}`};
  border-radius: 24px;
  width: 24px;
  height: 24px;
`

const CircleButton2 = styled.div<{ isActive: boolean }>`
  border: ${({ isActive }) =>
    isActive ? `7px solid ${colors.primary1}` : `4px solid ${colors.line}`};
  border-radius: 24px;
  width: 24px;
  height: 24px;
`
const CircleButton3 = styled.div<{ isActive: boolean }>`
  border: ${({ isActive }) =>
    isActive ? `7px solid ${colors.primary1}` : `4px solid ${colors.line}`};
  border-radius: 24px;
  width: 24px;
  height: 24px;
`
const CircleButton4 = styled.div<{ isActive: boolean }>`
  border: ${({ isActive }) =>
    isActive ? `7px solid ${colors.primary1}` : `4px solid ${colors.line}`};
  border-radius: 24px;
  width: 24px;
  height: 24px;
`
const CircleButton5 = styled.div<{ isActive: boolean }>`
  border: ${({ isActive }) =>
    isActive ? `7px solid ${colors.primary1}` : `4px solid ${colors.line}`};
  border-radius: 24px;
  width: 24px;
  height: 24px;
`
const CircleButton6 = styled.div<{ isActive: boolean }>`
  border: ${({ isActive }) =>
    isActive ? `7px solid ${colors.primary1}` : `4px solid ${colors.line}`};
  border-radius: 24px;
  width: 24px;
  height: 24px;
`
const StyeldTextSmallRegular = styled.span`
  font-family: var(--open-sans);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  @media (max-width: 1024px) {
    font-size: 12px;
  }
`
const StyeldTextSmallRegularHeader = styled.span`
  font-family: var(--kanyon-medium);
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  @media (max-width: 1024px) {
    font-family: var(--kanyon);
    font-size: 12px;
  }
`
const StyeldTextSmallRegularHeaderInstallment = styled.span`
  font-family: var(--kanyon-medium);
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  @media (max-width: 1024px) {
    font-family: var(--kanyon);
    font-size: 12px;
  }
`

const StyledHeaderCalculatorSectionMedium = styled.h3`
  float: left;
  font-style: normal;
  letter-spacing: 0px;
  color: #031838;

  line-height: 36px;
  font-family: var(--kanyon-bold);
  font-weight: 700;
  color: ${colors.title};
  font-size: 20px;

  @media (max-width: 1024px) {
    font-size: 16px;
    font-weight: 600;
    line-height: 18px;
  }
`
const SpecialRateContent = styled.div<{
  enable: boolean
  onCarVariant: boolean
}>`
  display: ${({ enable }) => (enable ? `block` : `none}`)};
  margin-bottom: ${({ enable }) => (enable ? `30px` : `20px`)};
`

const StyledApplyNow = styled.div<{ onCarVariant: boolean }>`
  margin-top: 20px;
  width: ${({ onCarVariant }) => !onCarVariant && `50%`};
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 1024px) {
    width: 100%;
    position: ${({ onCarVariant }) => (onCarVariant ? `fixed` : ``)};
    bottom: ${({ onCarVariant }) => (onCarVariant ? `0px` : ``)};
    z-index: 9;
    left: 0px;
    padding: ${({ onCarVariant }) => (onCarVariant ? '10px 15px' : ``)};
    background: ${({ onCarVariant }) => (onCarVariant ? colors.white : ``)};
  }
`
const StyledTextIsActive = styled(StyeldTextSmallRegular)<{
  isRowSelected: boolean
}>`
  color: ${({ isRowSelected }) => (isRowSelected ? `#2CAA30` : ``)};
  font-weight: ${({ isRowSelected }) => (isRowSelected ? `600` : ``)};
  font-family: ${({ isRowSelected }) =>
    isRowSelected ? `OpenSansBold` : `OpenSans`};
  font-size: 12px;

  @media (max-width: 1024px) {
    color: ${({ isRowSelected }) => (isRowSelected ? `#2CAA30` : ``)};
    font-weight: ${({ isRowSelected }) => (isRowSelected ? `600` : ``)};
    font-family: ${({ isRowSelected }) =>
      isRowSelected ? `OpenSansBold` : `OpenSans`};
    font-size: 9.5px;
    width: 84px;
  }
`

const StyledTextIsActiveBlueSmall = styled(StyeldTextSmallRegular)<{
  isRowSelected: boolean
}>`
  font-family: var(--kanyon);
  font-weight: 500;
  font-size: 12px;
  width: 92px;
  height: 33px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isRowSelected }) => (isRowSelected ? `#26C649` : `}`)};
  font-weight: ${({ isRowSelected }) => (isRowSelected ? `600` : `}`)};
  font-family: ${({ isRowSelected }) =>
    isRowSelected ? 'var(--kanyon-bold)' : `}`};
  background: ${({ isRowSelected }) => (isRowSelected ? '#DDF5EF' : `#F2F5F9`)};
  border-radius: 6px;

  @media (max-width: 1024px) {
    font-weight: ${({ isRowSelected }) => (isRowSelected ? `400` : `}`)};
    font-family: ${({ isRowSelected }) =>
      isRowSelected ? 'var(--kanyon-bold)' : `}`};
    font-size: 8px;
    width: auto;
    margin-left: 0px;
    width: 52px;
    height: 19px;
  }
`
const StyledTextIsActiveBlue = styled(StyeldTextSmallRegular)<{
  isRowSelected: boolean
  onCarVariant: boolean
}>`
  font-size: 16px;
  font-family: ${({ isRowSelected }) =>
    isRowSelected ? `KanyonBold` : `KanyonMedium`};
  color: ${({ isRowSelected, onCarVariant }) =>
    isRowSelected && !onCarVariant
      ? `#002373`
      : isRowSelected && onCarVariant
      ? `#05256E`
      : `#52627A`};
  font-weight: ${({ isRowSelected }) => (isRowSelected ? `700` : `500`)};

  @media (max-width: 1024px) {
    font-size: 12px;
    width: auto;
  }
`
const FourthColumnWrapper1 = styled.div`
  width: 79%;

  @media (max-width: 1024px) {
    width: 100%;
  }
`

const FourthColumnWrapper2 = styled.div`
  width: 45%;

  @media (max-width: 1024px) {
    margin-right: 0px;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: start;
  }
`

const StyledTextIsActiveBlueInstallment = styled(StyeldTextSmallRegular)<{
  isRowSelected: boolean
}>`
  font-size: 16px;
  font-family: ${({ isRowSelected }) =>
    isRowSelected ? `KanyonBold` : `KanyonMedium`};
  color: ${({ isRowSelected }) => (isRowSelected ? `#05256E` : `#52627A`)};
  font-weight: ${({ isRowSelected }) => (isRowSelected ? `700` : `500`)};

  @media (max-width: 1024px) {
    font-size: 12px;
  }
  @media (max-width: 340px) {
    font-size: 10px;
  }
`
const TextSmallLoanRank = styled(TextSmall)<{
  loanRank: string
  onCarVariantPage: boolean
}>`
  color: ${({ loanRank, onCarVariantPage }) =>
    loanRank == 'Mudah' && !onCarVariantPage
      ? `#2CAA30`
      : loanRank == 'Mudah' && onCarVariantPage
      ? `#26C649`
      : loanRank == 'Sulit' && onCarVariantPage
      ? `#D83130`
      : loanRank == 'Sulit'
      ? `#EC0A23`
      : ''};

  font-family: var(--kanyon-bold);
  font-weight: 700;
  font-size: ${({ onCarVariantPage }) => (onCarVariantPage ? `16px` : `14px`)};
  line-height: 16px;
  @media (max-width: 1024px) {
    font-size: 12px;
  }
`

const StyledButtonNewRegularRateText = styled.span<{
  onCarVariant: boolean
}>`
  font-style: normal;
  font-family: var(--kanyon-bold);
  font-weight: 700;
  font-size: ${({ onCarVariant }) => (onCarVariant ? `16px` : `24px`)};
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0px;

  color: #ffffff;

  @media (max-width: 1024px) {
    font-size: 16px;
    line-height: 16px;
  }
`
const StyledButtonNewRegularRateButton = styled.button<{
  onCarVariant: boolean
}>`
  font-family: var(--kanyon-bold);
  width: ${({ onCarVariant }) => (onCarVariant ? `100%` : `524px`)};
  margin: auto;
  height: ${({ onCarVariant }) => (onCarVariant ? `48px` : `72px`)};
  border-radius: ${({ onCarVariant }) => (onCarVariant ? `8px` : `16px`)};
  background: #05256e;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    height: 56px;
    width: 100%;
    margin-top: ${({ onCarVariant }) => (onCarVariant ? `0px` : `40px`)};
  }
`

const DisclaimerText = styled.p`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0px;
  color: ${colors.label};

  a:link {
    color: ${colors.label};
  }

  a:visited {
    color: ${colors.label};
  }

  a:hover {
    color: ${colors.label};
  }

  a:active {
    color: ${colors.label};
  }

  @media (max-width: 1024px) {
    font-size: 10px;
    line-height: 14px;
  }
`

const WordingWrapper = styled.div<{ onCarVariant: boolean }>`
  display: flex;
  flex-direction: column;
  @media (max-width: 1024px) {
    margin-top: 18px;
  }
  @media (min-width: 1025px) {
    display: ${({ onCarVariant }) => onCarVariant && `none`};
  }
`
const TooltipText = styled.div`
  width: auto;
  text-align: center;
  line-height: 44px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
`
const TooltipBox = styled.div`
  position: absolute;
  top: calc(100% - 38px);
  right: 0;
  display: block;
  color: #246ed4;
  background: #246ed4;
  border-radius: 12px;
  width: 229px;
  padding: 14px;
  border-radius: 12px;
  &:before {
    content: '';
    width: 0;
    height: 0;
    right: 20px;
    left: 201px;
    top: -3px;
    position: absolute;
    background-color: #246ed4;
    border: 10px solid #246ed4;
    transform: rotate(135deg);
  }
  @media (max-width: 1024px) {
    top: calc(100% - 28px);
  }
`
const StyledTextHoverGreen1 = styled.span`
  font-style: normal;
  font-family: var(--open-sans-bold);
  font-style: normal;
  color: white;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
`
const StyledTextHoverWrapper = styled.div`
  margin-top: 10px;
`
const StyledTextHoverGreen2 = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  color: white;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
`
const StyledTextHoverRed = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  color: white;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
`
const TooltipCard = styled.div`
  position: relative;
  & ${TooltipText}:hover + ${TooltipBox} {
    display: block;
    color: #fff;
    background-color: #246ed4;
    width: 230px;
    padding: 8px 8px;
    border-radius: 12px;
    z-index: 99;
    &:before {
      border-color: #246ed4;
    }
    &:after {
      border-color: #246ed4;
    }
  }
`

const StyledInsuranceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 90.5px;
  justify-content: center;
  margin-bottom: 23px;
  @media (max-width: 1440px) {
    margin-top: 40px;
  }
  @media (max-width: 1366px) {
    margin-top: 40px;
  }
  @media (max-width: 1280px) {
    margin-top: 40px;
  }
  @media (max-width: 1024px) {
    margin-top: 0px;
    margin-bottom: 15px;
  }
`
const StyledWrapperTextInsurance = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 32px;
  @media (max-width: 1024px) {
    margin-left: 16px;
  }
`
const StyledTextInsurance = styled.h2`
  font-family: var(--open-sans);
  color: ${colors.label};
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0px;

  @media (max-width: 1024px) {
    font-size: 13px;
    line-height: 16px;
  }
`
const StyledInsuranceImg = styled.img`
  max-width: 84px;
  max-height: 64px;
  width: 84px;
  height: 68px;
  @media (max-width: 1024px) {
    max-width: 52px;
    max-height: 42px;
    width: 52px;
    height: 42px;
  }
`
const StyledTextInterestText = styled.span<{
  isRowSelected: boolean
  onCreditTab: boolean
}>`
  font-family: ${({ isRowSelected }) =>
    isRowSelected ? 'var(--open-sans-bold)' : 'var(--open-sans-semi-bold)'};
  font-style: normal;
  font-weight: ${({ isRowSelected }) => (isRowSelected ? `700` : `600`)};
  font-size: ${({ onCreditTab }) => (onCreditTab ? '12px' : '14px')};
  line-height: 20px;
  letter-spacing: 0px;
  color: ${({ isRowSelected }) => (isRowSelected ? `#252525` : `#52627A`)};

  @media (max-width: 1024px) {
    font-size: 10px;
    line-height: 14px;
    width: 32px;
  }
`
const StyledWhatsAppButtonText = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  font-family: KanyonBold;
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
`

const StyledButtonWhatsApp = styled.button`
  width: 100%;
  height: 50px;
  background: rgb(0, 35, 115);
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`
