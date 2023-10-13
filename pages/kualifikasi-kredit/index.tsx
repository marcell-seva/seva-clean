import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/kualifikasi-kredit.module.scss'
import { Modal, Progress } from 'antd'
import {
  IconChevronDown,
  InputSelect,
  Button,
  IconChevronRight,
  IconInfo,
} from '../../components/atoms'
import { ButtonSize, ButtonVersion } from '../../components/atoms/button'
import Fuse from 'fuse.js'
import axios from 'axios'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import SpouseIncomeForm from '../../components/molecules/credit/spouseIncome'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { CityOtrOption, NewFunnelCarVariantDetails, Option } from 'utils/types'
import { occupations } from 'utils/occupations'
import { TrackerFlag } from 'utils/types/models'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { FormControlValue, SimpleCarVariantDetail } from 'utils/types/utils'
import { getToken } from 'utils/handler/auth'
import { isIsoDateFormat } from 'utils/handler/regex'
import {
  CreditQualificationFlowParam,
  trackKualifikasiKreditCarDetailClick,
  trackKualifikasiKreditCarDetailClose,
  trackKualifikasiKreditFormPageCTAClick,
  trackKualifikasiKreditFormPageView,
} from 'helpers/amplitude/seva20Tracking'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import {
  creditQualificationReviewUrl,
  loanCalculatorDefaultUrl,
} from 'utils/helpers/routes'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import HeaderCreditClasificationMobile from 'components/organisms/headerCreditClasificationMobile'
import { FormReferralCode } from 'components/molecules/form/formReferralCode'
import PopupCreditDetail from 'components/organisms/popupCreditDetail'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import Image from 'next/image'
import { checkReferralCode, getCustomerInfoSeva } from 'utils/handler/customer'
import { temanSevaUrlPath } from 'utils/types/props'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'

