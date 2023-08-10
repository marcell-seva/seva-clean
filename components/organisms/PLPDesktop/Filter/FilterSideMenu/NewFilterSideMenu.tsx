import React, { useCallback, useRef, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Image from 'next/image'
import { colors } from 'styles/colors'
import { Line } from 'components/atoms/Line'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { getNewFunnelRecommendations } from 'services/newFunnel'
import { AxiosResponse } from 'axios'
import { carResultsUrl } from 'utils/helpers/routes'
import { trackFilterCarResults } from 'helpers/amplitude/newFunnelEventTracking'
import { removeWhitespaces, toNumber } from 'utils/stringUtils'
import {
  trackAgeTooltipCloseClick,
  trackAgeTooltipPrevClick,
  trackFilterAgeTooltipClick,
  trackFilterIncomeTooltipClick,
  trackIncomeTooltipCloseClick,
  trackIncomeTooltipNextClick,
  trackPLPClearFilter,
  trackPLPSubmitFilter,
} from 'helpers/amplitude/seva20Tracking'
import { jt, Rp } from 'utils/helpers/const'
import debounce from 'lodash.debounce'
import elementId from 'helpers/elementIds'
import { DownPaymentType } from 'utils/enum'
import { CarRecommendationResponse, CheckboxItemType } from 'utils/types/utils'
import { TextLegalRegular } from 'utils/typography/TextLegalRegular'
import {
  TextLegalMedium,
  TextLegalMediumStyle,
} from 'utils/typography/TextLegalMedium'
import { DownOutlined } from 'components/atoms'
import { useRouter } from 'next/router'
import { useCarResultParameter } from 'utils/hooks/useAmplitudePageView/useAmplitudePageView'
import {
  downPaymentConfig,
  newDownPaymentConfig,
} from 'config/downPaymentAmount.config'
import { ageFormConfig } from 'config/ageFormConfig'
import { ButtonType, Button, rotate } from 'components/atoms/ButtonOld/Button'
import { LinkLabelSmallSemiBold } from 'utils/typography/LinkLabelSmallSemiBold'
import { CarButtonProps } from 'utils/types/context'
import { IconInfoSmall } from 'components/atoms/icon/InfoSmall'
import { useCar } from 'services/context/carContext'

const LogoToyota = '/revamp/icon/toyota-1989.png'
const LogoDaihatsu = '/revamp/icon/daihatsu-update.png'
const Isuzu = '/revamp/icon/Isuzu-new.png'
const LogoBmw = '/revamp/icon/logo-bmw.webp'
const Peugeot = '/revamp/icon/peugeot.png'

const IconTypeSuv = '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_SUV.png'
const IconTypeSport = '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_Sport.png'
const IconTypeSedan = '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_Sedan.png'
const IconTypeMpv = '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_MPV.png'
const IconTypeHatchback =
  '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_Hatchback.png'

export const sortOptions = [
  {
    value: 'lowToHigh',
    label: 'Terendah ke Tertinggi',
  },
  {
    value: 'highToLow',
    label: 'Tertinggi ke Terendah',
  },
]

export const incomeOptions = [
  { label: '< Rp 2 juta', value: '<2M' },
  { label: 'Rp 2-4 juta', value: '2M-4M' },
  { label: 'Rp 4-6 juta', value: '4M-6M' },
  { label: 'Rp 6-8 juta', value: '6M-8M' },
  { label: 'Rp 8-10 juta', value: '8M-10M' },
  { label: 'Rp 10-20 juta', value: '10M-20M' },
  { label: 'Rp 20-50 juta', value: '20M-50M' },
  { label: 'Rp 50-75 juta', value: '50M-75M' },
  { label: 'Rp 75-100 juta', value: '75M-100M' },
  { label: 'Rp 100-150 juta', value: '100M-150M' },
  { label: 'Rp 150-200 juta', value: '150M-200M' },
  { label: '> Rp 200 juta', value: '>200M' },
]
interface incomeOptionsType {
  label: string
  value: string
}

export const NewFilterSideMenu = () => {
  const router = useRouter()
  const {
    funnelQuery,
    // setFunnelQuery,
    patchFunnelQuery,
    clearQueryFilter: clearFunnelQuery,
  } = useFunnelQueryData()
  const [openBodyType, setOpenBodyType] = useState(true)
  const [openDpOption, setOpenDpOption] = useState(true)
  const [openIncomeOption, setOpenIncomeOption] = useState(true)
  const [openAgeOption, setOpenAgeOption] = useState(true)
  const [openSortOption, setOpenSortOption] = useState(true)
  const [downPaymentAmount, setDownPaymentAmount] = useState(
    funnelQuery.downPaymentAmount,
  )
  const [incomeAmount, setIncomeAmount] = useState(funnelQuery.monthlyIncome)
  const [ageValue, setAgeValue] = useState(funnelQuery.age)
  const [sortBy, setSortBy] = useState(funnelQuery.sortBy)
  const carResultParameters = useCarResultParameter()
  const [isOptionMandatory, setIsOptionMandatory] = useState(false)
  const { saveRecommendation } = useCar()
  const [isCheckedType, setIsCheckedType] = useState<string[]>(
    funnelQuery.bodyType ? funnelQuery.bodyType : [],
  )

  const [isCheckedBrand, setIsCheckedGroups] = useState<string[]>(
    funnelQuery.brand ? funnelQuery.brand : [],
  )
  const [hover, setHover] = useState(false)
  const [incomeTooltip, setIncomeTooltip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tenureFilter, setTenureFilter] = useState(funnelQuery.tenure)
  const [isAlreadyTrackTooltipIncome, setIsAlreadyTrackTooltipIncome] =
    useState(false)
  const [isAlreadyTrackTooltipAge, setIsAlreadyTrackTooltipAge] =
    useState(false)

  const handleDebounceTrackTooltipIncome = () => {
    trackFilterIncomeTooltipClick()
    setIsAlreadyTrackTooltipIncome(true)
  }

  const debounceTrackTooltipIncome = useCallback(
    debounce(handleDebounceTrackTooltipIncome, 1000),
    [],
  )

  const handleDebounceTrackTooltipAge = () => {
    trackFilterAgeTooltipClick()
    setIsAlreadyTrackTooltipAge(true)
  }

  const debounceTrackTooltipAge = useCallback(
    debounce(handleDebounceTrackTooltipAge, 1000),
    [],
  )

  const onHoverIncome = () => {
    if (!isAlreadyTrackTooltipIncome) {
      // use debounce because set state is async
      debounceTrackTooltipIncome()
    }
    setHover(true)
    setIncomeTooltip(true)
  }

  const onHoverAge = () => {
    if (!isAlreadyTrackTooltipAge) {
      // use debounce because set state is async
      debounceTrackTooltipAge()
    }
    setHover(true)
    setIncomeTooltip(false)
  }

  const goToAgeOption = useRef<null | HTMLDivElement>(null)
  const scrollToSectionIncome = () => {
    goToAgeOption.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const goToIncomeOption = useRef<null | HTMLDivElement>(null)
  const scrollToSectionAge = () => {
    goToIncomeOption.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const paramQuery = funnelQuery

  const carList: CarButtonProps[] = [
    {
      key: 'Toyota',
      icon: <Image src={LogoToyota} alt="Toyota" width={48} height={41} />,
      value: 'Toyota',
      isChecked: isCheckedBrand.includes('Toyota'),
    },
    {
      key: 'Daihatsu',
      icon: (
        <Image src={LogoDaihatsu} alt="Daihatsu" width={48} height={32.45} />
      ),
      value: 'Daihatsu',
      isChecked: isCheckedBrand.includes('Daihatsu'),
    },
    {
      key: 'Isuzu',
      icon: <Image src={Isuzu} alt="Isuzu" width={52} height={23} />,
      value: 'Isuzu',
      isChecked: isCheckedBrand.includes('Isuzu'),
    },
    {
      key: 'BMW',
      icon: <Image src={LogoBmw} alt="BMW" width={40} height={40} />,
      value: 'BMW',
      isChecked: isCheckedBrand.includes('BMW'),
    },
    {
      key: 'Peugeot',
      icon: <Image src={Peugeot} alt="Peugeot" width={40} height={44} />,
      value: 'Peugeot',
      isChecked: isCheckedBrand.includes('Peugeot'),
    },
  ]
  const bodyTypes: CarButtonProps[] = [
    {
      key: 'MPV',
      icon: <Image src={IconTypeMpv} alt="MPV" width="50" height="30" />,
      value: 'MPV',
      isChecked: isCheckedType.includes('MPV'),
    },
    {
      key: 'Sedan',
      icon: <Image src={IconTypeSedan} alt="SEDAN" width="50" height="30" />,
      value: 'SEDAN',
      isChecked: isCheckedType.includes('SEDAN'),
    },
    {
      key: 'SUV',
      icon: <Image src={IconTypeSuv} alt="SUV" width="50" height="30" />,
      value: 'SUV',
      isChecked: isCheckedType.includes('SUV'),
    },
    {
      key: 'Hatchback',
      icon: (
        <Image src={IconTypeHatchback} alt="Hatchback" width="50" height="30" />
      ),
      value: 'HATCHBACK',
      isChecked: isCheckedType.includes('HATCHBACK'),
    },
    {
      key: 'Sport',
      icon: <Image src={IconTypeSport} alt="Sport" width="50" height="30" />,
      value: 'SPORT',
      isChecked: isCheckedType.includes('SPORT'),
    },
  ]
  const handleClickBodyType = () => setOpenBodyType(!openBodyType)

  const handleClickDpOption = () => setOpenDpOption(!openDpOption)
  const handleClickIncomeOption = () => setOpenIncomeOption(!openIncomeOption)

  const handleClickAgeOption = () => setOpenAgeOption(!openAgeOption)
  const handleClickSortOption = () => setOpenSortOption(!openSortOption)
  const handleSuccess = async (response) => {
    patchFunnelQuery({
      age: ageValue,
      downPaymentType: DownPaymentType.DownPaymentAmount,
      downPaymentAmount: downPaymentAmount,
      monthlyIncome: incomeAmount,
      bodyType: isCheckedType.length > 0 ? isCheckedType : [],
      sortBy: sortBy,
      brand: isCheckedBrand.length > 0 ? isCheckedBrand : [],
      tenure: tenureFilter,
    })
    saveRecommendation(response.carRecommendations || [])
  }

  const handleError = (errorCode: number) => {
    if (errorCode === 500) {
      saveRecommendation([])
    } else {
      saveRecommendation([])
    }
  }

  const getDataForAmplitude = () => {
    const dpLabel = downPaymentConfig.options.filter(
      (item: any) => item.value === downPaymentAmount,
    )
    const incomeLabel = incomeOptions.filter(
      (item) => item.value === incomeAmount,
    )

    return {
      Sort:
        sortBy === 'highToLow'
          ? 'Tertinggi ke Terendah'
          : 'Terendah ke Tertinggi',
      Car_Brand:
        isCheckedBrand.length > 0
          ? isCheckedBrand.toString().replaceAll(',', ', ')
          : null,
      Car_Body_Type:
        isCheckedType.length > 0
          ? isCheckedType.toString().replaceAll(',', ', ')
          : null,
      DP: downPaymentAmount
        ? removeWhitespaces(
            dpLabel[0].label.replace(`${Rp}`, '').replace(`${jt}`, '').trim(),
          )
        : null,
      Tenure: tenureFilter ? String(tenureFilter) : '5',
      Income: incomeAmount
        ? removeWhitespaces(
            incomeLabel[0].label
              .replace(`${Rp}`, '')
              .replace('juta', '')
              .trim(),
          )
        : null,
      Age: ageValue ? String(ageValue) : null,
    }
  }

  const resetFilter = () => {
    trackPLPClearFilter(getDataForAmplitude())
    setIncomeAmount('')
    setDownPaymentAmount('')
    setAgeValue('')
    setIsCheckedType([])
    setIsCheckedGroups([])
    setTenureFilter(5)
    setIsOptionMandatory(false)
    setSortBy('highToLow')
    clearFunnelQuery()
    router.replace({ pathname: carResultsUrl, search: '' })
  }

  const onSubmitSearch = () => {
    trackPLPSubmitFilter(getDataForAmplitude())
    if (
      (incomeAmount && incomeAmount.toString().length > 0 && !ageValue) ||
      (!incomeAmount && ageValue && ageValue.toString().length > 0)
    ) {
      setIsOptionMandatory(true)
      return
    }

    const filterCarResult = {
      maxMonthlyInstallments: toNumber(
        funnelQuery.monthlyInstallment as string,
      ),
      downPayment: toNumber(funnelQuery.downPaymentAmount as string),
      downPaymentPercentage: funnelQuery.downPaymentPercentage
        ? Number(funnelQuery.downPaymentPercentage) / 100
        : null,
      brands: funnelQuery.brand ? funnelQuery.brand : [],
      ...carResultParameters,
      tenure: tenureFilter,
    }
    trackFilterCarResults(filterCarResult)
    setLoading(true)
    getNewFunnelRecommendations(paramQuery)
      .then((response) => {
        handleSuccess(response)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        handleError(e.response.status)
      })
  }

  const onClickBrand = (key: string) => {
    if (isCheckedBrand.includes(key)) {
      setIsCheckedGroups(isCheckedBrand.filter((item) => item !== key))
      paramQuery.brand = isCheckedBrand.filter((item) => item !== key)
    } else {
      setIsCheckedGroups(isCheckedBrand.concat(key))
      paramQuery.brand = isCheckedBrand.concat(key)
    }
  }
  const onClickCarType = (key: string) => {
    if (isCheckedType.includes(key)) {
      setIsCheckedType(isCheckedType.filter((item) => item !== key))
      paramQuery.bodyType = isCheckedType.filter((item) => item !== key)
    } else {
      setIsCheckedType(isCheckedType.concat(key))
      paramQuery.bodyType = isCheckedType.concat(key)
    }
  }
  const renderBodyTypeOption = () => {
    return bodyTypes.map(({ value, key, icon }: CarButtonProps) => {
      //value
      return (
        <StyledCarButton
          data-testid={elementId.FilterTypeCar + key}
          key={value}
          onClick={() => onClickCarType(value)}
          isChecked={
            funnelQuery.bodyType
              ? funnelQuery.bodyType.includes(value)
              : isCheckedType.includes(value)
          }
        >
          <StyledIcon>{icon}</StyledIcon>
          <StyledTextType>{key}</StyledTextType>
          {/* <StyledText>{value}</StyledText> */}
        </StyledCarButton>
      )
    })
  }
  const renderDownpaymentOption = () => {
    return newDownPaymentConfig.options.map(
      ({ value, label }: CheckboxItemType) => {
        //value
        return (
          <RadioBoxContainer key={value}>
            <RadioBox
              data-testid={elementId.FilterMaxDP + value}
              isSelected={
                funnelQuery.downPaymentAmount
                  ? funnelQuery.downPaymentAmount === value
                  : downPaymentAmount === value
              }
              onClick={() => {
                setDownPaymentAmount(value)
                paramQuery.downPaymentAmount = value
                paramQuery.downPaymentType = DownPaymentType.DownPaymentAmount
              }}
            />
            <RadioBoxText>{label}</RadioBoxText>
          </RadioBoxContainer>
        )
      },
    )
  }

  const renderIncomeOption = () => {
    return incomeOptions.map(({ value, label }: incomeOptionsType) => {
      //value
      return (
        <RadioBoxContainer key={value}>
          <RadioBox
            data-testid={elementId.FilterIncomeRate + label}
            isSelected={
              funnelQuery.monthlyIncome
                ? funnelQuery.monthlyIncome === value
                : incomeAmount === value
            }
            onClick={() => {
              setIncomeAmount(value)
              paramQuery.monthlyIncome = value
            }}
          />
          <RadioBoxText>{label}</RadioBoxText>
        </RadioBoxContainer>
      )
    })
  }

  const renderAgeOption = () => {
    return ageFormConfig.options.map(({ value, label }: incomeOptionsType) => {
      return (
        <RadioBoxContainer key={value}>
          <RadioBox
            data-testid={elementId.FilterAgeRate + value}
            isSelected={ageValue === value}
            onClick={() => {
              setAgeValue(value)
              paramQuery.age = value
            }}
          />
          <RadioBoxText>{label} tahun</RadioBoxText>
        </RadioBoxContainer>
      )
    })
  }

  const renderSortOption = () => {
    return sortOptions
      .map(({ value, label }: incomeOptionsType) => {
        //value
        return (
          <RadioBoxContainer key={value}>
            <RadioBox
              data-testid={elementId.FilterPriceRange + label}
              isSelected={sortBy === value}
              onClick={() => {
                setSortBy(value)
                paramQuery.sortBy = value
              }}
            />
            <RadioBoxText>{label}</RadioBoxText>
          </RadioBoxContainer>
        )
      })
      .reverse()
  }

  const renderCarButton = () => {
    return carList.map(({ key, icon, value }) => {
      //value
      return (
        <StyledCarBrandButton
          data-testid={elementId.FilterBrand + key}
          key={key}
          onClick={() => onClickBrand(key)}
          isChecked={
            funnelQuery.brand
              ? funnelQuery.brand.includes(value)
              : isCheckedBrand.includes(value)
          }
        >
          <StyledIcon>{icon}</StyledIcon>
          {/* <StyledText>{value}</StyledText> */}
        </StyledCarBrandButton>
      )
    })
  }
  const changeTooltip = () => {
    setIncomeTooltip(!incomeTooltip)
    if (incomeTooltip) {
      scrollToSectionIncome()
    } else {
      scrollToSectionAge()
    }
  }

  const closeTooltip = () => {
    setHover(false)
  }
  const renderToolTipText = () => {
    if (incomeTooltip) {
      return (
        <>
          <StyledHeadTooltip>
            <StyledTextHoverTitle>
              Informasi Finansial: Kisaran Pendapatan
            </StyledTextHoverTitle>
            <StyledTextHoverTitleNumber>1/2</StyledTextHoverTitleNumber>
          </StyledHeadTooltip>
          <StyledTextHoverWrapper>
            <StyledTextHoverDescription>
              Lengkapi data finansialmu untuk mengetahui peluang kredit mobil
              impianmu.
            </StyledTextHoverDescription>
          </StyledTextHoverWrapper>
          <StyledFooterTooltip>
            <StyledButtonHover
              onClick={() => {
                trackIncomeTooltipNextClick()
                changeTooltip()
              }}
            >
              Berikutnya
            </StyledButtonHover>
            <StyledTextHoverFooterText
              onClick={() => {
                trackIncomeTooltipCloseClick()
                closeTooltip()
              }}
            >
              OK, mengerti
            </StyledTextHoverFooterText>
          </StyledFooterTooltip>
        </>
      )
    } else {
      return (
        <>
          <StyledHeadTooltip>
            <StyledTextHoverTitle>
              Informasi Finansial: Usia
            </StyledTextHoverTitle>
            <StyledTextHoverTitleNumber>2/2</StyledTextHoverTitleNumber>
          </StyledHeadTooltip>
          <StyledTextHoverWrapper>
            <StyledTextHoverDescription>
              Lengkapi usiamu untuk mengetahui peluang kredit mobil impianmu.
            </StyledTextHoverDescription>
          </StyledTextHoverWrapper>
          <StyledFooterTooltip>
            <StyledButtonHover
              onClick={() => {
                trackAgeTooltipPrevClick()
                changeTooltip()
              }}
            >
              Sebelumnya
            </StyledButtonHover>
            <StyledTextHoverFooterText
              onClick={() => {
                trackAgeTooltipCloseClick()
                closeTooltip()
              }}
            >
              OK, mengerti
            </StyledTextHoverFooterText>
          </StyledFooterTooltip>
        </>
      )
    }
  }

  useEffect(() => {
    setTenureFilter(funnelQuery.tenure)
    setDownPaymentAmount(funnelQuery.downPaymentAmount)
    setIncomeAmount(funnelQuery.monthlyIncome)
    setAgeValue(funnelQuery.age)
    setSortBy(funnelQuery.sortBy)
    setIsCheckedGroups(funnelQuery.brand || [])
    setIsCheckedType(funnelQuery.bodyType || [])
  }, [funnelQuery])

  return (
    <Wrapper>
      <Container>
        <StyledHeader>
          <StyledTitle>Atur Pencarianmu</StyledTitle>
        </StyledHeader>{' '}
        <>
          <StyledTitleBrand>{'Merek'}</StyledTitleBrand>
          <StyledCarButtons>{renderCarButton()}</StyledCarButtons>
        </>
        <Line width={'100%'} height={'1px'} background={colors.line} />
        <StlyedWrapperSubText>
          <StyledTextIcon>
            <StyledSubTitleDownpayment>Tipe Mobil</StyledSubTitleDownpayment>
          </StyledTextIcon>

          <StyledIconWrapper open={openBodyType} onClick={handleClickBodyType}>
            <DownOutlined width={6.96} height={13.93} color={colors.body2} />
          </StyledIconWrapper>
        </StlyedWrapperSubText>
        {openBodyType && (
          <StyledBodyTypesWrapper>
            {renderBodyTypeOption()}
          </StyledBodyTypesWrapper>
        )}
        <SpacingTenor />
        <Line width={'100%'} height={'1px'} background={colors.line} />
        <StyledSubTitle>Tenor</StyledSubTitle>
        <StyledTenureWrapper>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <TenureBlock
              key={index}
              selected={tenureFilter ? item === tenureFilter : item === 5}
              onClick={() => {
                setTenureFilter(item)
              }}
            >
              {item}
            </TenureBlock>
          ))}
          <TenureTextFilterCarResults>tahun</TenureTextFilterCarResults>
        </StyledTenureWrapper>
        <SpacingTenor />
        <Line width={'100%'} height={'1px'} background={colors.line} />
        <StlyedWrapperSubText>
          <StyledTextIcon>
            <StyledSubTitleDownpayment>Maksimum DP</StyledSubTitleDownpayment>
          </StyledTextIcon>
          <StyledIconWrapper open={openDpOption} onClick={handleClickDpOption}>
            <DownOutlined width={6.96} height={13.93} color={colors.body2} />
          </StyledIconWrapper>
        </StlyedWrapperSubText>
        <div ref={goToIncomeOption}></div>
        {openDpOption && (
          <StyledRadioButtonWrapper>
            {renderDownpaymentOption()}
          </StyledRadioButtonWrapper>
        )}
        <SpacingTenor />
        <Line width={'100%'} height={'1px'} background={colors.line} />
        <StlyedWrapperSubText id="filter-side-menu-income">
          <StyledTextIcon>
            <StyledSubTitleDownpayment>
              Kisaran Pendapatan
            </StyledSubTitleDownpayment>
            <TooltipText onMouseOver={onHoverIncome}>
              <IconInfoSmall />
            </TooltipText>
          </StyledTextIcon>
          {hover && incomeTooltip ? (
            <TooltipCard>
              <TooltipBox incomeTooltip={incomeTooltip}>
                {renderToolTipText()}
              </TooltipBox>
            </TooltipCard>
          ) : null}
          <StyledIconWrapper
            open={openIncomeOption}
            onClick={handleClickIncomeOption}
          >
            <DownOutlined width={6.96} height={13.93} color={colors.body2} />
          </StyledIconWrapper>
        </StlyedWrapperSubText>
        <div ref={goToAgeOption}></div>
        {openIncomeOption && (
          <StyledRadioButtonWrapper>
            {renderIncomeOption()}
          </StyledRadioButtonWrapper>
        )}
        {isOptionMandatory && !incomeAmount && (
          <MandatoryText>*Wajib diisi</MandatoryText>
        )}
        <SpacingTenor />
        <Line width={'100%'} height={'1px'} background={colors.line} />
        <StlyedWrapperSubText>
          <StyledTextIcon>
            <StyledSubTitleDownpayment>Usia</StyledSubTitleDownpayment>
            <TooltipText onMouseOver={onHoverAge}>
              <IconInfoSmall />
            </TooltipText>
          </StyledTextIcon>
          {hover && !incomeTooltip ? (
            <TooltipCard>
              <TooltipBox incomeTooltip={incomeTooltip}>
                {renderToolTipText()}
              </TooltipBox>
            </TooltipCard>
          ) : null}

          <StyledIconWrapper
            open={openAgeOption}
            onClick={handleClickAgeOption}
          >
            <DownOutlined width={6.96} height={13.93} color={colors.body2} />
          </StyledIconWrapper>
        </StlyedWrapperSubText>
        {openAgeOption && (
          <StyledRadioButtonWrapper>
            {renderAgeOption()}
          </StyledRadioButtonWrapper>
        )}
        {isOptionMandatory && !ageValue && (
          <MandatoryText>*Wajib diisi</MandatoryText>
        )}
        <SpacingTenor />
        <Line width={'100%'} height={'1px'} background={colors.line} />
        <StlyedWrapperSubText>
          <StyledTextIcon>
            <StyledSubTitleDownpayment>Urutkan Harga</StyledSubTitleDownpayment>
          </StyledTextIcon>

          <StyledIconWrapper
            open={openSortOption}
            onClick={handleClickSortOption}
          >
            <DownOutlined width={6.96} height={13.93} color={colors.body2} />
          </StyledIconWrapper>
        </StlyedWrapperSubText>
        {openSortOption && (
          <StyledRadioButtonWrapper>
            {renderSortOption()}
          </StyledRadioButtonWrapper>
        )}
        <SpacingTenor />
        <StyledButtonWrapper>
          <StyledButton
            data-testid={elementId.FilterButton.Submit}
            buttonType={ButtonType.primary1}
            loading={loading}
            onClick={onSubmitSearch}
          >
            Terapkan
          </StyledButton>
        </StyledButtonWrapper>
        <StyledResetWrapper>
          <StyledReset
            data-testid={elementId.FilterButton.Delete}
            onClick={resetFilter}
          >
            Hapus Filter
          </StyledReset>
        </StyledResetWrapper>
        {/* HIDE FOR TEMPORARY */}
        {/* <FilterBody isSideMenuFilter={true} />
      <Line width={'100%'} height={'1px'} background={colors.line} /> */}
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 270px;
  display: flex;
  flex-direction: column;
  max-width: 336px;
  background-color: ${colors.offWhite};

  @media (max-width: 1024px) {
    width: 25vw;
  }
`

const Container = styled.div`
  max-width: 272px;
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 23px;
`

const StyledTitle = styled.h2`
  font-family: 'KanyonBold';
  margin-top: 30px;
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0px;
`

const StyledResetWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  cursor: pointer;
`
const StyledReset = styled.div`
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: #246ed4;
`
const StyledSubTitle = styled.div`
  margin-top: 16px;
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: #000000;
`

const StyledSubTitleDownpayment = styled.div`
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: #000000;
  margin-right: 4px;
`
const SpacingTenor = styled.div`
  margin-bottom: 16px;
`

const StlyedWrapperSubText = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding-right: 8px;
  justify-content: space-between;
`

const StyledIconWrapper = styled.div<{ open: boolean }>`
  ${({ open }) => open && rotate}
  transition: transform 150ms ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
`
const StyledTextIcon = styled.div`
  display: flex;
`

const RadioBox = styled.div<{ isSelected?: boolean; disable?: boolean }>`
  border-radius: 50%;
  height: 24px;
  width: 24px;
  border: ${({ isSelected }) => (isSelected ? `6px ` : '1.5px')} solid
    ${({ isSelected }) => (isSelected ? colors.primaryDarkBlue : '#E4E9F1')};
  ${({ isSelected }) => isSelected && `background-color: ${colors.white};`}
`
const RadioBoxText = styled(TextLegalMedium)`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  color: #52627a;
  margin-left: 10px;
`
const StyledBodyTypesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 0fr);
  gap: 8px;
  margin-top: 8px;
`
const StyledRadioButtonWrapper = styled.div`
  display: flex;
  margin-top: 9px;
  flex-direction: column;
`
const RadioBoxContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`

const StyledButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 4px;
  font-size: 14px;
`
const StyledButtonWrapper = styled.div`
  margin-top: 18px;

  width: 248px;
  @media (max-width: 1024px) {
    margin-right: 23px;
  }
`

const StyledIcon = styled.div`
  /* margin: 20px 16px; */
`
const StyledTextType = styled(TextLegalMedium)`
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #404040;
`
const StyledTitleBrand = styled(LinkLabelSmallSemiBold)`
  font-family: 'KanyonMedium';
  letter-spacing: 0px;
  color: ${colors.title};
  font-size: 14px;
  display: block;
  margin-top: 23px;
  margin-bottom: 10px;
  font-weight: 500;
  line-height: 20px;
`

const StyledCarButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 0fr);
  gap: 8px 16px;
  margin-top: 8px;
  margin: 0 0 30px;
  @media (max-width: 1024px) {
    justify-content: space-between;
    margin-right: 20px;
  }
`
const StyledCarButton = styled.div<{ isChecked: boolean }>`
  @media (min-width: 1025px) {
    width: 120px;
    height: 64px;
    margin-right: 0px;
  }

  width: 104px;
  height: 64px;
  border-radius: 4px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ isChecked }) =>
    isChecked
      ? css`
          border: 1px solid ${colors.primary1};
        `
      : css`
          background: ${colors.white};
          border: 1px solid ${colors.line};
        `}
