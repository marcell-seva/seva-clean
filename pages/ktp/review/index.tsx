import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/pages/ktp-review.module.scss'
import clsx from 'clsx'
import elementId from 'helpers/elementIds'
import Fuse from 'fuse.js'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import {
  CityOtrOption,
  FormControlValue,
  FormLCState,
  GetCustomerKtpSeva,
  Option,
} from 'utils/types/utils'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useToast } from 'components/atoms/OldToast/Toast'
import {
  fetchCustomerKtp,
  fetchCustomerSpouseKtp,
} from 'utils/httpUtils/customerUtils'
import {
  cameraKtpUrl,
  creditQualificationResultUrl,
  creditQualificationReviewUrl,
  formKtpUrl,
  leasingCompanyOption,
  multiResultCreditQualificationPageUrl,
  uploadKtpSpouseQueryParam,
} from 'utils/helpers/routes'
import { IconRadioButtonActive } from 'components/atoms/icon/RadioButtonActive'
import { IconRadioButtonInactive } from 'components/atoms/icon/RadioButtonInactive'
import {
  IconAdd,
  IconClose,
  IconSquareCheckBox,
  IconSquareCheckedBox,
} from 'components/atoms/icon'
import { Button, InputSelect, Overlay, Skeleton } from 'components/atoms'
import { addZero, monthId } from 'utils/handler/date'
import HeaderCreditClasificationMobile from 'components/organisms/headerCreditClasificationMobile'
import { ProgressBar } from 'components/atoms/progressBar'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { ToastType } from 'utils/types/models'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { getCities } from 'services/api'
import {
  valueForUserTypeProperty,
  valueForInitialPageProperty,
  trackEventCountly,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useTranslation } from 'react-i18next'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { useValidateUserFlowKKIA } from 'utils/hooks/useValidateUserFlowKKIA'
import { defineRouteName } from 'utils/navigate'
import Tooltip from 'antd/lib/tooltip'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useBeforePopState } from 'utils/hooks/useBeforePopState'
import { getLocalStorage } from 'utils/handler/localStorage'

const searchOption = {
  keys: ['label'],
  isCaseSensitive: true,
  includeScore: true,
  threshold: 0.1,
}

