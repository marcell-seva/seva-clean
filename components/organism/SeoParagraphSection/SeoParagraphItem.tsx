import React from 'react'
import styled, { css } from 'styled-components'
import DOMPurify from 'dompurify'
import { colors } from 'styles/colors'

interface SEOParagraphItemProps {
  title: string
  content: string
  isOpen?: boolean
  className?: string
}

export const SeoParagraphItem = ({
  title,
  content,
  isOpen = true,
  className,
}: SEOParagraphItemProps) => {
  return (
    <Wrapper className={className}>
      <StyledTitle>{title}</StyledTitle>
      <ContentTextWrapper>
        <ContentText
          dangerouslySetInnerHTML={{
            __html: content,
          }}
          isOpen={isOpen}
        />
      </ContentTextWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  color: ${colors.label};
`

const StyledTitle = styled.h2`
  font-family: 'KanyonBold';
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 20px;
  }
`

const ContentTextWrapper = styled.div`
  margin-top: 14px;
`

export const ClosedStyle = css`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const OpenedStyle = css`
  display: unset;
  -webkit-line-clamp: unset;
  -webkit-box-orient: unset;
  overflow: unset;
  text-overflow: unset;
`

const ContentText = styled.div<{
  isOpen: boolean
}>`
  font-family: 'OpenSans';
  font-size: 14px;
  line-height: 20px;
  ${({ isOpen }) => (isOpen ? OpenedStyle : ClosedStyle)};
  @media (max-width: 1024px) {
    font-size: 12px;
    line-height: 16px;
  }
`
