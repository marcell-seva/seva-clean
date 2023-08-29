import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'

interface ProgressBarProps {
  percentage: number
  colorPrecentage?: string
}

export const ProgressBar = ({
  percentage,
  colorPrecentage,
}: ProgressBarProps) => {
  const ProgressBarContainer = styled.div`
    width: 100%;
    height: 8px;
    margin: 0 auto 24px;
    position: relative;
    background-color: ${colors.line};
    border-radius: 2px;
  `
  const easeOutBack = `cubic-bezier(0.34, 1.56, 0.64, 1)`

  const ProgressBarIndicator = styled.div<ProgressBarProps>`
    width: ${({ percentage }) => percentage}%;
    transition: width 0.5s ${easeOutBack};
    height: 8px;
    position: absolute;
    left: 0;
    background-color: ${colorPrecentage ? colorPrecentage : colors.primary1};
    border-radius: 2px;
  `
  return (
    <ProgressBarContainer>
      <ProgressBarIndicator
        percentage={percentage}
        colorPrecentage={colorPrecentage}
      />
    </ProgressBarContainer>
  )
}

interface ProgressBarProps {
  percentage: number
}
