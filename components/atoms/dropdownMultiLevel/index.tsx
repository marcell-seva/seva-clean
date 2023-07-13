import React, { useState } from 'react'
import styled from 'styled-components'
import { colors, transparent } from 'styles/colors'

interface DropdownMenuProps {
  left?: string
  right?: number
  marginTop?: number
  items?: number
  children: React.ReactNode
  width?: string
  zIndex?: number
  background?: string
}

export const useDropdownMultilevel = () => {
  const [isOpen, setIsOpen] = useState(false)

  const DropdownMultilevel = ({
    left = '0',
    right = 0,
    marginTop = 8,
    items = 0,
    width = 'auto',
    zIndex = 100,
    background = '#ffffff',
    ...restProps
  }: DropdownMenuProps) => {
    return (
      <StyledContainer isOpen={isOpen}>
        <StyledItemContainer
          left={left}
          right={right}
          marginTop={marginTop}
          items={items}
          width={width}
          zIndex={zIndex}
          background={background}
          {...restProps}
        />
      </StyledContainer>
    )
  }

  return { DropdownMultilevel, setDropdownDisplay: setIsOpen }
}

const StyledItemContainer = styled.div<{
  left: string
  right: number
  marginTop: number
  items: number
  width: string
  zIndex: number
  background: string
}>`
  position: absolute;
  z-index: ${({ zIndex }) => zIndex};
  background: ${({ background }) => background};
  box-shadow: 0 1px 16px ${transparent('title', 0.2)};
  ${({ items }) => items > 5 && 'height: 40vh'};
  margin-top: ${({ marginTop }) => `${marginTop}px`};
  right: ${({ right }) => `${right}px`};
  overflow-x: hidden;
  overflow-y: ${({ items }) => (items > 5 ? 'scroll' : 'hidden')};
  width: ${({ width }) => width};
  left: ${({ left }) => left};
  border: 1.5px solid ${colors.label};
  border-radius: 16px;
`

const StyledContainer = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'relative' : 'none')};
`
