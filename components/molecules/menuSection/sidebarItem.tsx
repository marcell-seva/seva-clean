import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { TextWrapper } from './menuListLevel1'

interface Props {
  label: string
  toggleNew: boolean
  icon?: React.ReactNode
}

export const SidebarItem = ({ label, icon, toggleNew }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper>
      <MenuWrapper onClick={() => setIsOpen(!isOpen)}>
        <TextWrapper newMenu={toggleNew}>{label}</TextWrapper>
        {icon && (
          <IconWrapper isOpen={isOpen}>
            <span>{icon}</span>
          </IconWrapper>
        )}
      </MenuWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

// const StyledText = styled(TextMediumRegular)`
//   color: ${colors.label};
// `

const IconWrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: rotate(-90deg);
    `};
`