`

const StyledCarBrandButton = styled.div<{ isChecked: boolean }>`
  @media (min-width: 1025px) {
    width: 72px;
    height: 64px;
    margin-right: 0px;
  }

  width: 104px;
  height: 64px;
  border-radius: 4px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ isChecked }) =>
    isChecked
      ? css`
          border: 1px solid ${colors.primary1};
        `
      : css`
          background: ${colors.white};
          border: 1px solid ${colors.line};
        `}
`

const TooltipText = styled.div`
  width: auto;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
`
const TooltipBox = styled.div<{ incomeTooltip: boolean }>`
  position: absolute;
  top: ${({ incomeTooltip }) =>
    incomeTooltip ? `calc(100% - 30px)` : 'calc(100% - 28px);'};
  right: ${({ incomeTooltip }) => (incomeTooltip ? `-300px` : `-295px`)};
  display: block;
  color: #eef6fb;
  background: #eef6fb;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  width: 321px;
  z-index: 99;
  padding: 14px;
  border-radius: 12px;
  &:before {
    content: '';
    width: 0;
    height: 0;
    right: 20px;
    left: -8px;
    top: 20px;
    position: absolute;
    background-color: #eef6fb;
    border: 10px solid #eef6fb;
    transform: rotate(135deg);
  }
  @media (max-width: 1024px) {
    top: calc(100% - 28px);
  }
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
const StyledHeadTooltip = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledFooterTooltip = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  align-items: center;
`

const StyledButtonHover = styled.button`
  background: ${colors.white};
  border: 2px solid #246ed4;
  width: 40%;
  height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
  text-align: right;
  color: #246ed4;
