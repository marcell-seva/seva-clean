import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { SeoParagraphItem } from './SeoParagraphItem'
import { carResultsUrl } from 'utils/helpers/routes'
import { trackSEOFooterExpandClick } from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { FooterSEOAttributes } from 'utils/types/utils'
import { Previous } from 'components/atoms/icon/Previous'

interface Params {
  model: string
}

interface Props {
  data: FooterSEOAttributes
}

export const SeoParagraphSection = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    if (isOpen) {
      trackSEOFooterExpandClick(TrackingEventName.WEB_SEO_FOOTER_CLICK_CLOSE)
    } else {
      trackSEOFooterExpandClick(TrackingEventName.WEB_SEO_FOOTER_CLICK_EXPAND)
    }
    setIsOpen((prev) => !prev)
  }

  return (
    <Container>
      <CollapsibleButton onClick={handleClick}>
        {isOpen ? 'Tutup' : 'Baca Selengkapnya'}
        <IconWrapper isOpen={isOpen}>
          <Previous color={colors.body2} width={24} height={24} />
        </IconWrapper>
      </CollapsibleButton>
      <Wrapper aria-expanded={isOpen} isOpen={isOpen}>
        <SeoParagraphItem
          title={data.title_1}
          content={data.content_1}
          isOpen={isOpen}
        />
        <SeoParagraphItem
          title={data.Title_2}
          content={data.Content_2}
          isOpen={isOpen}
        />
        <SeoParagraphItem
          title={data.Title_3}
          content={data.Content_3}
          isOpen={isOpen}
        />
      </Wrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 27px 80px 0;
  background-color: ${colors.white};
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 20px 16px 0;
  }
`

const CollapsibleButton = styled.button`
  background: none;
  border: 2px solid ${colors.primaryDarkBlue};
  border-radius: 8px;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  cursor: pointer;

  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: ${colors.primaryDarkBlue};

  @media (max-width: 1024px) {
    padding: 5px 16px;
    font-size: 14px;
    line-height: 17px;
    gap: 10px;
  }
`

export const rotate = css`
  transform: rotate(90deg);
`

const IconWrapper = styled.div<{
  isOpen: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 350ms ease;
  transform: rotate(-90deg);
  ${({ isOpen }) => isOpen && rotate}
`

const Wrapper = styled.div<{
  isOpen: boolean
}>`
  display: flex;
  flex-direction: row;
  gap: 70px;
  margin-top: 24px;
  padding-bottom: ${({ isOpen }) => (isOpen ? '60px' : '0')};
  overflow: hidden;

  max-height: 130px;
  transition: all 0.5s cubic-bezier(0, 1, 0, 1);

  &[aria-expanded='true'] {
    max-height: 2000px;
    transition: all 1s ease-in-out;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 30px;
    max-height: 100px;
    padding-bottom: ${({ isOpen }) => (isOpen ? '20px' : '0')};
  }
`
