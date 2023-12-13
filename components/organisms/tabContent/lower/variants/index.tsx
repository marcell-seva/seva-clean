import React, { useRef, useState } from 'react'
import styles from 'styles/components/organisms/variantsOptions.module.scss'
import {
  CarModelDetailsResponse,
  CarVariantRecommendation,
  trackDataCarType,
} from 'utils/types/utils'
import { IconFuel, IconTransmission } from 'components/atoms'

import {
  IconChevronDown,
  IconChevronUp,
  IconToggleGridActive,
  IconToggleGridInactive,
  IconToggleListActive,
  IconToggleListInactive,
} from 'components/atoms'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import {
  trackCarVariantPricelistClick,
  trackCarVariantPricelistClickCta,
  trackChangeLayoutClick,
} from 'helpers/amplitude/seva20Tracking'
import { million, ten } from 'utils/helpers/const'
import { variantListUrl } from 'utils/helpers/routes'
import elementId from 'helpers/elementIds'
import { CityOtrOption } from 'utils/types/utils'
import { useRouter } from 'next/router'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import {
  replacePriceSeparatorByLocalization,
  formatNumberByLocalization,
} from 'utils/handler/rupiah'
import {
  trackEventCountly,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { LoanRank } from 'utils/types/models'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewLC,
} from 'utils/navigate'
import { getLocalStorage } from 'utils/handler/localStorage'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import Image from 'next/image'
import { AdaOTOdiSEVALeadsForm } from 'components/organisms/leadsForm/adaOTOdiSEVA/popUp'
import { useUtils } from 'services/context/utilsContext'
import clsx from 'clsx'

const rpIcon = '/revamp/illustration/rp-icon.webp'

