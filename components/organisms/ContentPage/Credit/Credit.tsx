import { InfoCircleOutlined } from 'components/atoms'
import { useContextCalculator } from 'services/context/calculatorContext'
import { SpecialRateResults } from './SpecialRateResults/SpesialRateResults'
import React, { useState, useEffect, useRef, memo, useContext } from 'react'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { CashAmountInputCarVariantPage } from './CashAmountInputCarVariantPage'
import { FullEditAgeCarVariant } from './FullEditAgeCarVariant'
import { CarBrandRecommendationCreditTab } from './Section/CarBrandRecommendationCreditTab'
import { SliderDpAmountCreditTab } from './SliderDpAmountCreditTab'
import { useTranslation } from 'react-i18next'
import {
  trackWebPDPCreditTab,
  WebVariantListPageParam,
} from 'helpers/amplitude/seva20Tracking'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { setTrackEventMoEngage } from 'helpers/moengage'
import elementId from 'helpers/elementIds'
import {
  CarRecommendation,
  CarVariantRecommendation,
  CityOtrOption,
} from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { Description } from 'components/organisms/OldPdpSectionComponents/Description/Description'
import { SpecificationSelect } from 'components/organisms/OldPdpSectionComponents/SpecificationSelect/SpecificationSelect'
import { SurveyFormKey } from 'utils/types/models'
import { Input } from 'components/atoms/OldInput/Input'
import { IconWarning } from 'components/atoms'
import { useLoginAlertModal } from 'components/molecules/LoginAlertModal/LoginAlertModal'
import { useRouter } from 'next/router'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import Image from 'next/image'
import { useCar } from 'services/context/carContext'
import { useContextForm } from 'services/context/formContext'
import { formatSortPrice } from 'utils/numberUtils/numberUtils'

const EmptyCalculationImage = '/revamp/illustration/EmptyCalculationImage.webp'
const AccLogo = '/revamp/icon/logo-acc.webp'
const TafLogo = '/revamp/icon/OldTafLogo.webp'

type tabProps = {
  tab: string | undefined
  isShowLoading?: boolean
}

