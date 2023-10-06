import { DownOutlined } from 'components/atoms'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useRef } from 'react'
import { api } from 'services/api'
import { useCar } from 'services/context/carContext'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { CarVariantRecommendation, CityOtrOption } from 'utils/types'
import { getCity } from 'utils/hooks/useGetCity'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'

interface SpecificationSelectProps {
  initialValue?: CarVariantRecommendation
  options: CarVariantRecommendation[]
  onChooseOption?: (item: CarVariantRecommendation) => void
  isTabCreditV2?: boolean
  setScrollToSpecification?: (value: boolean) => void
  setInitital?: (value: boolean) => void
  onVariantChange?: (value: boolean) => void
}

export const SpecificationSelect = ({
  initialValue,
  options,
  onChooseOption,
  isTabCreditV2 = false,
  setScrollToSpecification,
  onVariantChange,
}: SpecificationSelectProps) => {
  const router = useRouter()
  const initialOption =
    Array.isArray(options) && options.length > 0 ? options[0] : null
  const [selected, setSelected] = useState(initialOption)
  // const [isInitalValueEmpty, setIsInitalValueEmpty] = useState(false)
  const [showOption, setShowOption] = useState(false)
  const { saveCarVariantDetails } = useCar()
  const inputRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  useEffect(() => {
    if (initialValue) {
      setSelected(initialValue)
      getVarintDetail(initialValue.id)
    } else if (!router.query?.variant) {
      if (options?.length > 0) {
        onChooseOption && onChooseOption(options[0])
        getVarintDetail(options[0].id)
      }
    }
  }, [initialValue])

  useEffect(() => {
    if (showOption) {
      setScrollToSpecification && setScrollToSpecification(true)
    } else {
      setScrollToSpecification && setScrollToSpecification(false)
    }
  }, [showOption])

  const getCityParam = () => {
    return `?city=${getCity().cityCode}&cityId=${getCity().id}`
  }

  const getVarintDetail = async (optionId: string) => {
    api.getCarVariantDetails(optionId, getCityParam()).then((result3: any) => {
      if (result3.variantDetail.priceValue != null) {
        saveCarVariantDetails(result3)
      }
    })
  }
  const renderDropdown = () => {
    const dropdownComponent = (
      <StyledOptionArea>
        {options
          .sort(function (a, b) {
            return a.priceValue - b.priceValue
          })
          .map((option, index) => (
            <StyledOption
              key={index}
              isSelected={option.name === selected?.name}
              onMouseDown={() => {
                setSelected(option)
                getCarVariantDetailsById(option.id).then((result3) => {
                  if (result3.variantDetail.priceValue != null) {
                    saveCarVariantDetails(result3)
                  }
                })
                onChooseOption && onChooseOption(option)
                setShowOption(false)
                onVariantChange && onVariantChange(true)
              }}
              className={'select-item-element'}
            >
              {option.name}
            </StyledOption>
          ))}
      </StyledOptionArea>
    )
    return (
      <StyledFloatDropdown className={'select-item-group-element'}>
        {dropdownComponent}
      </StyledFloatDropdown>
    )
  }

  if (!selected) return <></>

  return (
    <Container onMouseLeave={() => setShowOption(false)}>
      <Selector ref={inputRef} onClick={() => setShowOption(!showOption)}>
        <SelectorTextWrapper>
          <ModelVariantText>{selected.name || ''}</ModelVariantText>
          <PriceText isTabCreditV2={isTabCreditV2}>
            Rp{' '}
            {replacePriceSeparatorByLocalization(
              selected.discount > 0
                ? selected.priceValue - selected.discount
                : selected.priceValue,
              LanguageCode.id,
            )}
            ,-
          </PriceText>
        </SelectorTextWrapper>
        <StyledIcon open={showOption}>
          <DownOutlined color={'#05256e'} width={14} height={14} />
        </StyledIcon>
      </Selector>
      {showOption && renderDropdown()}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`

const Selector = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 20px 14px 15px;
  border: 1.5px solid #e4e9f1;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  background: ${colors.white};

  @media (min-width: 1025px) {
    padding: 19px 20px 14px 25px;
    cursor: pointer;
  }
`

const SelectorTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const ModelVariantText = styled.span`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0px;

  font-size: 14px;
  color: ${colors.primaryDarkBlue};

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 19px;
  }
`

const PriceText = styled.span<{ isTabCreditV2: boolean }>`
  font-family: var(--kanyon-medium);
  font-size: 14px;
  line-height: 28px;
  color: ${({ isTabCreditV2 }) =>
    isTabCreditV2 ? '#404040' : colors.primaryDarkBlue};

  @media (min-width: 1025px) {
    font-size: 16px;
  }
`

export const StyledIcon = styled.div<{ open?: boolean }>`
  transition: all 0.3s ease-in-out;
  ${({ open }) => open && 'transform: rotate(180deg);'}
`

const StyledOptionArea = styled.div`
  width: 100%;
  max-height: 180px;
  overflow-y: scroll;
  overflow-x: hidden;
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  padding: 4px 0 13px;

  @media (min-width: 1025px) {
    border-radius: 10px;
    margin-top: 0;
    padding: 0 3px 13px 2px;

    div:first-child {
      margin-top: 12px;
    }
  }
`

const selectedStyle = css`
  background-color: rgba(203, 229, 244, 0.8);

  @media (min-width: 1025px) {
    background-color: rgba(238, 246, 251, 0.8);
  }
`

const StyledOption = styled.div<{ isSelected: boolean }>`
  font-family: var(--kanyon);
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;

  font-family: var(--kanyon-medium);
  height: 43px;
  width: 100%;
  :hover {
    ${selectedStyle}
  }
  color: ${colors.primaryDarkBlue};
  ${({ isSelected }) => isSelected && selectedStyle};
  flex-shrink: 0;
  padding: 5px 12px 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  :not(:last-child) {
    margin-bottom: 2px;
  }
  text-align: left;
  display: flex;
  align-items: center;

  @media (min-width: 1025px) {
    height: auto;
    padding: 13px 32px 10px;
    cursor: pointer;
  }
`

const StyledFloatDropdown = styled.div`
  position: absolute;
  background: ${colors.white};
  border: 1.5px solid #e4e9f1;
  border-radius: 10px;
  margin-top: 4px;
  width: 100%;
  z-index: 2;
`