type VariantsProps = {
  carModelDetails: CarModelDetailsResponse
  setViewVariant: (value: CarVariantRecommendation) => void
  setOpenModal: (value: boolean) => void
  onCardClick: (value: CarVariantRecommendation) => void
  setSelectedTabValue?: (value: string) => void
  isOTO?: boolean
}
const TabContentLowerVariant = ({
  carModelDetails,
  setOpenModal,
  setViewVariant,
  setSelectedTabValue,
  onCardClick,
  isOTO = false,
}: VariantsProps) => {
  const [toggleHorizontal, setToggleHorizontal] = useState(true)
  const [expandHorizontal, setExpandHorizontal] = useState(false)
  const [onHover, setOnHover] = useState(false)
  const { saveDataVariantLeads } = useUtils()
  const collapseRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const router = useRouter()
  const brand = router.query.brand as string
  const model = router.query.model as string
  const tab = router.query.tab as string
  const loanRankcr = router.query.loanRankCVL ?? ''

  const { funnelQuery } = useFunnelQueryData()
  const getDataForAmplitude = (carVariant: CarVariantRecommendation) => {
    return {
      Car_Brand: carModelDetails.brand ?? '',
      Car_Model: carModelDetails.model ?? '',
      OTR:
        'RP' +
        replacePriceSeparatorByLocalization(
          carVariant.priceValue,
          LanguageCode.id,
        ),
      City: cityOtr?.cityName || 'null',
      Car_Variant: carVariant.name,
      Page_Origination_URL: window.location.href,
      ...(funnelQuery.downPaymentAmount && {
        DP: 'RP' + funnelQuery.downPaymentAmount + ' Juta',
      }),
      ...(funnelQuery.age && {
        Age_Group: funnelQuery.age.toString(),
      }),
      Cicilan: `Rp${formatNumberByLocalization(
        carVariant.monthlyInstallment,
        LanguageCode.id,
        million,
        ten,
      ).toString()} jt/bln`,
      ...(funnelQuery.tenure && {
        Tenure: funnelQuery.tenure.toString(),
      }),
    }
  }
  const removeToneColor = (variantName: string) => {
    if (carModelDetails.brand === 'Hyundai')
      return removeToneColorHyundai(variantName)

    const variantSplice =
      variantName[variantName.length - 1] === ' '
        ? variantName.slice(0, variantName.length - 1).toLowerCase()
        : variantName.toLowerCase()
    const variant = variantSplice.toLowerCase()
    if (variant.includes('non premium color')) {
      return variant.replace('(non premium color)', '').toUpperCase()
    } else if (variant.includes('premium color')) {
      return variant.replace('(premium color)', '').toUpperCase()
    } else if (variant.includes('two tone')) {
      return variant.replace('two tone', '').toUpperCase()
    } else if (variant.includes('one tone')) {
      return variant.replace('one tone', '').toUpperCase()
    } else {
      return variantName
    }
  }

  const removeToneColorHyundai = (variantName: string) => {
    let variant = variantName
    if (variant.toLowerCase().includes('non premium color')) {
      variant = variant.replace('Non Premium Color', '')
    } else if (variant.toLowerCase().includes('premium color')) {
      variant = variant.replace('Premium Color', '')
    }
    if (variant.toLowerCase().includes('matte color')) {
      variant = variant.replace('Matte Color', '')
    }
    if (variant.toLowerCase().includes('two tone')) {
      variant = variant.replace('Two Tone', '')
    } else if (variant.toLowerCase().includes('one tone')) {
      variant = variant.replace('One Tone', '')
    }

    if (variant.toLowerCase().includes('single tone')) {
      variant = variant.replace('Single Tone', '')
    } else if (variant.toLowerCase().includes('dual tone')) {
      variant = variant.replace('Dual Tone', '')
    }

    if (variant.toLowerCase().includes('captain seat')) {
      variant = variant.replaceAll('Captain Seat', '')
    }
    if (variant.toLowerCase().includes('roof')) {
      variant = variant.replaceAll('Roof', '')
    }
    return variant
  }

  const topWordingName = (variantName: string) => {
    if (carModelDetails.brand === 'Hyundai')
      return topWordingNameHyundai(variantName)

    return variantName.includes('Premium Color') &&
      !variantName.includes('Non Premium Color')
      ? 'Premium Color'
      : variantName.includes('Non Premium Color')
      ? 'Non Premium Color'
      : variantName.includes('One Tone')
      ? 'One Tone'
      : variantName.toLowerCase().includes('two tone')
      ? 'Two Tone'
      : 'One Tone'
  }

  const topWordingNameHyundai = (variantName: string) => {
    let word = ''
    if (
      variantName.includes('Premium Color') &&
      !variantName.includes('Non Premium Color')
    ) {
      word += 'Premium Color|'
    }
    if (variantName.includes('Non Premium Color')) {
      word += 'Non Premium Color|'
    }
    if (variantName.includes('Matte Color')) {
      word += 'Matte Color|'
    }
    if (variantName.toLowerCase().includes('single tone')) {
      word += 'Single Tone|'
    }
    if (variantName.toLowerCase().includes('dual tone')) {
      word += 'Dual Tone|'
    }
    if (variantName.includes('One Tone')) {
      word += 'One Tone|'
    }
    if (variantName.toLowerCase().includes('two tone')) {
      word += 'Two Tone|'
    }

    if (variantName.toLowerCase().includes('roof')) {
      word += 'Roof|'
    }

    if (variantName.includes('Captain Seat')) {
      word += 'Captain Seat|'
    }

    if (word === '') {
      word = 'One Tone'
    }

    return word.replaceAll('|', ' ')
  }

  const topWordingNameDisplay = (variantName: string) => {
    if (!removeToneColor(variantName)) return ''
    return topWordingName(variantName)
  }

  const variantNameDisplay = (varianName: string) => {
    const varName = removeToneColor(varianName)
    if (!varName) return topWordingName(varianName)

    return varName
  }

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const showLeadsForm = (data: string) => {
    saveDataVariantLeads(data)
    setIsModalOpened(true)
  }

  const saveDataCarForLoginPageView = (carVariant: string) => {
    const dataCar: trackDataCarType | null = getSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
    )
    const dataCarTemp = {
      ...dataCar,
      CAR_VARIANT: carVariant,
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
  }
  const navigateToCreditTab = (
    carVariant: CarVariantRecommendation,
    index: number,
  ) => {
    trackCarVariantPricelistClickCta(getDataForAmplitude(carVariant))
    trackClickCtaCountly(carVariant, index)
    saveDataCarForLoginPageView(carVariant.name)
    saveDataForCountlyTrackerPageViewLC(PreviousButton.VariantPriceList)

    // should use window.location.href because the not updated
    const url = variantListUrl
      .replace(':brand', brand)
      .replace(':model', model)
      .replace(':tab?', 'kredit')

    window.location.href = `${url}?selectedVariantId=${carVariant.id}${
      loanRankcr && `&loanRankcr=${loanRankcr}`
    }`
  }

  const trackClickCtaCountly = (
    carVariant: CarVariantRecommendation,
    index: number,
  ) => {
    trackEventCountly(CountlyEventNames.WEB_PDP_LOAN_CALCULATOR_CTA_CLICK, {
      SOURCE_SECTION: 'Variant pricelist',
      MENU_TAB_CATEGORY: valueMenuTabCategory(),
      VISUAL_TAB_CATEGORY: tab ? tab : 'Warna',
      CAR_BRAND: carModelDetails.brand ?? '',
      CAR_MODEL: carModelDetails.model ?? '',
      CAR_ORDER: index + 1,
      CAR_VARIANT: carVariant.name,
    })
  }

  const trackOpenPopupCountly = (
    carVariant: CarVariantRecommendation,
    index: number,
  ) => {
    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }

    trackEventCountly(CountlyEventNames.WEB_PDP_VARIANT_PRICELIST_CLICK, {
      MENU_TAB_CATEGORY: valueMenuTabCategory(),
      CAR_BRAND: carModelDetails.brand ?? '',
      CAR_MODEL: carModelDetails.model ?? '',
      CAR_VARIANT: carVariant.name,
      CAR_ORDER: index + 1,
      PELUANG_KREDIT_BADGE: isUsingFilterFinancial ? creditBadge : 'Null',
    })
  }

  const onClickHorizontalView = () => {
    setToggleHorizontal(true)
    trackChangeLayoutClick({
      Page_Origination_URL: window.location.href,
    })
    trackEventCountly(CountlyEventNames.WEB_PDP_VARIANT_LIST_LAYOUT_CLICK, {
      LIST_TYPE: 'Horizontal list',
    })
  }

  const onClickVerticalView = () => {
    setToggleHorizontal(false)
    trackChangeLayoutClick({
      Page_Origination_URL: window.location.href,
    })
    trackEventCountly(CountlyEventNames.WEB_PDP_VARIANT_LIST_LAYOUT_CLICK, {
      LIST_TYPE: 'Vertical list',
    })
  }

  const handleOpenPopup = (
    carVariant: CarVariantRecommendation,
    index: number,
  ) => {
    setOpenModal(true)
    setViewVariant(carVariant)
    onCardClick(carVariant)
    trackCarVariantPricelistClick(getDataForAmplitude(carVariant))
    trackOpenPopupCountly(carVariant, index)
  }

  return (
    <div>
      <div className={styles.cardInfoDetail} style={{ height: 'auto' }}>
        <div className={styles.row} style={{ justifyContent: 'space-between' }}>
          <div
            className={styles.rowWithGap}
            data-testid={elementId.Text + 'harga'}
          >
            <Image src={rpIcon} alt="SEVA Rupiah Icon" height={20} width={20} />
            <h3 className={styles.textTitleSection}>Harga</h3>
          </div>
          <div>
            {toggleHorizontal ? (
              <div
                className={styles.toggleHorizontalWrapper}
                data-testid={elementId.PDP.Button.Grid}
              >
                <div
                  className={styles.toggleActive}
                  onClick={onClickHorizontalView}
                >
                  <IconToggleGridActive
                    width={16}
                    height={16}
                    alt="SEVA Menu Icon"
                  />
                </div>
                <div onClick={onClickVerticalView}>
                  <IconToggleListInactive
                    width={16}
                    height={16}
                    alt="SEVA List Icon"
                  />
                </div>
              </div>
            ) : (
              <div
                className={styles.toggleVerticalWrapper}
                data-testid={elementId.PDP.Button.List}
              >
                <div onClick={onClickHorizontalView}>
                  <IconToggleGridInactive
                    width={16}
                    height={16}
                    alt="SEVA Menu Icon"
                  />
                </div>
                <div
                  className={styles.toggleActive}
                  onClick={onClickVerticalView}
                >
                  <IconToggleListActive
                    width={16}
                    height={16}
                    alt="SEVA List Icon"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginBottom: '8px' }} ref={collapseRef}>
          <p className={styles.textHeaderVariant}>
            Harga varian mobil di bawah ini berdasarkan tenor 5 tahun.
          </p>
        </div>
        {!toggleHorizontal ? (
          carModelDetails.variants
            .map((carVariant: CarVariantRecommendation, index: number) => (
              <div
                key={carVariant.id}
                className={styles.containerCard}
                data-testid={elementId.PDP.List.VariantCard}
              >
                <div className={styles.cardCarVariantGrid}>
                  <div
                    className={styles.cardCarVariantInfoGrid}
                    style={{ flexDirection: 'row' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <div data-testid={elementId.PDP.List.VariantName}>
                        <div className={styles.row}>
                          <p className={styles.openSansBoldGrey}>
                            {topWordingNameDisplay(carVariant.name)}
                          </p>
                        </div>
                        <div>
                          <div>
                            <div className={styles.tooltip}>
                              {variantNameDisplay(carVariant.name).length >
                                35 && (
                                <div>
                                  <p
                                    className={clsx({
                                      [styles.openSansSemiBoldBlack]: true,
                                      [styles.responsiveText]: true,
                                    })}
                                  >
                                    {variantNameDisplay(carVariant.name)}
                                  </p>
                                  <span
                                    className={styles.tooltiptext}
                                    onMouseOver={() => setOnHover(!onHover)}
                                  >
                                    {variantNameDisplay(carVariant.name)}
                                  </span>
                                </div>
                              )}
                              <p
                                className={clsx({
                                  [styles.openSansSemiBoldBlack]: true,
                                  [styles.responsiveText]: true,
                                })}
                              >
                                {variantNameDisplay(carVariant.name).length <=
                                  35 &&
                                variantNameDisplay(carVariant.name).includes(
                                  '()',
                                )
                                  ? variantNameDisplay(carVariant.name).replace(
                                      '()',
                                      '',
                                    )
                                  : variantNameDisplay(carVariant.name)
                                      .length <= 35
                                  ? variantNameDisplay(carVariant.name)
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.row}
                        style={{ marginBottom: '24px', marginTop: '16px' }}
                        onClick={() => handleOpenPopup(carVariant, index)}
                        data-testid={elementId.PDP.List.VariantDetail}
                      >
                        <p className={styles.openSansLightBlue}>Lihat Detail</p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingTop: 16,
                      }}
                      onClick={() => handleOpenPopup(carVariant, index)}
                      data-testid={elementId.PDP.List.VariantPrice}
                    >
                      <div className={styles.variantPriceWrapper}>
                        <p className={styles.openSansSemiBoldBlack}>
                          {'Rp' +
                            replacePriceSeparatorByLocalization(
                              carVariant.priceValue,
                              LanguageCode.id,
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={styles.buttonPrimary}
                    onClick={() => {
                      isOTO
                        ? showLeadsForm(carVariant.name)
                        : navigateToCreditTab(carVariant, index)
                    }}
                    data-testid={elementId.PDP.List.CTAHitungKemampuan}
                  >
                    <p style={{ color: '#ffffff', fontSize: 12 }}>
                      {isOTO ? 'Saya Tertarik' : 'Hitung Kemampuan'}
                    </p>
                  </div>
                </div>
              </div>
            ))
            .sort((a: any, b: any) => a.priceValue - b.priceValue)
            .slice(0, expandHorizontal ? 100 : 5)
        ) : (
          <div className={styles.rowScrollHorizontal}>
            {carModelDetails.variants
              .map((carVariant: CarVariantRecommendation, index: number) => (
                <div
                  key={carVariant.id}
                  data-testid={elementId.PDP.Grid.VariantCard}
                >
                  <div className={styles.cardCarVariantList}>
                    <div className={styles.cardCarVariantInfoCenterContent}>
                      <div
                        className={styles.cardCarVariantInfo}
                        onClick={() => {
                          setViewVariant(carVariant)
                          onCardClick(carVariant)
                          trackCarVariantPricelistClick(
                            getDataForAmplitude(carVariant),
                          )
                        }}
                      >
                        <div
                          className={styles.rowCenterContent}
                          data-testid={elementId.PDP.Grid.VariantName}
                        >
                          <p className={styles.openSansBoldGrey}>
                            {topWordingNameDisplay(carVariant.name)}
                          </p>
                          <div className={styles.tooltip}>
                            {variantNameDisplay(carVariant.name).length >
                              30 && (
                              <div>
                                <p className={styles.openSansSemiBoldBlack}>
                                  {variantNameDisplay(carVariant.name).slice(
                                    0,
                                    30,
                                  ) + '...'}
                                </p>
                                <span
                                  className={styles.tooltiptext}
                                  onMouseOver={() => setOnHover(!onHover)}
                                >
                                  {variantNameDisplay(carVariant.name)}
                                </span>
                              </div>
                            )}
                            <p className={styles.openSansSemiBoldBlack}>
                              {variantNameDisplay(carVariant.name).length <=
                                30 &&
                              variantNameDisplay(carVariant.name).includes('()')
                                ? variantNameDisplay(carVariant.name).replace(
                                    '()',
                                    '',
                                  )
                                : variantNameDisplay(carVariant.name).length <=
                                  30
                                ? variantNameDisplay(carVariant.name)
                                : null}
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={() => handleOpenPopup(carVariant, index)}
                          className={styles.onClickWrapper}
                        >
                          <div
                            className={styles.rowCenterContent}
                            data-testid={elementId.PDP.Grid.VariantPrice}
                          >
                            <p className={styles.openSansSmall}>Harga</p>
                            <p className={styles.openSansSemiBoldBlack}>
                              {'Rp' +
                                replacePriceSeparatorByLocalization(
                                  carVariant.priceValue,
                                  LanguageCode.id,
                                )}
                            </p>
                          </div>
                          <div className={styles.rowCenterContentWithGap}>
                            <IconTransmission
                              color={'#246ED4'}
                              height={24}
                              width={24}
                              alt="SEVA Transmition gear Icon"
                            />
                            <p
                              className={styles.openSans}
                              style={{ color: '#13131B' }}
                            >
                              {carVariant.transmission}
                            </p>
                          </div>
                          <div className={styles.rowCenterContentWithGap}>
                            <IconFuel
                              color={'#246ED4'}
                              height={24}
                              width={24}
                              alt="SEVA Gas Station Icon"
                            />
                            <p
                              className={styles.openSans}
                              style={{ color: '#13131B' }}
                            >
                              {carVariant.fuelType}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.buttonPrimary}
                        onClick={() => {
                          isOTO
                            ? showLeadsForm(carVariant.name)
                            : navigateToCreditTab(carVariant, index)
                        }}
                        data-testid={elementId.PDP.Grid.CTAHitungKemampuan}
                      >
                        <p style={{ color: '#ffffff', fontSize: 12 }}>
                          {isOTO ? 'Saya Tertarik' : 'Hitung Kemampuan'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              .sort((a: any, b: any) => a.priceValue - b.priceValue)}
          </div>
        )}
        {carModelDetails.variants.length > 5 && !toggleHorizontal && (
          <div
            className={styles.row}
            style={{ gap: 4 }}
            onClick={() => {
              setExpandHorizontal(!expandHorizontal)
              if (expandHorizontal) {
                collapseRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                })
              }
            }}
          >
            <p className={styles.openSansLightBlue}>
              {!expandHorizontal ? 'Lihat Semua Varian' : 'Tutup'}
            </p>
            {!expandHorizontal ? (
              <IconChevronDown width={24} height={24} color={'#246ED4'} />
            ) : (
              <IconChevronUp width={24} height={24} color={'#246ED4'} />
            )}
          </div>
        )}
      </div>
      {isModalOpenend && (
        <AdaOTOdiSEVALeadsForm onCancel={closeLeadsForm} onPage="PDP" />
      )}
    </div>
  )
}

export default TabContentLowerVariant