const searchOption = {
  keys: ['label'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.3,
}

const CreditQualificationPage = () => {
  useProtectPage()
  const router = useRouter()
  const optionADDM = getLocalStorage(LocalStorageKey.SelectedAngsuranType)
  const [isIncomeTooLow, setIsIncomeTooLow] = useState(false)
  const { financialQuery } = useFinancialQueryData()
  const [joinIncomeValueFormatted, setJoinIncomeValueFormatted] = useState(
    financialQuery.monthlyIncome || '0',
  )
  const [joinIncomeValue, setJoinIncomeValue] = useState(
    Number(financialQuery.monthlyIncome) || 0,
  )
  const [dataCar, setDataCar] = useState<NewFunnelCarVariantDetails>()
  const [inputValue, setInputValue] = useState('')
  const [email, setEmail] = useState('')
  const [lastChoosenValue, setLastChoosenValue] = useState('')
  const [modelOccupationListOptionsFull] = useState<Option<string>[]>(
    occupations.options,
  )
  const [suggestionsLists, setSuggestionsLists] = useState<Option<string>[]>([])
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const [customerYearBorn, setCustomerYearBorn] = useState('')

  const onChangeInputHandler = (value: string) => {
    if (value === '') {
      setLastChoosenValue('')
    }

    setInputValue(
      value
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    )
  }

  const [promoCode] = useSessionStorageWithEncryption<string>(
    SessionStorageKey.PromoCodeGiiass,
    '',
  )
  const [openModal, setOpenModal] = useState(false)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const referralCodeFromUrl: string =
    getLocalStorage(LocalStorageKey.referralTemanSeva) ?? ''
  const [connectedCode, setConnectedCode] = useState('')
  const [referralCodeInput, setReferralCodeInput] = useState('')
  const [currentUserOwnCode, setCurrentUserOwnCode] = useState('') // code that can be seen in teman seva dashboard
  const [isLoadingReferralCode, setIsLoadingReferralCode] = useState(false)
  const [isErrorReferralCodeInvalid, setIsErrorReferralCodeInvalid] =
    useState(false)
  const [isErrorRefCodeUsingOwnCode, setIsErrorRefCodeUsingOwnCode] =
    useState(false)
  const [isSuccessReferralCode, setisSuccessReferralCode] = useState(false)

  const onInputJoinIncome = () => {
    if (joinIncomeValueFormatted === '') {
      setJoinIncomeValueFormatted('0')
      setJoinIncomeValue(0)
    }
    if (joinIncomeValue < 3000000) {
      setIsIncomeTooLow(true)
    } else {
      setIsIncomeTooLow(false)
    }
  }
  const handleInputRefferal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsErrorReferralCodeInvalid(false)
    setIsErrorRefCodeUsingOwnCode(false)
    setIsLoadingReferralCode(false)
    setisSuccessReferralCode(false)
    const input = e.target.value
      .toUpperCase()
      .replace(' ', '')
      .replace(/[^\w\s]/gi, '')

    setReferralCodeInput(input)
  }

  const resetReferralCodeStatus = (): void => {
    setIsLoadingReferralCode(false)
    setIsErrorReferralCodeInvalid(false)
    setIsErrorRefCodeUsingOwnCode(false)
    setisSuccessReferralCode(false)
    setReferralCodeInput('')
  }

  const checkRefCode = async (value: string): Promise<boolean> => {
    if (value !== '') {
      if (value === currentUserOwnCode) {
        setIsErrorReferralCodeInvalid(false)
        setIsErrorRefCodeUsingOwnCode(true)
        localStorage.setItem(LocalStorageKey.ReferralCodePrelimQuestion, '')
        return false
      } else {
        setIsLoadingReferralCode(true)
        try {
          await checkReferralCode(value, getToken()?.phoneNumber ?? '')
          setIsLoadingReferralCode(false)
          setIsErrorReferralCodeInvalid(false)
          setIsErrorRefCodeUsingOwnCode(false)
          setisSuccessReferralCode(true)
          localStorage.setItem(
            LocalStorageKey.ReferralCodePrelimQuestion,
            value,
          )
          return true
        } catch (error) {
          setIsLoadingReferralCode(false)
          setIsErrorReferralCodeInvalid(true)
          setIsErrorRefCodeUsingOwnCode(false)
          setisSuccessReferralCode(false)
          localStorage.setItem(LocalStorageKey.ReferralCodePrelimQuestion, '')
          return false
        }
      }
    } else {
      localStorage.setItem(LocalStorageKey.ReferralCodePrelimQuestion, '')
      return true
    }
  }

  const getCurrentUserOwnCode = () => {
    // setLoadShimmer1(true)
    axios
      .get(temanSevaUrlPath.profile, {
        headers: { phoneNumber: getToken()?.phoneNumber ?? '' },
      })
      .then((res) => {
        // setLoadShimmer1(false)
        setCurrentUserOwnCode(res.data.temanSevaRefCode)
      })
      .catch(() => {
        // setLoadShimmer1(false)
        // showToast()
      })
  }

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva()
      .then((response) => {
        // setLoadShimmer2(false)
        if (!!response[0].dob && isIsoDateFormat(response[0].dob)) {
          setCustomerYearBorn(response[0].dob.slice(0, 4))
        }

        if (response[0].temanSevaTrxCode && referralCodeInput === '') {
          setReferralCodeInput(response[0].temanSevaTrxCode)
          setEmail(response[0].email)
          localStorage.setItem(
            LocalStorageKey.ReferralCodePrelimQuestion,
            response[0].temanSevaTrxCode,
          )
        }

        if (response[0].temanSevaTrxCode) {
          setConnectedCode(response[0].temanSevaTrxCode ?? '')
        } else {
          setConnectedCode('')
        }
      })
      .catch((err) => {
        console.error(err)
        // setLoadShimmer2(false)
        // showToast()
      })
  }

  const getErrorMesssageRefCode = () => {
    if (isErrorReferralCodeInvalid) {
      return 'Kode Teman SEVA ini tidak tersedia. Gunakan kode lainnya.'
    } else if (isErrorRefCodeUsingOwnCode) {
      return 'Kamu tidak bisa menggunakan kode referral milikmu sendiri.'
    } else {
      return 'Kode referral tidak ditemukan'
    }
  }

  const autofillRefCodeValue = () => {
    // priority : code from URL > code from register page
    if (referralCodeFromUrl && referralCodeFromUrl.length > 0) {
      setReferralCodeInput(referralCodeFromUrl)
      checkRefCode(referralCodeFromUrl)
    } else if (connectedCode.length > 0) {
      setReferralCodeInput(connectedCode)
      checkRefCode(connectedCode)
    } else {
      setReferralCodeInput('')
    }
  }
  const onChooseHandler = (item: Option<FormControlValue>) => {
    setLastChoosenValue(String(item.value))
    setInputValue(String(item.label))
    console.log(lastChoosenValue, inputValue)
  }

  const getDataForTracker = (): CreditQualificationFlowParam => {
    return {
      Car_Brand: dataCar?.modelDetail?.brand ?? '',
      Car_Model: dataCar?.modelDetail?.model ?? '',
      Car_Variant: dataCar?.variantDetail?.name ?? '',
      DP: `Rp${formatNumberByLocalization(
        simpleCarVariantDetails?.loanDownPayment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} Juta`,
      Monthly_Installment: `Rp${formatNumberByLocalization(
        simpleCarVariantDetails?.loanMonthlyInstallment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} jt/bln`,
      Tenure: `${simpleCarVariantDetails?.loanTenure ?? 0} Tahun`,
      Income: `Rp${formatNumberByLocalization(
        Number(financialQuery.monthlyIncome),
        LanguageCode.id,
        1000000,
        10,
      )} Juta`,
      Promo: !!promoCode ? promoCode : null,
      Year_Born: customerYearBorn,
      City: cityOtr?.cityName || 'Jakarta Pusat',
    }
  }

  const trackAmplitudeAndMoengagePageView = () => {
    trackKualifikasiKreditFormPageView(getDataForTracker())
    setTrackEventMoEngage(
      MoengageEventName.view_kualifikasi_kredit_form_page,
      getDataForTracker(),
    )
  }

  const getCreditCualficationDataTracker = () => ({
    ...getDataForTracker(),
    Income: undefined,
    Total_Income: `Rp${formatNumberByLocalization(
      Number(financialQuery.monthlyIncome) + Number(joinIncomeValue || 0),
      LanguageCode.id,
      1000000,
      10,
    )} Juta`,
    Teman_SEVA_Ref_Code: referralCodeInput,
    Occupation: lastChoosenValue,
    Page_Origination: window.location.href,
  })

  const onClickCtaNext = async () => {
    trackKualifikasiKreditFormPageCTAClick(getCreditCualficationDataTracker())

    const refCodeValidity = await checkRefCode(referralCodeInput)

    if (refCodeValidity) {
      const qualificationData = {
        modelId: simpleCarVariantDetails?.modelId,
        variantId: simpleCarVariantDetails?.variantId,
        loanTenure: simpleCarVariantDetails?.loanTenure,
        loanDownPayment: simpleCarVariantDetails.loanDownPayment,
        loanMonthlyInstallment: simpleCarVariantDetails.loanMonthlyInstallment,
        loanRank: simpleCarVariantDetails.loanRank,
        totalFirstPayment: simpleCarVariantDetails.totalFirstPayment,
        flatRate: simpleCarVariantDetails.flatRate,
        monthlyIncome: joinIncomeValue,
        address: {
          province: '',
          city: '',
          zipCode: '',
        },
        email: email || null,
        citySelector: cityOtr ? cityOtr?.cityName : 'Jakarta Pusat',
        spouseIncome: joinIncomeValue,
        promoCode: promoCode || '',
        temanSevaTrxCode: referralCodeInput || '',
        angsuranType: optionADDM,
        rateType: getLocalStorage(LocalStorageKey.SelectedRateType),
        platform: 'web',
        occupations: lastChoosenValue,
      }
      localStorage.setItem(
        'qualification_credit',
        JSON.stringify(qualificationData),
      )
      router.push(creditQualificationReviewUrl)
      // saveLocalStorage(QualificationCredit, 'REGULAR')
      // only proceed if currently inputted ref code is valid
    }
  }

  const handleOpenModal = () => {
    trackKualifikasiKreditCarDetailClick(getCreditCualficationDataTracker())
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    trackKualifikasiKreditCarDetailClose(getCreditCualficationDataTracker())
    setOpenModal(false)
  }

  useEffect(() => {
    setJoinIncomeValue(Number(financialQuery.monthlyIncome))
  }, [financialQuery.monthlyIncome])

  useEffect(() => {
    if (!!getToken()) {
      if (!simpleCarVariantDetails || !simpleCarVariantDetails.variantId) {
        router.push(loanCalculatorDefaultUrl)
        return
      }
      getCarVariantDetailsById(simpleCarVariantDetails.variantId)
        .then((response) => {
          if (response) {
            setDataCar(response)
          } else {
            router.push(loanCalculatorDefaultUrl)
            return
          }
        })
        .catch(() => {
          router.push(loanCalculatorDefaultUrl)
          return
        })
      getCurrentUserInfo()
      getCurrentUserOwnCode()
    }
  }, [])

  useEffect(() => {
    // autofill using useEffect hook because connectedCode value is from API
    autofillRefCodeValue()
  }, [connectedCode])

  useEffect(() => {
    if (inputValue === '') {
      setSuggestionsLists(modelOccupationListOptionsFull)
      return
    }

    const fuse = new Fuse(modelOccupationListOptionsFull, searchOption)
    const suggestion = fuse.search(inputValue)
    const result = suggestion.map((obj) => obj.item)

    // sort alphabetically
    // result.sort((a: any, b: any) => a.label.localeCompare(b.label))

    // sort based on input
    const sorted = result.sort((a: any, b: any) => {
      if (a.label.startsWith(inputValue) && b.label.startsWith(inputValue))
        return a.label.localeCompare(b.label)
      else if (a.label.startsWith(inputValue)) return -1
      else if (b.label.startsWith(inputValue)) return 1

      return a.label.localeCompare(b.label)
    })

    setSuggestionsLists(sorted)
  }, [inputValue, modelOccupationListOptionsFull])

  useEffect(() => {
    if (
      !!dataCar &&
      !!simpleCarVariantDetails &&
      !!customerYearBorn &&
      flag === TrackerFlag.Init
    ) {
      trackAmplitudeAndMoengagePageView()
      setFlag(TrackerFlag.Sent)
    }
  }, [dataCar, customerYearBorn])

  const handleChange = (name: string, value: any) => {
    if (name === 'monthlyIncome') {
      while (value.charAt(0) === '0' && value.length > 1) {
        value = value.substring(1)
      }
      const formatted = replacePriceSeparatorByLocalization(
        filterNonDigitCharacters(value.toString()),
        LanguageCode.id,
      )
      setJoinIncomeValueFormatted(formatted)
      setJoinIncomeValue(Number(filterNonDigitCharacters(value)))
    }
  }

  const renderIncomeErrorMessage = () => {
    if (isIncomeTooLow) {
      return (
        <div className={`${styles.errorMessageWrapper}`}>
          <span className={styles.errorMessage}>
            Pendapatan yang kamu masukkan terlalu rendah
          </span>
        </div>
      )
    } else {
      return <></>
    }
  }

  const onBlurHandler = () => {
    setLastChoosenValue(lastChoosenValue || '')
    if (lastChoosenValue !== '') {
      const inputValue: any = suggestionsLists.filter(
        (item) => item.value === lastChoosenValue,
      )[0]
      setInputValue(String(inputValue?.label) || '')
    }
  }

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <HeaderCreditClasificationMobile />
      <div className={styles.progressBar}>
        <Progress
          className={styles.antProgress}
          percent={50}
          showInfo={false}
          size="small"
          strokeColor={{ '0%': '#51A8DB', '100%': '#51A8DB' }}
          trailColor="#EBECEE"
        />
      </div>
      <div className={styles.container}>
        <div className={styles.paddingInfoCar} onClick={handleOpenModal}>
          <div className={styles.cardInfoCar}>
            <div className={styles.imageCar}>
              <Image
                src={dataCar?.variantDetail?.images[0] || ''}
                alt="car-images"
                width="82"
                height="61"
              />
            </div>
            <div className={styles.frameTextInfoCar}>
              <div className={styles.titleTextCar}>
                {dataCar?.modelDetail.brand} {dataCar?.modelDetail.model}
              </div>
              <div className={styles.textType}>
                {dataCar?.variantDetail.name}
              </div>
              <div className={styles.textPrice}>
                Rp
                {replacePriceSeparatorByLocalization(
                  Number(dataCar?.variantDetail.priceValue),
                  LanguageCode.id,
                )}
              </div>
              <div className={styles.hargaOtrWrapper}>
                <span className={styles.smallRegular}>Harga OTR</span>
                <span className={styles.smallSemibold}>
                  {!cityOtr || dataCar?.modelDetail.brand.includes('Daihatsu')
                    ? 'Jakarta Pusat'
                    : cityOtr?.cityName}
                </span>
                {dataCar?.modelDetail.brand.includes('Daihatsu') && (
                  <IconInfo
                    className={styles.margin}
                    width={18}
                    height={18}
                    color="#878D98"
                  />
                )}
              </div>
              {/*{promoCode && (*/}
              {/*  <div className={styles.textPromo}>*/}
              {/*    <span className={styles.textPromoSelect}>*/}
              {/*      Promo yang kamu pilih:*/}
              {/*    </span>*/}
              {/*    <span className={styles.textPromoBold}>{promoCode}</span>*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
            <div className={styles.frameIcon}>
              <IconChevronRight width={24} height={24} color={'#13131B'} />
            </div>
          </div>
        </div>
        <div className={styles.titleText}>Kualifikasi Kredit</div>
        <div className={styles.subTitleText}>Sumber Pendapatan</div>
        <div className={styles.paddingFormJob}>
          <p className={styles.titleTextTwoForm}>Pekerjaan Saya</p>
          <InputSelect
            value={inputValue}
            options={suggestionsLists}
            onChange={onChangeInputHandler}
            onChoose={onChooseHandler}
            placeholderText="Pilih Pekerjaan"
            noOptionsText="Mobil tidak ditemukan"
            isSearchable={true}
            onBlurInput={onBlurHandler}
            rightIcon={
              <IconChevronDown width={35} height={35} color={'#13131B'} />
            }
          />
        </div>
        <div className={styles.paddingFormIncome}>
          <SpouseIncomeForm
            name="monthlyIncome"
            title="Pendapatan Bulananmu"
            value={Number(joinIncomeValue)}
            defaultValue={Number(joinIncomeValue)}
            handleChange={handleChange}
            isErrorTooLow={isIncomeTooLow}
            emitOnBlurInput={onInputJoinIncome}
          />
          {renderIncomeErrorMessage()}
        </div>
        <div className={styles.paddingFormReferral}>
          <FormReferralCode
            onClearInput={resetReferralCodeStatus}
            value={referralCodeInput}
            isLoadingReferralCode={isLoadingReferralCode}
            isErrorReferralCode={
              referralCodeInput !== '' &&
              (isErrorReferralCodeInvalid || isErrorRefCodeUsingOwnCode)
            }
            isSuccessReferralCode={isSuccessReferralCode}
            passedResetReferralCodeStatusFunc={resetReferralCodeStatus}
            passedCheckReferralCodeFunc={() => checkRefCode(referralCodeInput)}
            emitOnChange={handleInputRefferal}
            checkedIconColor={'#05256E'}
            errorIconColor={'#D83130'}
            errorMessage={getErrorMesssageRefCode()}
            maxInputLength={8}
            vibrateErrorMessage={true}
            fieldLabel={'Punya kode referral Teman SEVA? Masukkan di sini.'}
            placeholderText={'Contoh: SEVA0000'}
          />
        </div>
        <div className={styles.paddingButton}>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            disabled={
              lastChoosenValue === '' ||
              isIncomeTooLow ||
              joinIncomeValue < 3000000
            }
            onClick={onClickCtaNext}
          >
            Lanjutkan
          </Button>
        </div>
      </div>
      <Modal
        open={openModal}
        onCancel={handleCloseModal}
        title=""
        footer={null}
        className="custom-modal-credit"
        width={343}
        style={{ borderRadius: '8px' }}
      >
        <PopupCreditDetail
          carVariant={dataCar}
          dataFinancial={financialQuery}
          city={cityOtr ? cityOtr?.cityName : 'Jakarta Pusat'}
          promoCode={promoCode}
          simpleCarVariantDetails={simpleCarVariantDetails}
          optionADDM={optionADDM}
        />
      </Modal>
    </>
  )
}

export default CreditQualificationPage
