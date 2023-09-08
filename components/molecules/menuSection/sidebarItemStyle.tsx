import styled from 'styled-components'
import { colors } from 'styles/colors'
import { LinkLabelMediumBold } from 'utils/typography/LinkLabelMediumBold'
import { TextLegalMedium } from 'utils/typography/TextLegalMedium'
import { TextLegalSemiBold } from 'utils/typography/TextLegalSemiBold'

const RegisterImg = '/revamp/illustration/Register.png'

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-right: 32px;
  margin-bottom: 24px;
  cursor: pointer;
`

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`

export const StyledText = styled(LinkLabelMediumBold)<{ newMenu?: boolean }>`
  color: ${({ newMenu }) => (newMenu ? colors.primaryBlue : colors.body2)};
`

export const Divider = styled.div`
  width: 100%;
  margin-left: 0%;
  margin-right: auto;
  border: 1px solid #e4e9f1;
  margin-top: 102px;
  @media (max-width: 915px) {
    margin-top: 0px;
  }
  @media (max-width: 480px) {
    margin-top: 102px;
  }
`
export const Register = styled.div`
  background: url(${RegisterImg}) no-repeat center;
  background-size: 245px 50px;
  max-width: 243px;
  max-height: 40px;
  width: 243px;
  height: 40px;
  border-radius: 8px;
`

export const WrapperProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.inputBg};
  padding: 24px 26px 24px 16px;
  margin-bottom: 24px;
`
export const IconWrapperName = styled.div`
  background: ${colors.primary1};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* margin-top: 10px; */
`
export const IconName = styled(TextLegalMedium)`
  font-weight: 600;
  font-size: 14px;
  font-family: var(--open-sans);
  color: white;
`
export const ProfileInfoHeader = styled(TextLegalMedium)`
  font-family: var(--kanyon);
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #52627a;
  margin-top: 30px;
`
export const ProfileWrapper = styled.div`
  width: auto;
  height: auto;
  flex-direction: row;
  display: flex;
  align-items: center;
`

export const ProfileWrapperDetail = styled.div`
  width: auto;
  height: auto;
  /* margin-top: 12px; */
  margin-left: 12px;
  flex-direction: column;
  display: flex;
`

export const ProfileGreetingHai = styled(TextLegalSemiBold)`
  line-height: 20px;
  color: #9ea3ac;
`

export const ProfileInfoFullName = styled(TextLegalMedium)`
  font-family: var(--kanyon);
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 18px;
  color: #52627a;
  margin-bottom: 4px;
`
export const WrapperPhoneNumber = styled.div`
  width: 10px;
  margin: 0px;
  padding: 0px;
`
export const ProfileInfoPhoneNumber = styled(TextLegalMedium)`
  font-family: var(--kanyon);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #52627a;
  padding-right: 4px;
`
