import React, { useState } from 'react'
import styled from 'styled-components'
import { transparent } from 'styles/colors'

interface DropdownMenuProps {
  right?: number
  marginTop?: number
  items?: number
  children: React.ReactNode
}

export const useDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const onBackgroundClick = () => setIsOpen(false)

  const DropdownMenu = ({
    right = 0,
    marginTop = 8,
    items = 0,
    ...restProps
  }: DropdownMenuProps) => {
    return (
      <StyledContainer isOpen={isOpen}>
        <StyledFullScreenButton onClick={onBackgroundClick} />
        <StyledItemContainer
          right={right}
          marginTop={marginTop}
          items={items}
          {...restProps}
        />
      </StyledContainer>
    )
  }

  return { DropdownMenu, setDropdownDisplay: setIsOpen }
}

const StyledItemContainer = styled.div<{
  right: number
  marginTop: number
  items: number
}>`
  position: absolute;
  z-index: 100;
  background: #ffffff;
  box-shadow: 0 1px 16px ${transparent('title', 0.2)};
  border-radius: 16px;
  ${({ items }) => items > 5 && 'height: 40vh'};
  margin-top: ${({ marginTop }) => `${marginTop}px`};
  right: ${({ right }) => `${right}px`};
  overflow-x: hidden;
  overflow-y: ${({ items }) => (items > 5 ? 'scroll' : 'hidden')};
`

const StyledContainer = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'relative' : 'none')};
`

const StyledFullScreenButton = styled.button`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: default;
  z-index: 100;
  border: none;
`
