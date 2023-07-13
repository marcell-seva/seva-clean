import { LinkLabelMediumSemiBold } from 'components/atoms/typography/LinkLabelMediumSemiBold'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'

const wrapper = css`
  border: none;
  padding: 10px 0;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 40px;
  color: ${colors.black};
  cursor: pointer;
  position: relative;
  :hover {
    border-top: 3px solid ${colors.primary1};
  }
`
export const Wrapper = styled.a`
  ${wrapper}
`

export const WrapperButton = styled.button`
  ${wrapper}
`

export const StyledLabel = styled(LinkLabelMediumSemiBold)<{
  newMenu?: boolean
}>`
  font-size: 12px;
  line-height: 18px;
  font-weight: 700;
  font-family: 'KanyonBold';
  color: ${({ newMenu }) => newMenu && colors.primaryBlue};
`

export const Spacing = styled.div`
  width: 12px;
`

const textWrapperStyles = css`
  margin: 8px;
  padding: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  color: ${colors.black};

  &:hover {
    background-color: ${colors.primarySky};
    .item-text {
      font-family: 'OpenSansBold';
      font-weight: 700 !important;
    }
  }
`
export const ItemTextWrapper = styled.a`
  ${textWrapperStyles}
`

export const ItemTextWrapperPrimary = styled.div`
  ${textWrapperStyles}
`

export const StyledItemText = styled(LinkLabelMediumSemiBold)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  font-family: 'OpenSans';
`