export default function KtpReview() {
  useProtectPage()
  useValidateUserFlowKKIA([
    creditQualificationReviewUrl,
    multiResultCreditQualificationPageUrl,
    creditQualificationResultUrl,
    formKtpUrl,
    cameraKtpUrl,
  ])
  useBeforePopState()
  const commonErrorMessage =
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi'
  const router = useRouter()
  const [allKtpData, setAllKtpData] = useState<GetCustomerKtpSeva[]>([])
  const [isLoadingKtpData, setIsLoadingKtpData] = useState(false)
  const ktpDataPersonalFromStorage: any = getSessionStorage(
    SessionStorageKey.DataUploadKTP,
  )
  const ktpDataSpouseFromStorage: any = getSessionStorage(
    SessionStorageKey.DataUploadKTPSpouse,
  )
  const [isSpouseAsMainKtp, setIsSpouseAsMainKtp] = useState<
    boolean | undefined
  >(false)
  const [isUsingPersonalKtpDomicile, setIsUsingPersonalKtpDomicile] =
    useState(false)
  const [isUsingSpouseKtpDomicile, setIsUsingSpouseKtpDomicile] =
    useState(false)
  const inputPersonalDomicileRef =
    useRef() as React.MutableRefObject<HTMLInputElement>
  const inputSpouseDomicileRef =
    useRef() as React.MutableRefObject<HTMLInputElement>
  const [personalDomicileValue, setPersonalDomicileValue] = useState('')
  const [spouseDomicileValue, setSpouseDomicileValue] = useState('')
  const [personalLastChoosenValue, setPersonalLastChoosenValue] = useState('')
  const [spouseLastChoosenValue, setSpouseLastChoosenValue] = useState('')
  const [cityListOptionsFull, setCityListOptionsFull] = useState<
    Option<string>[]
  >([])
  const [personalSuggestionsLists, setPersonalSuggestionsLists] = useState<any>(
    [],
  )
  const [spouseSuggestionsLists, setSpouseSuggestionsLists] = useState<any>([])
  const [cityListFromApi, setCityListFromApi] = useState<Array<CityOtrOption>>(
    [],
  )
  const { showToast, RenderToast } = useToast()
  const [isShowPersonalDomicileTooltip, setIsShowPersonalDomicileTooltip] =
    useState(false)
  const [isUserNeverSetPersonalDomicile, setIsUserNeverSetPersonalDomicile] =
    useState(false)
  const [
    isErrorPersonalDomicileFieldEmpty,
    setIsErrorPersonalDomicileFieldEmpty,
  ] = useState(false)
  const [isErrorSpouseDomicileFieldEmpty, setIsErrorSpouseDomicileFieldEmpty] =
    useState(false)
  const domicileFieldRef = useRef<HTMLDivElement | null>(null)
  const kkForm: FormLCState | null = getLocalStorage(
    LocalStorageKey.KalkulatorKreditForm,
  )
  const [loadingNav, setLoadingNav] = useState(false)

  const { fincap } = useFinancialQueryData()
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const isInPtbcFlow = kkFlowType && kkFlowType === 'ptbc'

  const trackKTPConfirmation = ({
    ktpContinue = false,
    allKtpDataAsParameter = [],
  }: {
    ktpContinue: boolean
    allKtpDataAsParameter: Array<any>
  }) => {
    const prevPage = getSessionStorage(SessionStorageKey.PreviousPage) as any
    const brand = kkForm?.model?.brandName || 'Null'
    const model = kkForm?.model
      ? kkForm?.model?.modelName.replace(brand, '')
      : 'Null'
    const track = {
      KTP_PROFILE: allKtpDataAsParameter.length > 1 ? 'Main + Spouse' : 'Main',
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

    const mainKTP = { MAIN_KTP: isSpouseAsMainKtp ? 'Spouse' : 'Main' }

    const initialUser = {
      USER_TYPE: valueForUserTypeProperty(),
      INITIAL_PAGE: valueForInitialPageProperty(),
    }

    if (ktpContinue) {
      trackEventCountly(CountlyEventNames.WEB_KTP_PAGE_CONFIRMATION_CTA_CLICK, {
        ...track,
        ...mainKTP,
      })
    } else {
      if (isInPtbcFlow) {
        trackEventCountly(
          CountlyEventNames.WEB_PTBC_KTP_PAGE_CONFIRMATION_VIEW,
          {
            KTP_PROFILE:
              allKtpDataAsParameter.length > 1 ? 'Main + Spouse' : 'Main',
          },
        )
      } else {
        trackEventCountly(CountlyEventNames.WEB_KTP_PAGE_CONFIRMATION_VIEW, {
          ...track,
          ...initialUser,
        })
      }
    }
  }

  useEffect(() => {
    getCustomerInfoData()
    checkCitiesData()
  }, [])

  useEffect(() => {
    const options = getCityListOption(cityListFromApi)
    setCityListOptionsFull(options)
  }, [cityListFromApi])

  useEffect(() => {
    if (personalDomicileValue === '') {
      setPersonalSuggestionsLists(getCityListOption(cityListWithTopCity()))
      return
    }

    const list = generateSuggestion(personalDomicileValue)
    setPersonalSuggestionsLists(list)
  }, [personalDomicileValue, cityListFromApi, cityListOptionsFull])

  useEffect(() => {
    if (spouseDomicileValue === '') {
      setSpouseSuggestionsLists(getCityListOption(cityListWithTopCity()))
      return
    }

    const list = generateSuggestion(spouseDomicileValue)
    setSpouseSuggestionsLists(list)
  }, [spouseDomicileValue, cityListFromApi, cityListOptionsFull])

  useAfterInteractive(() => {
    if (allKtpData.length > 0)
      trackKTPConfirmation({
        ktpContinue: false,
        allKtpDataAsParameter: allKtpData,
      })
  }, [allKtpData])

  const generateKtpData = (dataSource: GetCustomerKtpSeva) => {
    return {
      name: dataSource?.name,
      nik: dataSource?.nik,
      birthdate: dataSource?.birthdate,
      address: dataSource?.address,
      rtrw: dataSource?.rtrw,
      keldesa: dataSource?.keldesa,
      kecamatan: dataSource?.kecamatan,
      city: dataSource?.city,
      province: dataSource?.province,
      gender: dataSource?.gender,
      marriage: dataSource?.marriage,
      created: dataSource?.created,
      isSpouse: dataSource?.isSpouse,
    }
  }

  const getCustomerInfoData = async () => {
    setIsLoadingKtpData(true)
    try {
      const responsePersonalKtp = await fetchCustomerKtp() // when fetch failed, will return null
      const responseSpouseKtp = await fetchCustomerSpouseKtp() // when fetch failed, will return null
      const customerPersonalKtpData: GetCustomerKtpSeva[] | null =
        responsePersonalKtp.data
      const customerSpouseKtpData: GetCustomerKtpSeva[] | null =
        responseSpouseKtp
      if (
        customerPersonalKtpData &&
        customerPersonalKtpData.length > 0 &&
        !customerPersonalKtpData[0].city
      ) {
        setIsShowPersonalDomicileTooltip(true)
        setIsUserNeverSetPersonalDomicile(true)
      }

      const tempArr = []
      if (
        customerPersonalKtpData &&
        customerPersonalKtpData.length > 0 &&
        customerSpouseKtpData &&
        customerSpouseKtpData.length > 0
      ) {
        // === WHEN USER ALREADY SUBMITTED BOTH KTP ===
        const tempObjPersonal = generateKtpData(customerPersonalKtpData[0])
        const tempObjSpouse = generateKtpData(customerSpouseKtpData[0])
        tempArr.push(tempObjPersonal)
        tempArr.push(tempObjSpouse)
      } else if (
        customerPersonalKtpData &&
        customerPersonalKtpData.length > 0
      ) {
        // === WHEN USER ONLY HAVE SUBMITTED PERSONAL KTP ===
        const tempObjPersonal = generateKtpData(customerPersonalKtpData[0])
        tempArr.push(tempObjPersonal)

        if (ktpDataSpouseFromStorage) {
          const tempObjSpouse = {
            ...generateKtpData(ktpDataSpouseFromStorage),
            keldesa: ktpDataSpouseFromStorage?.kel, // data from storage use different prop
            kecamatan: ktpDataSpouseFromStorage?.kec, // data from storage use different prop
            isSpouse: true, // set "true" because data comes from upload spouse KTP
          }

          tempArr.push(tempObjSpouse)
        }
      } else if (!customerPersonalKtpData) {
        // === WHEN USER NEVER UPLOAD KTP BEFORE ===
        if (ktpDataPersonalFromStorage) {
          const tempObjPersonal = {
            ...generateKtpData(ktpDataPersonalFromStorage),
            keldesa: ktpDataPersonalFromStorage?.kel, // data from storage use different prop
            kecamatan: ktpDataPersonalFromStorage?.kec, // data from storage use different prop
            isSpouse: false, // set "false" because data comes from upload personal KTP
          }

          tempArr.push(tempObjPersonal)
        }
        if (ktpDataSpouseFromStorage) {
          const tempObjSpouse = {
            ...generateKtpData(ktpDataSpouseFromStorage),
            keldesa: ktpDataSpouseFromStorage?.kel, // data from storage use different prop
            kecamatan: ktpDataSpouseFromStorage?.kec, // data from storage use different prop
            isSpouse: true, // set "true" because data comes from upload spouse KTP
          }

          tempArr.push(tempObjSpouse)
        }
      }

      // SORT KTP LIST
      if (tempArr.length > 0) {
        // personal KTP always at the first index
        const index = tempArr.findIndex((item) => !item.isSpouse)
        tempArr.push(...tempArr.splice(0, index))
      }
      setAllKtpData(tempArr)
      setIsLoadingKtpData(false)

      trackKTPConfirmation({
        ktpContinue: false,
        allKtpDataAsParameter: tempArr,
      })
    } catch (e) {
      showToast()
      // if fetched ktp data not exist, it will return "null", wont get into catch block
    }
  }

  const checkCitiesData = () => {
    if (cityListFromApi.length === 0) {
      getCities().then((res) => {
        setCityListFromApi(res)
      })
    }
  }

  const getCityListOption = (cityList: any) => {
    const tempArray: Option<string>[] = []
    for (const item of cityList) {
      const tempObj: Option<string> = {
        label: '',
        value: '',
      }
      tempObj.value = item.cityName
      tempObj.label = item.cityName
      tempArray.push(tempObj)
    }
    return tempArray
  }

  const generateSuggestion = (inputValue: string) => {
    const fuse = new Fuse(cityListOptionsFull, searchOption)
    const suggestion = fuse.search(inputValue)
    const result = suggestion.map((obj) => obj.item)

    // sort alphabetically
    // result.sort((a: any, b: any) => a.label.localeCompare(b.label))

    // sort based on input
    return result.sort((a: any, b: any) => {
      if (a.label.startsWith(inputValue) && b.label.startsWith(inputValue))
        return a.label.localeCompare(b.label)
      else if (a.label.startsWith(inputValue)) return -1
      else if (b.label.startsWith(inputValue)) return 1

      return a.label.localeCompare(b.label)
    })
  }

  const cityListWithTopCity = () => {
    const topCityName = [
      'Jakarta Pusat',
      'Bogor',
      'Surabaya',
      'Bandung',
      'Medan',
      'Makassar',
    ]

    const topCityDataList: CityOtrOption[] = []

    for (let i = 0; i < topCityName.length; i++) {
      for (let j = 0; j < cityListFromApi.length; j++) {
        if (topCityName[i] === cityListFromApi[j].cityName) {
          topCityDataList.push(cityListFromApi[j])
        }
      }
    }

    const restOfCityData = cityListFromApi.filter(
      (x) => !topCityDataList.includes(x),
    )
    const sortedRestOfCityData = restOfCityData.sort((a, b) =>
      a.cityName.localeCompare(b.cityName),
    )

    return [...topCityDataList, ...sortedRestOfCityData]
  }

  const onClickRadioButton = (ktpData: GetCustomerKtpSeva) => {
    setIsSpouseAsMainKtp(ktpData.isSpouse)
  }

  const onClickCheckBoxDomicile = (ktpData: GetCustomerKtpSeva) => {
    if (!ktpData.isSpouse) {
      setIsUsingPersonalKtpDomicile((prev) => !prev)
    } else if (ktpData.isSpouse) {
      setIsUsingSpouseKtpDomicile((prev) => !prev)
    }
    trackEventCountly(
      CountlyEventNames.WEB_KTP_PAGE_CONFIRMATION_SAME_CITY_CLICK,
    )
  }

  const onChangeInputHandler = (value: string, ktpData: GetCustomerKtpSeva) => {
    if (!ktpData.isSpouse) {
      setPersonalDomicileValue(
        value
          .toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
      )
      setIsErrorPersonalDomicileFieldEmpty(false)
    } else if (ktpData.isSpouse) {
      setSpouseDomicileValue(
        value
          .toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' '),
      )
      setIsErrorSpouseDomicileFieldEmpty(false)
    }
  }

  const onBlurHandler = (ktpData: GetCustomerKtpSeva) => {
    if (!ktpData.isSpouse) {
      setPersonalDomicileValue(personalLastChoosenValue)
    } else if (ktpData.isSpouse) {
      setSpouseDomicileValue(spouseLastChoosenValue)
    }
  }

  const onChooseHandler = (
    item: Option<FormControlValue>,
    ktpData: GetCustomerKtpSeva,
  ) => {
    if (!ktpData.isSpouse) {
      setPersonalLastChoosenValue(item.label)
    } else if (ktpData.isSpouse) {
      setSpouseLastChoosenValue(item.label)
    }
  }

  const onResetHandler = (ktpData: GetCustomerKtpSeva) => {
    if (!ktpData.isSpouse) {
      inputPersonalDomicileRef.current?.focus()
    } else if (ktpData.isSpouse) {
      inputSpouseDomicileRef.current?.focus()
    }
  }

  const onClickAddSpouseKtp = () => {
    saveSessionStorage(
      SessionStorageKey.LastVisitedPageKKIAFlow,
      window.location.pathname,
    )
    trackEventCountly(
      CountlyEventNames.WEB_KTP_PAGE_CONFIRMATION_ADD_SPOUSE_CLICK,
    )
    router.push(cameraKtpUrl + uploadKtpSpouseQueryParam)
  }

  const getMainKtpDomicileData = () => {
    if (isSpouseAsMainKtp && isUsingSpouseKtpDomicile) {
      return allKtpData[1].city
    } else if (isSpouseAsMainKtp && !isUsingSpouseKtpDomicile) {
      return spouseDomicileValue
    } else if (!isSpouseAsMainKtp && isUsingPersonalKtpDomicile) {
      return allKtpData[0].city
    } else if (!isSpouseAsMainKtp && !isUsingPersonalKtpDomicile) {
      return personalDomicileValue
    } else {
      return ''
    }
  }

  const scrollToCityField = () => {
    if (domicileFieldRef) {
      domicileFieldRef.current?.scrollIntoView({
        block: 'center',
        inline: 'center',
      })
    }
  }

  const validateForm = () => {
    if (
      !isSpouseAsMainKtp &&
      !isUsingPersonalKtpDomicile &&
      !personalDomicileValue
    ) {
      setIsErrorPersonalDomicileFieldEmpty(true)
      scrollToCityField()
      return false
    } else if (
      isSpouseAsMainKtp &&
      !isUsingSpouseKtpDomicile &&
      !spouseDomicileValue
    ) {
      setIsErrorSpouseDomicileFieldEmpty(true)
      scrollToCityField()
      return false
    } else {
      return true
    }
  }

  const onClickNextButton = () => {
    setLoadingNav(true)
    const formValidationResult = validateForm()

    if (!formValidationResult) {
      setLoadingNav(false)
      return
    }

    const tempObj = {
      isUsingTheSameDomicile: isSpouseAsMainKtp
        ? isUsingSpouseKtpDomicile
        : isUsingPersonalKtpDomicile,
      lastChoosenDomicile: getMainKtpDomicileData(),
    }
    saveSessionStorage(
      SessionStorageKey.MainKtpDomicileOptionData,
      JSON.stringify(tempObj),
    )
    saveSessionStorage(
      SessionStorageKey.ReviewedKtpData,
      JSON.stringify(allKtpData),
    )
    saveSessionStorage(
      SessionStorageKey.MainKtpType,
      isSpouseAsMainKtp ? 'spouse' : 'personal',
    )
    sessionStorage.removeItem(SessionStorageKey.LastVisitedPageKKIAFlow)
    setTimeout(() => {
      trackKTPConfirmation({
        ktpContinue: true,
        allKtpDataAsParameter: allKtpData,
      })
    }, 500)
    router.push(leasingCompanyOption)
  }

  const renderRadioButton = (ktpData: GetCustomerKtpSeva) => {
    if (!ktpData.isSpouse && !isSpouseAsMainKtp) {
      return <IconRadioButtonActive width={24} height={24} />
    } else if (ktpData.isSpouse && isSpouseAsMainKtp) {
      return <IconRadioButtonActive width={24} height={24} />
    } else {
      return <IconRadioButtonInactive width={24} height={24} />
    }
  }

  const renderDomicileCheckBox = (ktpData: GetCustomerKtpSeva) => {
    if (!ktpData.isSpouse && isUsingPersonalKtpDomicile) {
      return <IconSquareCheckedBox width={16} height={16} />
    } else if (ktpData.isSpouse && isUsingSpouseKtpDomicile) {
      return <IconSquareCheckedBox width={16} height={16} />
    } else {
      return <IconSquareCheckBox width={16} height={16} />
    }
  }

  const handleCloseTooltip = () => {
    setIsShowPersonalDomicileTooltip(false)
  }

  const renderTooltipContent = () => {
    return (
      <div className={styles.tooltipContent}>
        <span className={styles.tootipText}>Lengkapi data di bawah ini</span>
        <div
          className={styles.iconWrapper}
          role="button"
          onClick={handleCloseTooltip}
        >
          <IconClose width={13} height={13} color="#FFFFFF" />
        </div>
      </div>
    )
  }

  const renderDomicileField = (ktpData: GetCustomerKtpSeva) => {
    if (
      !ktpData.isSpouse &&
      isSpouseAsMainKtp === ktpData.isSpouse &&
      !isUsingPersonalKtpDomicile
    ) {
      return (
        <>
          <Overlay
            isShow={isShowPersonalDomicileTooltip}
            onClick={handleCloseTooltip}
            zIndex={998}
          />
          <div style={{ width: '100%' }}>
            <Tooltip
              title={renderTooltipContent()}
              color="#246ED4"
              placement="top"
              className="custom-tooltip-ktp-review-domicile-field"
              open={isShowPersonalDomicileTooltip}
              overlayClassName="custom-tooltip-ktp-review-domicile-field"
            >
              <div
                className={styles.domicileFieldWrapper}
                ref={domicileFieldRef}
              >
                <span className={styles.fieldLabel}>Pilih Kota Domisili</span>
                <div
                  style={{ width: '100%' }}
                  className={
                    isShowPersonalDomicileTooltip ? styles.bordered : ''
                  }
                  onClick={handleCloseTooltip}
                >
                  <InputSelect
                    ref={inputPersonalDomicileRef}
                    value={personalDomicileValue}
                    options={personalSuggestionsLists}
                    onChange={(value) => onChangeInputHandler(value, ktpData)}
                    placeholderText={'Pilih Kota'}
                    isAutoFocus={false}
                    noOptionsText="Kota tidak ditemukan"
                    onBlurInput={() => onBlurHandler(ktpData)}
                    onFocusInput={() => {
                      trackEventCountly(
                        CountlyEventNames.WEB_KTP_PAGE_CONFIRMATION_DOMICILE_CITY_CLICK,
                        { KTP_PROFILE: 'Main' },
                      )
                    }}
                    onChoose={(item) => onChooseHandler(item, ktpData)}
                    onReset={() => onResetHandler(ktpData)}
                    datatestid={elementId.Homepage.GlobalHeader.FieldInputCity}
                    isError={isErrorPersonalDomicileFieldEmpty}
                  />
                </div>
                {isErrorPersonalDomicileFieldEmpty ? (
                  <span className={styles.errorMessage}>Wajib diisi</span>
                ) : null}
              </div>
            </Tooltip>
          </div>
        </>
      )
    } else if (
      ktpData.isSpouse &&
      isSpouseAsMainKtp === ktpData.isSpouse &&
      !isUsingSpouseKtpDomicile
    ) {
      return (
        <div className={styles.domicileFieldWrapper}>
          <span className={styles.fieldLabel}>Pilih Kota Domisili</span>
          <InputSelect
            ref={inputSpouseDomicileRef}
            value={spouseDomicileValue}
            options={spouseSuggestionsLists}
            onChange={(value) => onChangeInputHandler(value, ktpData)}
            placeholderText={'Pilih Kota'}
            isAutoFocus={false}
            noOptionsText="Kota tidak ditemukan"
            onFocusInput={() => {
              trackEventCountly(
                CountlyEventNames.WEB_KTP_PAGE_CONFIRMATION_DOMICILE_CITY_CLICK,
                { KTP_PROFILE: 'Spouse' },
              )
            }}
            onBlurInput={() => onBlurHandler(ktpData)}
            onChoose={(item) => onChooseHandler(item, ktpData)}
            onReset={() => onResetHandler(ktpData)}
            datatestid={elementId.Homepage.GlobalHeader.FieldInputCity}
            isError={isErrorSpouseDomicileFieldEmpty}
          />
          {isErrorSpouseDomicileFieldEmpty ? (
            <span className={styles.errorMessage}>Wajib diisi</span>
          ) : null}
        </div>
      )
    }
  }

  const getFormattedDate = (dateData: string | Date) => {
    const date = new Date(dateData)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const hours = addZero(date.getHours())
    const minutes = addZero(date.getMinutes())

    return `${day} ${monthId(month)} ${year} ${hours}:${minutes}`
  }

  const renderKtpDataSection = (ktpData: GetCustomerKtpSeva, index: number) => {
    const isShowCheckbox = ktpData.isSpouse
      ? ktpData.isSpouse === isSpouseAsMainKtp
      : ktpData.isSpouse === isSpouseAsMainKtp &&
        !isUserNeverSetPersonalDomicile

    return (
      <div key={index} className={styles.ktpSection}>
        <div className={styles.ktpHeaderSection}>
          <h3 className={styles.ktpHeaderTitle}>
            KTP {ktpData.isSpouse ? 'Pasangan' : 'Kamu'}
          </h3>
          <span className={styles.ktpAddedDate}>
            Ditambahkan pada{' '}
            {getFormattedDate(ktpData.created ? ktpData.created : new Date())}
          </span>
          <div className={styles.ktpMainOptionWrapper}>
            <span className={styles.ktpMainOptionText}>
              Gunakan KTP ini sebagai KTP utama
            </span>
            <button
              className={styles.iconWrapper}
              onClick={() => onClickRadioButton(ktpData)}
            >
              {renderRadioButton(ktpData)}
            </button>
          </div>
        </div>

        <div className={styles.ktpDataWrapper}>
          <div className={styles.ktpDataRow}>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowLeft)}>
              NIK
            </span>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowRight)}>
              {ktpData.nik}
            </span>
          </div>
          <div className={styles.ktpDataRow}>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowLeft)}>
              Nama
            </span>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowRight)}>
              {ktpData.name}
            </span>
          </div>
          <div className={styles.ktpDataRow}>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowLeft)}>
              Kota
            </span>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowRight)}>
              {ktpData.city}
            </span>
          </div>
          <div className={styles.ktpDataRow}>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowLeft)}>
              Status Perkawinan
            </span>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowRight)}>
              {ktpData.marriage}
            </span>
          </div>
          <div className={styles.ktpDataRow}>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowLeft)}>
              Tanggal Lahir
            </span>
            <span className={clsx(styles.ktpDataText, styles.ktpDataRowRight)}>
              {ktpData.birthdate}
            </span>
          </div>

          {isShowCheckbox ? (
            <div className={styles.ktpDataRow}>
              <span className={clsx(styles.ktpDataText, styles.ktpDataRowLeft)}>
                Kota Domisili
              </span>
              <div className={styles.checkboxOptionWrapper}>
                <button
                  className={styles.iconWrapper}
                  onClick={() => onClickCheckBoxDomicile(ktpData)}
                >
                  {renderDomicileCheckBox(ktpData)}
                </button>
                <span className={styles.ktpDataText}>Sama dengan KTP</span>
              </div>
            </div>
          ) : null}

          {renderDomicileField(ktpData)}
        </div>
      </div>
    )
  }

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.container}>
        <HeaderCreditClasificationMobile />
        <div className={styles.progressBarWrapper}>
          <ProgressBar percentage={80} colorPrecentage="#51A8DB" />
        </div>
        {isLoadingKtpData ? (
          <div className={clsx(styles.content, styles.shimmerWrapper)}>
            {[...Array(15)].map((x, i) => (
              <Skeleton height={20} width={300} key={i} />
            ))}
          </div>
        ) : (
          <div className={styles.content}>
            <h2 className={styles.header}>Data KTP untuk Instant Approval</h2>

            <div className={styles.ktpContent}>
              {allKtpData.map((item, index) => {
                return renderKtpDataSection(item, index)
              })}

              {allKtpData.length === 1 ? (
                <div
                  role="button"
                  className={styles.addSpouseKtpCard}
                  onClick={onClickAddSpouseKtp}
                >
                  <div className={styles.addSpouseKtpCardHeader}>
                    <div className={styles.iconWrapper}>
                      <IconAdd width={16} height={16} />
                    </div>
                    <span className={styles.addSpouseKtpTitle}>
                      Tambah Data KTP Pasangan
                    </span>
                  </div>
                  <span className={styles.addSpouseKtpSubtitle}>
                    Jika sudah menikah, kamu wajib menambahkan KTP pasanganmu
                    (suami/istri sah) untuk mendapatkan hasil Instant Approval
                    yang akurat.
                  </span>
                </div>
              ) : null}
            </div>

            <div className={styles.buttonWrapper}>
              <Button
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                onClick={onClickNextButton}
                loading={loadingNav}
                disabled={loadingNav}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>
      <RenderToast
        type={ToastType.Error}
        message={commonErrorMessage}
        overridePositionToBottom={true}
        duration={3}
      />
    </>
  )
}
