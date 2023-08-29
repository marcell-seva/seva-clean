import React, { ChangeEvent } from 'react'
import styled from 'styled-components'

interface ToggleProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const ToggleSwitch = ({ onChange }: ToggleProps) => {
  return (
    <StyledToggleContainer>
      <StyledToggleInput type="checkbox" onChange={onChange} />
      <StyledSlider />
    </StyledToggleContainer>
  )
}

const StyledToggleContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 41px;
  height: 25px;
`

const StyledSlider = styled.span`
  border-radius: 36px;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #9ea3ac;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  &::before {
    border-radius: 30px;
    position: absolute;
    content: '';
    width: 21px;
    height: 21px;
    left: 2px;
    bottom: 2.25px;
    background-color: #f2f5f9;
    -webkit-transition: 0.2s;
    transition: 0.2s;
  }
`

const StyledToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked {
    & + ${StyledSlider} {
      background-color: #05256e;
    }
    & + ${StyledSlider}::before {
      -webkit-transform: translateX(16px);
      -ms-transform: translateX(16px);
      transform: translateX(16px);
    }
  }
`
