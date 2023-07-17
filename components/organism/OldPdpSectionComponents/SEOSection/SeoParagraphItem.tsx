import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import DOMPurify from 'dompurify'
import { colors } from 'styles/colors'
import { client } from 'const/const'

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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isOpen && open) {
      const timeout = setTimeout(() => {
        setOpen(false)
      }, 1100)

      return () => clearTimeout(timeout)
    }

    if (isOpen && !open) {
      setOpen(true)
    }
  }, [isOpen])

  return (
    <Wrapper className={className} isOpen={isOpen}>
      <StyledTitle>{title}</StyledTitle>
      <ContentTextWrapper>
        <ContentText
          dangerouslySetInnerHTML={{
            __html: client ? DOMPurify.sanitize(content) : content,
          }}
          isOpen={open}
        />
      </ContentTextWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  color: ${colors.label};

  @media (min-width: 1025px) {
    max-height: ${({ isOpen }) => (isOpen ? '1000px' : '300px')};
  }
`

const StyledTitle = styled.h2`
  font-family: 'KanyonBold';
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
`

const ContentTextWrapper = styled.div`
  margin-top: 14px;

  @media (min-width: 1025px) {
    margin-top: 10px;
  }
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
  ${({ isOpen }) => (isOpen ? OpenedStyle : ClosedStyle)};
  font-size: 12px;
  line-height: 16px;
`
