import React, { useEffect, useMemo, useState, useContext } from 'react'
import styles from 'styles/components/organisms/leadsFormUsedCar.module.scss'
import {
  Button,
  Gap,
  IconLoading,
  Input,
  InputPhone,
  Toast,
} from 'components/atoms'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import { capitalizeWords, filterNonDigitCharacters } from 'utils/stringUtils'
import { onlyLettersAndSpaces } from 'utils/handler/regex'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'
import { OTP } from '../../otp'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { variantListUrl } from 'utils/helpers/routes'
import { getConvertFilterIncome } from 'utils/filterUtils'
import { useRouter } from 'next/router'
import { useCar } from 'services/context/carContext'
import { ButtonVersion, ButtonSize } from 'components/atoms/button'
import {
  LanguageCode,
  LeadsUsedCar,
  LocalStorageKey,
  SessionStorageKey,
  UnverifiedLeadSubCategory,
} from 'utils/enum'
import { Currency } from 'utils/handler/calculation'
import { CityOtrOption } from 'utils/types'
import { LoanRank } from 'utils/types/models'
import {
  trackEventCountly,
  valueForUserTypeProperty,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getToken } from 'utils/handler/auth'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewLC,
} from 'utils/navigate'
import Image from 'next/image'
import { createUnverifiedLeadNewUsedCar } from 'utils/handler/lead'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'
import { LeadsActionParam, PageOriginationName } from 'utils/types/props'
import { SelectedCalculateLoanUsedCar } from 'utils/types/utils'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'

const SupergraphicLeft = '/revamp/illustration/supergraphic-small.webp'
const SupergraphicRight = '/revamp/illustration/supergraphic-large.webp'

interface ChoosenAssurance {
  label: string
  name: string
  tenureAR: number
  tenureTLO: number
}

interface PropsLeadsForm {
  otpStatus?: any
  toLeads?: any
  onVerify?: (e: any) => void
  onFailed?: (e: any) => void
  selectedLoan?: SelectedCalculateLoanUsedCar | null
  chosenAssurance?: ChoosenAssurance | null
}

