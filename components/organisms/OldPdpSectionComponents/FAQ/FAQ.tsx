import { million, ten } from 'utils/helpers/const'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import {
  CarVariantFAQParam,
  trackFAQExpandClick,
} from 'helpers/amplitude/seva20Tracking'
import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { getModelPriceRange } from 'utils/carModelUtils/carModelUtils'
import { StyledIcon } from '../SpecificationSelect/SpecificationSelect'
import { CarModelDetailsResponse, CarRecommendation } from 'utils/types'
import { LanguageCode } from 'utils/enum'
import { DownOutlined } from 'components/atoms'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import {
  formatPriceNumber,
  formatPriceNumberThousandDivisor,
} from 'utils/numberUtils/numberUtils'

type FAQProps = {
  carModel: CarModelDetailsResponse
  recommendationsModel: CarRecommendation
}

export const formatShortPrice = (price: number) => {
  return formatNumberByLocalization(price, LanguageCode.id, million, ten)
}
export const FAQ = ({ recommendationsModel, carModel }: FAQProps) => {
  const [collIndex, setCollIndex] = useState<number[]>([-1]) //collection index
  const [expandItem, setExpandItem] = useState<number[]>([-1]) //collection expand item
  const [expandList, setExpandList] = useState(false) //expand "lihat pertanyaan lainnya"
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  const sortVariants = carModel.variants.sort(
    (a, b) => a.priceValue - b.priceValue,
  )

  const { highestAssetPrice, lowestAssetPrice } = recommendationsModel

  const highLowPrice = {
    highestAssetPrice,
    lowestAssetPrice,
  }

  const formatLowestPrice = formatPriceNumber(lowestAssetPrice)

  const priceRange =
    highestAssetPrice === lowestAssetPrice
      ? formatLowestPrice >= 1000
        ? formatPriceNumberThousandDivisor(formatLowestPrice, LanguageCode.id)
        : formatLowestPrice
      : getModelPriceRange(highLowPrice, LanguageCode.id)

  const listFaq = [
    {
      question: `Berapa Cicilan / Kredit Bulanan ${carModel.brand} ${carModel.model} Terendah?`,
      answer: ` Cicilan / kredit bulanan terendah untuk ${carModel.brand} ${
        carModel.model
      } dimulai dari Rp ${formatShortPrice(lowestAssetPrice || 0)} juta untuk ${
        carModel.variants[0].tenure * 12
      } bulan dengan DP Rp ${formatShortPrice(sortVariants[0].dpAmount)} juta.`,
    },
    {
      question: `Berapa Harga ${carModel.brand} ${carModel.model}?`,
      answer: `Harga ${carModel.brand} ${carModel.model} dimulai dari kisaran harga Rp ${priceRange} juta.`,
    },
    {
      question: `Berapa Panjang Mobil ${carModel.brand} ${carModel.model}?`,
      answer: `Panjang dimensi ${carModel.brand} ${carModel.model} adalah ${recommendationsModel.length} mm dan lebarnya ${recommendationsModel.width} mm, dan tinggi ${recommendationsModel.height} mm.`,
    },
  ]

  const trackExpandFaq = (order: string) => {
    const trackProperties: CarVariantFAQParam = {
      Car_Brand: recommendationsModel.brand,
      Car_Model: recommendationsModel.model,
      FAQ_Order: order,
    }
    trackFAQExpandClick(
      TrackingEventName.WEB_PDP_FAQ_CLICK_EXPAND,
      trackProperties,
    )
  }

  const trackCloseFaq = (order: string) => {
    const trackProperties: CarVariantFAQParam = {
      Car_Brand: recommendationsModel.brand,
      Car_Model: recommendationsModel.model,
      FAQ_Order: order,
    }
    trackFAQExpandClick(
      TrackingEventName.WEB_PDP_FAQ_CLICK_CLOSE,
      trackProperties,
    )
  }

  const onChooseItem = (index: number) => {
    if (collIndex.includes(index)) {
      const removeItem = collIndex.filter((item) => item !== index)
      setCollIndex([...removeItem])
      trackCloseFaq(String(index + 1))
      return setTimeout(() => {
        setExpandItem([...removeItem])
      }, 450)
    }

    setCollIndex([...collIndex, index])
    setExpandItem([...expandItem, index])
    trackExpandFaq(String(index + 1))
  }

  return (
    <Container>
      <Wrapper>
        {listFaq.slice(0, 5).map((item, index) => (
          <BoxFQ
            open={collIndex.includes(index)}
            key={index}
            onClick={() => onChooseItem(index)}
          >
            <QuestionRow>
              <span>{item.question}</span>
              <StyledIcon open={collIndex.includes(index)}>
                <DownOutlined
                  color={colors.primaryBlue}
                  width={10.64}
                  height={9.28}
                />
              </StyledIcon>
            </QuestionRow>
            {expandItem.includes(index) && (
              <AnswerBox>
                <p>{item.answer}</p>
              </AnswerBox>
            )}
            {!isMobile && <Line />}
          </BoxFQ>
        ))}
      </Wrapper>
      {listFaq.length > 5 && (
        <>
          <MoreFaqWrapper open={isMobile ? expandList : true}>
            {listFaq.slice(5, listFaq.length).map((item, index) => (
              <BoxFQ
                open={collIndex.includes(index + 5)}
                key={index + 5}
                onClick={() => onChooseItem(index + 5)}
              >
                <QuestionRow>
                  <span>{item.question}</span>
                  <StyledIcon open={collIndex.includes(index + 5)}>
                    <DownOutlined
                      color={colors.primaryBlue}
                      width={10.64}
                      height={9.28}
                    />
                  </StyledIcon>
                </QuestionRow>
                {expandItem.includes(index + 5) && (
                  <AnswerBox>
                    <p>{item.answer}</p>
                  </AnswerBox>
                )}
                {!isMobile && <Line />}
              </BoxFQ>
            ))}
          </MoreFaqWrapper>
          {isMobile && (
            <ExpandAction onClick={() => setExpandList(!expandList)}>
              <span>{expandList ? 'Tutup' : 'Lihat pertanyaan lainnya'}</span>
            </ExpandAction>
          )}
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  padding: 0 16px;
  margin-top: 16px;
  margin-bottom: 50px;

  @media (min-width: 1025px) {
    display: flex;
    flex-direction: row;
    gap: 38px;
    max-width: 1040px;
    margin: 28px auto 75px;
    padding: 0;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    width: 490px;
  }
`

const MoreFaqWrapper = styled(Wrapper)<{ open: boolean }>`
  max-height: ${({ open }) => (open ? '1000px' : '0px')};
  transition: max-height
    ${({ open }) =>
      open ? '1s ease-in-out' : ' 0.5s cubic-bezier(0, 1, 0, 1)'};
  overflow-y: hidden;
  ::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 1025px) {
    width: 490px;
    max-height: 100%;
  }
`

const BoxFQ = styled.div<{ open: boolean }>`
  max-height: ${({ open }) => (open ? '140px' : '34px')};
  transition: max-height 500ms ${({ open }) => (open ? 'ease-in' : 'ease-out')};
  overflow-y: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  margin-bottom: 18px;

  @media (min-width: 1025px) {
    max-height: ${({ open }) => (open ? '140px' : '57px')};
    margin-bottom: 17px;
  }
`

const QuestionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  span {
    font-family: 'OpenSans';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16.34px;
    color: ${colors.body2};
    width: 80%;

    @media (min-width: 1025px) {
      font-size: 14px;
      line-height: 19px;
      width: 100%;
    }
  }
`

const AnswerBox = styled.div`
  padding: 7px 28px 0 31px;
  p {
    font-family: 'OpenSans';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: ${colors.label};
    width: 88%;

    @media (min-width: 1025px) {
      font-size: 14px;
      line-height: 19px;
      width: 100%;
    }
  }
`

const ExpandAction = styled.div`
  span {
    font-family: 'KanyonBold';
    font-size: 14px;
    line-height: 20px;
    color: ${colors.primaryBlue};
  }
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 18px;
  background-color: ${colors.line};
`