const Credit = memo(({ tab, isShowLoading }: tabProps) => {
  const router = useRouter()
  const [initialValue, setInitialValue] = useState<
    CarVariantRecommendation | undefined
  >()
  const { carModelDetails, carVariantDetails, recommendation } = useCar()
  const {
    carModelDetailsResDefaultCity,
    carVariantDetailsResDefaultCity,
    carRecommendationsResDefaultCity,
  } = useContext(PdpDataLocalContext)
  const modelDetailData = carModelDetails || carModelDetailsResDefaultCity
  const variantDetailData = carVariantDetails || carVariantDetailsResDefaultCity
  const recommendationsDetailData =
    recommendation.length !== 0
      ? recommendation
      : carRecommendationsResDefaultCity.carRecommendations
  const [selected, setSelected] = useState<CarVariantRecommendation | null>(
    null,
  )
  const { formSurveyValue: surveyFormData } = useContextForm()
  const originInput = surveyFormData?.totalIncome?.value?.toString() || ''
  const originAge = surveyFormData?.age?.value?.toString() || ''
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [errorPromo, setErrorPromo] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [invalidCodeMessage, setInvalidCodeMessage] = useState('')

  const { specialRateResults } = useContextCalculator()

  const { showModal: showLoginModal, LoginAlertModal } = useLoginAlertModal()

  const [isCalculated, setIsCalculated] = useState(false)

  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [isSubmit, setIsSubmit] = useState(false)
  const [dpAmount, setDpAmount] = useState(0)

  const [, setPromoCodeSessionStorage] =
    useSessionStorageWithEncryption<string>(
      SessionStorageKey.PromoCodeGiiass,
      '',
    )
  const { t } = useTranslation()
  const onRecommendationsResults = (data: CarRecommendation[]) => {
    if (!data) {
      return
    }
    // setNewFunnelRecommendations(
    //   data
    //     .filter((item) => item.loanRank === NewFunnelLoanRank.Green)
    //     .sort((a, b) => a.lowestAssetPrice - b.lowestAssetPrice),
    // )

    // setRecommendations(data)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      // scroll after shimmer disappear
      if (!isShowLoading) scrollToSectionContent()
    }, 10)

    return () => clearTimeout(timeout)
  }, [tab, isShowLoading])

  useEffect(() => {
    if (router.query?.variant) {
      const filterOption = modelDetailData?.variants.filter(
        (item: any) => item.id === router.query?.variant,
      )
      if (filterOption) {
        setInitialValue(filterOption[0])
      }
    }
  }, [router.query?.variant])

  useEffect(() => {
    if (isSubmit && originInput.length === 0) {
      scrollToSectionIncome()
    } else if (isSubmit && originInput.length !== 0 && originAge.length === 0) {
      scrollToSectionAge()
    } else if (
      isSubmit &&
      originInput.length !== 0 &&
      originAge.length !== 0 &&
      dpAmount === 0
    ) {
      scrollToSectionSlider()
    }
    if (isCalculated) {
      scrollOnCalculate()
    }
  }, [originInput, originAge, isSubmit, dpAmount])

  const renderErrorPromo = () => {
    if (errorPromo) return () => <InfoCircleOutlined width={24} height={24} />
    return () => <></>
  }
  const renderErrorPromoMessage = () => {
    if (errorPromo)
      return () => (
        <ErrorWrapper className={'shake-animation-X'}>
          <WarningWrapper>
            <IconWarning color={'#FFFFFF'} width={16} height={16} />
          </WarningWrapper>
          <StyledErrorText>{invalidCodeMessage}</StyledErrorText>
        </ErrorWrapper>
      )
    return () => <></>
  }

  const scrollToContent = useRef<null | HTMLDivElement>(null)
  const scrollToSectionContent = () => {
    scrollToContent.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }
  const scrollToIncome = useRef<null | HTMLDivElement>(null)
  const scrollToSectionIncome = () => {
    scrollToIncome.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToAge = useRef<null | HTMLDivElement>(null)
  const scrollToSectionAge = () => {
    scrollToAge.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToSlider = useRef<null | HTMLDivElement>(null)
  const scrollToSectionSlider = () => {
    scrollToSlider.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToTop = useRef<null | HTMLDivElement>(null)
  const scrollOnCalculate = () => {
    scrollToTop.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const redAsterisk = () => {
    return <span style={{ color: 'red' }}>*</span>
  }
  const renderDisclaimerInfo = () => {
    return (
      <>
        <DisclaimerTextInfo>
          {redAsterisk()} Total Pembayaran Pertama = DP + Administrasi + Cicilan
          Pertama + Polis + TJH
        </DisclaimerTextInfo>
        <DisclaimerTextInfo>
          {redAsterisk()} Cicilan Per Bulan: Sudah termasuk cicilan dan premi
          asuransi mobil
        </DisclaimerTextInfo>
        <DisclaimerTextInfo>
          {redAsterisk()} Hasil perhitungan masih bersifat estimasi. Perhitungan
          final akan diberikan oleh partner SEVA
        </DisclaimerTextInfo>
      </>
    )
  }
  const trackEventMoengage = (carImages: string[]) => {
    const objData = {
      brand: modelDetailData?.brand,
      model: modelDetailData?.model,
      price:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].priceValue
          : '-',
      variants: variantDetailData?.variantDetail.name,
      monthly_installment:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].monthlyInstallment
          : '-',
      down_payment:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].dpAmount
          : '-',
      loan_tenure:
        modelDetailData?.variants && modelDetailData.variants.length > 0
          ? modelDetailData.variants[0].tenure
          : '-',
      est_monthly_income: originInput.length !== 0 ? originInput : '',
      age: originAge.length !== 0 ? originAge : '',
      car_seat: variantDetailData?.variantDetail.carSeats,
      fuel: variantDetailData?.variantDetail.fuelType,
      transmition: variantDetailData?.variantDetail.transmission,
      dimension:
        recommendationsDetailData?.filter(
          (car: any) => car.id === variantDetailData?.modelDetail.id,
        ).length > 0
          ? recommendationsDetailData?.filter(
              (car: any) => car.id === variantDetailData?.modelDetail.id,
            )[0].height
          : '',
      body_type: variantDetailData?.variantDetail.bodyType
        ? variantDetailData?.variantDetail.bodyType
        : '-',
      Image_URL: carImages[0],
      Brand_Model: `${modelDetailData?.brand} ${modelDetailData?.model}`,
    }
    setTrackEventMoEngage('view_variant_list_credit_tab', objData)
  }

  useEffect(() => {
    if (modelDetailData && cityOtr) {
      const trackNewCarVariantList: WebVariantListPageParam = {
        Car_Brand: modelDetailData.brand as string,
        Car_Model: modelDetailData.model as string,
        OTR: `Rp${replacePriceSeparatorByLocalization(
          modelDetailData.variants[0].priceValue as number,
          LanguageCode.id,
        )}`,
        DP: `Rp${formatSortPrice(
          modelDetailData.variants[0].dpAmount as number,
        )} Juta`,
        Tenure: '5 Tahun',
        City: cityOtr.cityName || 'Jakarta Pusat',
      }

      trackWebPDPCreditTab(trackNewCarVariantList)
      trackEventMoengage(modelDetailData?.images)
    }
  }, [modelDetailData, cityOtr])

  return isMobile ? (
    <div>
      <div ref={scrollToTop}></div>
      {isMobile && !isCalculated && (
        <ContentDescription>
          <Description
            title={`Kredit ${modelDetailData.brand} ${
              modelDetailData.model
            } di ${
              cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'
            }`}
            description={variantDetailData.variantDetail.description.id}
            carModel={modelDetailData}
            carVariant={variantDetailData}
            tab="credit"
          />
        </ContentDescription>
      )}
      <div ref={scrollToContent} style={{ scrollMargin: '95px' }} />
      <Content isCalculated={isCalculated}>
        {isMobile && !isCalculated ? (
          <>
            <div ref={scrollToIncome}></div>
            <ContainerField>
              <TextInfoField>Pilih varian</TextInfoField>
              <Space />
              <SpecificationSelect
                initialValue={initialValue}
                options={modelDetailData.variants}
                onChooseOption={(item) => setSelected(item)}
                // setInitialValue={setInitialValue}
              />
            </ContainerField>
            <ContainerField>
              <div ref={scrollToAge}></div>
              <TextInfoField>Berapa pendapatan per bulan kamu?</TextInfoField>
              <SpaceFieldIncome />
              <CashAmountInputCarVariantPage
                name={elementId.InstantApproval.MonthlyIncome}
                value={originInput}
                page={SurveyFormKey.TotalIncome}
                page2={SurveyFormKey.TotalIncomeTmp}
                className={'full-edit-monthly-income-element'}
                isNewRegularPage={true}
                isSubmitted={isSubmit}
              />
              <FullEditAgeCarVariant
                isSubmitted={isSubmit}
                isNewRegularPage={true}
              />
            </ContainerField>
          </>
        ) : (
          <></>
        )}

        <div ref={scrollToSlider}></div>
        <ContainerField>
          {variantDetailData && (
            <SliderDpAmountCreditTab
              carVariantDetails={variantDetailData}
              onRecommendationsResults={onRecommendationsResults}
              onCalculate={setIsCalculated}
              onSubmitted={setIsSubmit}
              promoCode={promoCode}
              errorPromo={errorPromo}
              setErrorPromo={setErrorPromo}
              setInvalidCodeMessage={setInvalidCodeMessage}
              setDpAmout={setDpAmount}
              isSubmit={isSubmit}
            />
          )}
          {isMobile && !isCalculated && (
            <>
              <Divider />
              <StyledPromoCode>
                <PromoInput>
                  <StyledInputPromo
                    type="text"
                    isError={errorPromo}
                    value={promoCode}
                    suffixIcon={renderErrorPromo()}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setErrorPromo(false)
                      }
                      const promo = e.target.value.toUpperCase()
                      setPromoCode(
                        promo.replace(' ', '').replace(/[^\w\s]/gi, ''),
                      )
                      setPromoCodeSessionStorage(
                        promo.replace(' ', '').replace(/[^\w\s]/gi, ''),
                      )
                    }}
                    placeholder="Punya kode promo? Masukkan di sini"
                    bottomComponent={renderErrorPromoMessage()}
                    style={{ borderRadius: '8px' }}
                  />
                </PromoInput>
              </StyledPromoCode>
            </>
          )}
          {/* {specialRateResults && specialRateResults.length !== 0 && (
            <>
              <SpecialRateWrapper>
                <SpecialRateResults
                  data={specialRateResults}
                  variantDetailData={variantDetailData}
                  isNewRegularPage={true}
                  onCheckLogin={showLoginModal}
                  carVariantPage={true}
                />
              </SpecialRateWrapper>
            </>
          )} */}
          <ContainerDisclaimer>
            <TextDisclaimer>
              Perhitungan kredit ini disediakan oleh ACC dan TAF.
            </TextDisclaimer>
            <ContainerDisclaimerLogo>
              <img src={AccLogo} width={24} height={31} alt="acc logo" />
              <SpaceLogo />
              <img src={TafLogo} width={44} height={25} alt="taf logo" />
            </ContainerDisclaimerLogo>
          </ContainerDisclaimer>
        </ContainerField>
      </Content>
      <ContentCarBranchRecomendation>
        <CarBrandRecommendationCreditTab
          onClickNewModel={setIsCalculated}
          onReset={setIsSubmit}
          onHomepage={false}
        />
      </ContentCarBranchRecomendation>
      <LoginAlertModal />
    </div>
  ) : (
    <ContainerDesktop
      emptyResult={
        specialRateResults === undefined || specialRateResults.length === 0
      }
    >
      <div ref={scrollToTop}></div>
      <ContentDescription>
        <Description
          title={`Kredit ${modelDetailData.brand} ${modelDetailData.model} di ${
            cityOtr && cityOtr.cityName ? cityOtr.cityName : 'Jakarta Pusat'
          }`}
          description={variantDetailData.variantDetail.description.id}
          carModel={modelDetailData}
          carVariant={variantDetailData}
          tab="credit"
        />
      </ContentDescription>
      <div ref={scrollToContent} style={{ scrollMargin: '30px' }} />
      <Content isCalculated={isCalculated}>
        <DesktopWrapper>
          <CalculationSection>
            {specialRateResults && specialRateResults.length !== 0 ? (
              <StyledTitleSection>Informasi Kamu</StyledTitleSection>
            ) : (
              <StyledTitleSection>Hitung Cicilan</StyledTitleSection>
            )}

            <div ref={scrollToIncome} />
            <ContainerFieldVariantOption>
              <Space />
              <SpecificationSelect
                initialValue={initialValue}
                options={modelDetailData.variants}
                onChooseOption={(item) => setSelected(item)}
              />
            </ContainerFieldVariantOption>
            <ContainerFieldIncomeAge>
              <div ref={scrollToAge} />
              <TextInfoField>Berapa pendapatan per bulan kamu?</TextInfoField>
              <SpaceFieldIncome />
              <CashAmountInputCarVariantPage
                name={elementId.InstantApproval.MonthlyIncome}
                value={originInput}
                page={SurveyFormKey.TotalIncome}
                page2={SurveyFormKey.TotalIncomeTmp}
                className={'full-edit-monthly-income-element'}
                isNewRegularPage={false}
                isTabCreditDesktop={true}
                isSubmitted={isSubmit}
              />
              <FullEditAgeCarVariant
                isSubmitted={isSubmit}
                isNewRegularPage={false}
                isTabCreditDesktop={true}
              />
            </ContainerFieldIncomeAge>

            <div ref={scrollToSlider}></div>
            <ContainerField>
              {variantDetailData && (
                <SliderDpAmountCreditTab
                  carVariantDetails={variantDetailData}
                  onRecommendationsResults={onRecommendationsResults}
                  onCalculate={setIsCalculated}
                  onSubmitted={setIsSubmit}
                  promoCode={promoCode}
                  setErrorPromo={setErrorPromo}
                  errorPromo={errorPromo}
                  setPromoCode={setPromoCode}
                  setInvalidCodeMessage={setInvalidCodeMessage}
                  setDpAmout={setDpAmount}
                  isSubmit={isSubmit}
                />
              )}
              <>
                <StyledPromoCode>
                  <PromoInput>
                    <StyledInputPromo
                      type="text"
                      isError={errorPromo}
                      value={promoCode}
                      suffixIcon={renderErrorPromo()}
                      onChange={(e) => {
                        if (!e.target.value) {
                          setErrorPromo(false)
                        }
                        const promo = e.target.value.toUpperCase()
                        setPromoCode(
                          promo.replace(' ', '').replace(/[^\w\s]/gi, ''),
                        )
                        setPromoCodeSessionStorage(
                          promo.replace(' ', '').replace(/[^\w\s]/gi, ''),
                        )
                      }}
                      placeholder="Punya kode promo? Masukkan di sini"
                      bottomComponent={renderErrorPromoMessage()}
                      style={{ borderRadius: '8px' }}
                    />
                  </PromoInput>
                </StyledPromoCode>
              </>
            </ContainerField>
          </CalculationSection>
          <ResulstCalculationSection>
            {specialRateResults && specialRateResults.length !== 0 ? (
              <>
                <StyledTitleSection>Pilih Paket Cicilanmu</StyledTitleSection>
                <ContainerField>
                  {/* <DividerSpecialRateSection /> */}
                  <SpecialRateWrapper>
                    <SpecialRateResults
                      data={specialRateResults}
                      carVariantDetails={variantDetailData}
                      isNewRegularPage={true}
                      onCheckLogin={showLoginModal}
                      carVariantPage={true}
                    />
                  </SpecialRateWrapper>
                  {renderDisclaimerInfo()}
                  <ContainerDisclaimer>
                    <TextDisclaimer>
                      Perhitungan kredit ini disediakan oleh ACC dan TAF.
                    </TextDisclaimer>
                    <ContainerDisclaimerLogo>
                      <img
                        src={AccLogo}
                        width={24}
                        height={31}
                        alt="acc logo"
                      />
                      <SpaceLogo />
                      <img
                        src={TafLogo}
                        width={44}
                        height={25}
                        alt="taf logo"
                      />
                    </ContainerDisclaimerLogo>
                  </ContainerDisclaimer>
                </ContainerField>
              </>
            ) : (
              <ImageWrapper>
                <Image
                  src={EmptyCalculationImage}
                  width={320}
                  height={264}
                  alt="empty-calculation-illustration"
                />
                <StyledTextEmptyCalculation>
                  Lengkapi informasi di sebelah untuk mendapatkan hitungan
                  kredit yang sesuai dan rekomendasi finansial dari SEVA.
                </StyledTextEmptyCalculation>
              </ImageWrapper>
            )}
          </ResulstCalculationSection>
        </DesktopWrapper>
      </Content>
      {specialRateResults && specialRateResults.length !== 0 && (
        <ContentCarBranchRecomendation>
          <CarBrandRecommendationCreditTab
            onClickNewModel={setIsCalculated}
            onReset={setIsSubmit}
            onHomepage={false}
          />
        </ContentCarBranchRecomendation>
      )}
      <LoginAlertModal />
    </ContainerDesktop>
  )
})