export const LeadsFormUsedCar: React.FC<PropsLeadsForm> = ({
  toLeads,
  selectedLoan = null,
  chosenAssurance = null,
}) => {
  const toastSuccessInfo =
    'Agen Setir Kanan akan menghubungi kamu dalam 1x24 jam.'
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const [modalOpened, setModalOpened] = useState<
    'otp' | 'success-toast' | 'none'
  >('none')
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)

  const { usedCarModelDetailsRes } = useContext(UsedPdpDataLocalContext)
  const carLeads = usedCarModelDetailsRes
  console.log(carLeads)

  const modelName =
    carLeads?.modelName.slice(0, 1) + carLeads?.modelName.slice(1).toLowerCase()
  const infoCar = `${carLeads?.brandName}  ${modelName} ${carLeads?.variantName} ${carLeads?.nik}`
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const referralCodeFromUrl: string | null = getLocalStorage(
    LocalStorageKey.referralTemanSeva,
  )

  const router = useRouter()
  const loanRankcr = router.query.loanRankCVL ?? ''

  const handleInputName = (payload: any): void => {
    if (payload !== ' ' && onlyLettersAndSpaces(payload)) {
      setName(payload)
      checkInputValue(payload, phone)
    }
  }

  const handleInputPhone = (payload: any): void => {
    const temp = payload
    const checkNumber = payload.split('').splice(0, 2)
    if (checkNumber[0] === '6' && checkNumber[1] === '2') {
      const phoneNumberTemp = filterNonDigitCharacters(temp.replace('62', ''))
      setPhone(phoneNumberTemp)
      checkInputValue(name, phoneNumberTemp)
    } else if (payload !== '0' && payload !== '6') {
      const phoneNumberTemp = filterNonDigitCharacters(temp)
      setPhone(phoneNumberTemp)
      checkInputValue(name, phoneNumberTemp)
    }
  }

  const checkInputValue = (name: string, phone: string): void => {
    if (name !== '' && phone?.length > 8) setIsFilled(true)
    else setIsFilled(false)
  }

  useEffect(() => {
    getDataCustomer()
  }, [])

  const verified = () => {
    const data = {
      name,
      phone,
    }
    setModalOpened('none')
    saveFlagLeads(data)
    sendUnverifiedLeads()
  }

  const trackCountlySendLeads = async (verifiedPhone: string) => {
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_SEND_CLICK, {
      PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
      LOGIN_STATUS: isUserLoggedIn ? 'Yes' : 'No',
      PHONE_VERIFICATION_STATUS: verifiedPhone,
      PHONE_NUMBER: '+62' + phone,
    })
  }
  const sendOtpCode = async () => {
    setIsLoading(true)
    const dataLeads = checkDataFlagLeads()
    if (dataLeads) {
      if (phone === dataLeads.phone && name === dataLeads.name) {
        trackCountlySendLeads('Yes')
        sendUnverifiedLeads()
      } else if (phone === dataLeads.phone && name !== dataLeads.name) {
        trackCountlySendLeads('Yes')
        sendUnverifiedLeads()
        updateFlagLeadsName(name)
      } else {
        trackCountlySendLeads('No')
        trackEventCountly(CountlyEventNames.WEB_OTP_VIEW, {
          PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
        })
        setModalOpened('otp')
      }
    } else if (isUserLoggedIn) {
      trackCountlySendLeads('Yes')
      sendUnverifiedLeads()
    } else {
      trackCountlySendLeads('No')
      trackEventCountly(CountlyEventNames.WEB_OTP_VIEW, {
        PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
      })
      setModalOpened('otp')
    }
  }

  console.log(selectedLoan)
  console.log(chosenAssurance)

  const saveFlagLeads = (payload: any) => {
    const now = new Date()
    const expiry = now.getTime() + 7 * 24 * 60 * 60 * 1000
    const data = { ...payload, expiry }
    const encryptedData = encryptValue(JSON.stringify(data))
    saveLocalStorage(LocalStorageKey.flagLeads, encryptedData)
  }

  const updateFlagLeadsName = (payload: string) => {
    const data: any = getLocalStorage(LocalStorageKey.flagLeads)
    const decryptedValue: any = JSON.parse(decryptValue(data))
    const newData = { ...decryptedValue, name: payload }
    const encryptedData = encryptValue(JSON.stringify(newData))
    saveLocalStorage(LocalStorageKey.flagLeads, encryptedData)
  }

  const sendUnverifiedLeads = async () => {
    let temanSevaStatus = 'No'

    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response[0]?.temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }
    if (selectedLoan !== null) {
      const data = {
        origination:
          selectedLoan !== null
            ? LeadsUsedCar.USED_CAR_CALCULATOR_LEADS_FORM
            : LeadsUsedCar.USED_CAR_PDP_LEADS_FORM,
        customerName: name,
        phoneNumber: phone,
        selectedTenure: selectedLoan?.tenor,
        selectedTdp: selectedLoan?.totalDP,
        selectedInstallment: selectedLoan?.totalInstallment,
        priceFormatedNumber:
          'Rp. ' +
          replacePriceSeparatorByLocalization(
            carLeads.priceValue,
            LanguageCode.id,
          ),
        carId: carLeads.carId,
        makeName: carLeads.brandName,
        modelName: carLeads.modelName,
        variantName: carLeads.variantName,
        skuCode: carLeads.skuCode,
        colourName: carLeads.color,
        engineCapacity: carLeads.carSpecifications.find(
          (item: any) => item.specCode === 'engine-capacity',
        ).value,
        priceValue: carLeads.priceValue,
        seat: carLeads.seat,
        variantTitle: carLeads.variantTitle,
        transmission: carLeads.carSpecifications.find(
          (item: any) => item.specCode === 'transmission',
        ).value,
        fuelType: carLeads.carSpecifications.find(
          (item: any) => item.specCode === 'fuel-type',
        ).value,
        productCat: carLeads.productCat,
        nik: carLeads.nik,
        cityName: carLeads.cityName.replace(' ', ''),
        plate: carLeads.plate,
        mileage: carLeads.mileage,
        taxDate: carLeads.taxDate,
        partnerName: carLeads.partnerName,
        partnerId: carLeads.partnerId,
        cityId: carLeads.cityId,
        sevaUrl: carLeads.sevaUrl,
        tenureAR: chosenAssurance?.tenureAR,
        tenureTLO: chosenAssurance?.tenureTLO,
      }

      try {
        await createUnverifiedLeadNewUsedCar(data)
        setModalOpened('success-toast')
        trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_SUCCESS_VIEW, {
          PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
          LOGIN_STATUS: isUserLoggedIn ? 'Yes' : 'No',
          TEMAN_SEVA_STATUS: temanSevaStatus,
          PHONE_NUMBER: '+62' + phone,
        })
        setIsLoading(false)
        setTimeout(() => setModalOpened('none'), 3000)
      } catch (error) {
        throw error
      }
    } else {
      const data = {
        origination:
          selectedLoan !== null
            ? LeadsUsedCar.USED_CAR_CALCULATOR_LEADS_FORM
            : LeadsUsedCar.USED_CAR_PDP_LEADS_FORM,
        customerName: name,
        phoneNumber: phone,
        priceFormatedNumber:
          'Rp. ' +
          replacePriceSeparatorByLocalization(
            carLeads.priceValue,
            LanguageCode.id,
          ),
        carId: carLeads.carId,
        makeName: carLeads.brandName,
        modelName: carLeads.modelName,
        variantName: carLeads.variantName,
        skuCode: carLeads.skuCode,
        colourName: carLeads.color,
        engineCapacity: carLeads.carSpecifications.find(
          (item: any) => item.specCode === 'engine-capacity',
        ).value,
        priceValue: carLeads.priceValue,
        seat: carLeads.seat,
        variantTitle: carLeads.variantTitle,
        transmission: carLeads.carSpecifications.find(
          (item: any) => item.specCode === 'transmission',
        ).value,
        fuelType: carLeads.carSpecifications.find(
          (item: any) => item.specCode === 'fuel-type',
        ).value,
        productCat: carLeads.productCat,
        nik: carLeads.nik,
        cityName: carLeads.cityName.replace(' ', ''),
        plate: carLeads.plate,
        mileage: carLeads.mileage,
        taxDate: carLeads.taxDate,
        partnerName: carLeads.partnerName,
        partnerId: carLeads.partnerId,
        cityId: carLeads.cityId,
        sevaUrl: carLeads.sevaUrl,
      }

      try {
        await createUnverifiedLeadNewUsedCar(data)
        setModalOpened('success-toast')
        trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_SUCCESS_VIEW, {
          PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
          LOGIN_STATUS: isUserLoggedIn ? 'Yes' : 'No',
          TEMAN_SEVA_STATUS: temanSevaStatus,
          PHONE_NUMBER: '+62' + phone,
        })
        setIsLoading(false)
        setTimeout(() => setModalOpened('none'), 3000)
      } catch (error) {
        throw error
      }
    }
  }

  const getDataCustomer = async () => {
    const data: string | null = getLocalStorage(LocalStorageKey.sevaCust)
    if (data !== null) {
      const user = JSON.parse(decryptValue(data))
      setName(user.fullName)
      setPhone(user.phoneNumber.replace('+62', ''))
      setIsUserLoggedIn(true)
      setIsFilled(true)
    } else {
      const dataLeads = checkDataFlagLeads()
      if (dataLeads) {
        setName(dataLeads.name)
        setPhone(dataLeads.phone)
        setIsFilled(true)
      }
    }
  }

  const checkDataFlagLeads = () => {
    const now = new Date()
    const flagLeads: any | null = getLocalStorage(LocalStorageKey.flagLeads)
    if (flagLeads !== null) {
      const parsedLeads = JSON.parse(decryptValue(flagLeads))
      if (now.getTime() > parsedLeads.expiry) {
        localStorage.removeItem(LocalStorageKey.flagLeads)
        return
      } else {
        return parsedLeads
      }
    }
  }

  const onClickNameField = () => {
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_NAME_CLICK, {
      PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
      USER_TYPE: valueForUserTypeProperty(),
    })
  }

  const onClickPhoneField = () => {
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_PHONE_NUMBER_CLICK, {
      PAGE_ORIGINATION: 'PDP - ' + valueMenuTabCategory(),
      USER_TYPE: valueForUserTypeProperty(),
    })
  }
  return (
    <div ref={toLeads}>
      <div className={styles.wrapper}>
        <div className={styles.background}>
          <div className={styles.wrapperSupergraphicLeft}>
            <Image
              src={SupergraphicLeft}
              alt={'Vector Promosi Mobil'}
              width={200}
              height={140}
              className={styles.supergraphicLeft}
            />
          </div>
          <div className={styles.wrapperSupergraphicRight}>
            <Image
              src={SupergraphicRight}
              alt={'Vector Promosi Mobil'}
              width={200}
              height={140}
              className={styles.supergraphicRight}
            />
          </div>
        </div>

        <div className={styles.foreground}>
          <h2 className={styles.textHeading}>Tanyakan unit {infoCar}</h2>
          <div className={styles.form}>
            <Input
              dataTestId={elementId.Field.FullName}
              placeholder="Masukkan nama lengkap"
              title="Nama Lengkap"
              value={name}
              onChange={(e: any) => handleInputName(e.target.value)}
              onFocus={onClickNameField}
            />
            <Gap height={24} />
            <InputPhone
              dataTestId={elementId.Field.PhoneNumber}
              disabled={isUserLoggedIn}
              placeholder="Masukkan nomor HP"
              title="Nomor Handphone"
              value={phone}
              onChange={(e: any) => handleInputPhone(e.target.value)}
              onFocus={onClickPhoneField}
            />
            <Gap height={32} />
            <Button
              data-testid={elementId.PDP.Button.CariMobil}
              disabled={!isFilled}
              version={isFilled ? ButtonVersion.Default : ButtonVersion.Disable}
              size={ButtonSize.Big}
              onClick={() => sendOtpCode()}
            >
              {isLoading && isFilled ? (
                <div className={`${styles.iconWrapper} rotateAnimation`}>
                  <IconLoading width={14} height={14} color="#05256E" />
                </div>
              ) : (
                'Kirim'
              )}
            </Button>
          </div>
        </div>
      </div>
      {modalOpened === 'otp' && (
        <OTP
          isOpened
          phoneNumber={phone}
          closeModal={() => {
            setIsLoading(false)
            setModalOpened('none')
          }}
          isOtpVerified={() => verified()}
          pageOrigination={'PDP - ' + valueMenuTabCategory()}
        />
      )}
      <Toast
        width={343}
        text={toastSuccessInfo}
        open={modalOpened === 'success-toast'}
      />
    </div>
  )
}
