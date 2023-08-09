import { Button, IconClose } from 'components/atoms'
import elementId from 'helpers/elementIds'
import React, { memo } from 'react'
import { LoginSevaUrl } from 'utils/helpers/routes'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { useModal } from 'components/atoms/ModalOld/Modal'
import { useRouter } from 'next/router'
import { ButtonSize, ButtonVersion } from 'utils/enum'

const background = '/revamp/illustration/OldCitySelectorBackgroundMobile.webp'

export const useLoginAlertModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()
  const history = useRouter()

  const LoginAlertModal = memo(() => {
    return (
      <RenderModal blur={'0px'} transparent={false}>
        <MobileHeaderWrapper>
          <Header>
            <CloseIconWrapper onClick={() => hideModal()}>
              <IconClose color={colors.white} width={24} height={24} />
            </CloseIconWrapper>
          </Header>
          <Content>
            <Title>Masuk dengan akunmu untuk lanjut ke tahap berikutnya</Title>
            <StyledButton
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              onClick={() => {
                history.push(LoginSevaUrl)
              }}
              data-testId={elementId.Modal.login}
            >
              Masuk
            </StyledButton>
          </Content>
        </MobileHeaderWrapper>
      </RenderModal>
    )
  })

  return { LoginAlertModal, showModal, hideModal }
}

const MobileHeaderWrapper = styled.div`
  background-image: url(${background});
  background-position: unset;
  background-size: cover;
  background-repeat: no-repeat;
  width: 320px;
  height: 388px;

  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 0 29px;

  height: 100%;
  width: 100%;
`

const Title = styled.span`
  font-family: 'KanyonBold';
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: ${colors.white};
`

const StyledButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  background: rgb(255, 255, 255);
  color: rgb(5, 37, 110);
  font-family: KanyonBold;
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
`

const CloseIconWrapper = styled.div`
  float: right;
  cursor: pointer;
`

const Header = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  @media (max-width: 1024px) {
    padding-left: 16px;
    padding-right: 20px;
    padding-top: 16px;
  }
`