export default Credit

const ContentDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 22px 15px;

  @media (min-width: 1025px) {
    padding: 48px 0px 0px 8px;
  }
`

const Content = styled.div<{ isCalculated: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 22px 15px;
  background: ${({ isCalculated }) =>
    isCalculated ? colors.white : '#eef6fb'};

  @media (min-width: 1025px) {
    max-width: 1040px;
    background: ${colors.white};
    width: 100%;
    padding: 0px 0px 0px 4px;
    margin: 50px auto 0;
  }
`

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const CalculationSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 49.3%;
  border-right: 1px solid #e4e9f1;
  padding-right: 37px;
  margin-right: 51px;
`

const ResulstCalculationSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`

const TextInfoField = styled.h2`
  letter-spacing: 0px;
  font-family: var(--kanyon-medium);
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #52627a;
  @media (min-width: 1025px) {
    font-size: 16px;
  }
`
const Space = styled.div`
  margin-bottom: 8px;
`

const SpaceFieldIncome = styled.div`
  margin-bottom: 12px;
`
const ContainerField = styled.div`
  margin-bottom: 21px;
`

const ContainerFieldIncomeAge = styled.div`
  margin-bottom: 20px;
`

const ContainerFieldVariantOption = styled.div`
  margin-bottom: 24px;
`