`
const StyledTextHoverFooterText = styled.button`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
  color: #404040;
  border: none;
  cursor: pointer;
`
const StyledTextHoverTitle = styled(TextLegalRegular)`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  width: 70%;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0px;
  color: #404040;
`
const StyledTextHoverWrapper = styled.div`
  margin-top: 10px;
`
const StyledTextHoverTitleNumber = styled(TextLegalRegular)`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;

  color: #404040;
`
const StyledTextHoverDescription = styled(TextLegalRegular)`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;

  color: #404040;
`
const StyledIconImg = styled.img``

const StyledTenureWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  margin: 6px 9px 8px 0;
`

const TenureBlock = styled.div<{ selected?: boolean }>`
  background-color: ${colors.inputBg};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  width: 32px;
  border: ${({ selected }) => (selected ? '0.5px' : 0)} solid
    ${colors.primaryDarkBlue};

  ${TextLegalMediumStyle}
  line-height: 22px;
  color: ${colors.label};
  cursor: pointer;

  @media (min-width: 1025px) {
    font-weight: 400;
  }
`

const TenureTextFilterCarResults = styled.span`
  ${TextLegalMediumStyle}
  color: ${colors.body2};
  margin-left: 7px;

  @media (min-width: 1025px) {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    font-family: 'OpenSans';
    color: #000000;
  }
`

const MandatoryText = styled.span`
  margin-top: 4px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 14px;
  color: #d83130;
  text-align: left;

  @media (min-width: 1025px) {
    font-size: 10px;
  }
`