const SpecialRateWrapper = styled.div`
  padding: 6px 0px 20px;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  background: ${colors.white};
  @media (max-width: 1024px) {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px 12px 20px;
  }
  @media (max-width: 480px) {
    padding: 0px 0px 0px;
  }
`

const ContentCarBranchRecomendation = styled.div`
  margin-top: 21px;
  margin-bottom: 64px;
`
const Divider = styled.div`
  border: 1px solid ${colors.line};
  margin-top: 18px;
  margin-bottom: 15px;
`

const StyledPromoCode = styled.div`
  @media (min-width: 480px) {
    display: none;
  }
`

const PromoInput = styled.div`
  width: 100%;
`
export const StyledErrorText = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;
  color: ${colors.error};
  margin-top: 4px;
`

export const StyledInputPromo = styled(Input)<{
  value: string
  isError: boolean
}>`
  color: ${colors.primaryDarkBlue};
  border-color: ${({ isError }) => (isError ? colors.error : colors.line)};
  border-radius: 8px;
  input {
    font-family: var(--open-sans);
    color: ${colors.primaryDarkBlue};
    font-size: 16px;
  }
  :focus-within {
    border-color: ${({ isError }) =>
      isError ? colors.error : colors.primary1};
    color: #05256e;
  }
  ::-webkit-input-placeholder {
    font-size: 16px;
  }
  width: 100%;
  font-size: 16px;
  font-family: var(--kanyon);
  font-weight: 400;
  height: 48px;
  @media (max-width: 1920px) {
    width: 100%;
  }
  @media (max-width: 1440px) {
    width: 100%;
  }
  @media (max-width: 1366px) {
    width: 100%;
  }
  @media (max-width: 1024px) {
    font-size: 16px;
    height: 56px;
    &::placeholder {
      font-size: 16px;
    }
  }
`

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 8px;
`
const ContainerDisclaimer = styled.div`
  display: flex;
  margin-top: 33px;
  @media (min-width: 1025px) {
    margin-top: 18px;
  }
`

const ContainerDisclaimerLogo = styled.div`
  display: flex;
  margin-left: 16px;
`
const TextDisclaimer = styled.p`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: #52627a;
  width: 50%;
  @media (min-width: 1025px) {
    font-size: 12px;
    line-height: 24px;
    color: #9ea3ac;
    width: 100%;
  }
`
const SpaceLogo = styled.div`
  width: 16px;
`
const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 45%;
`
const StyledTextEmptyCalculation = styled.p`
  font-family: var(--open-sans);
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #52627a;
  width: 70%;
  margin-top: 56px;
`
const StyledTitleSection = styled.p`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #252525;
  margin-bottom: 20px;
`

const DisclaimerTextInfo = styled.p`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  letter-spacing: 0px;
  color: ${colors.placeholder};

  @media (max-width: 1024px) {
    font-size: 10px;
    line-height: 14px;
  }
`
const ContainerDesktop = styled.div<{ emptyResult: boolean }>`
  background: #ffffff;
  margin-bottom: ${({ emptyResult }) => (emptyResult ? '0px' : '50px')};
`

const WarningWrapper = styled.div`
  margintop: 6px;
  width: 16px;
  height: 16px;
  borderradius: 50%;
  background: #ec0a23;
  display: flex;
  align-items: center;
  justify-content: center;
`
