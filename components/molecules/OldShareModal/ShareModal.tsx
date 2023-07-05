import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms'
import {
  CarVariantParam,
  trackCarVariantSharePopupClose,
  trackCarVariantSharePopupCopyLinkClick,
  trackCarVariantSharePopupEmailClick,
  trackCarVariantSharePopupTwitterClick,
  trackCarVariantSharePopupWaClick,
} from 'helpers/amplitude/seva20Tracking'
import { useModal } from 'components/atoms/ModalOld/Modal'
import { client } from 'const/const'
import { t } from 'config/localization/locales/id'

const WhatsappLogo = '/assets/icon/OldShareWhatsappLogo.webp'
const TwitterLogo = '/assets/icon/OldShareTwitterLogo.webp'
const EmailLogo = '/assets/icon/OldShareEmailLogo.webp'

interface ShareButton {
  icon: JSX.Element
  name: string
  url: string
}

interface ShareModalProps {
  dataForAmplitude?: CarVariantParam
}

// export const ShareFloatingComponent = () => {
//   const { ShareModal, showModal } = useShareModal()
//   const { DialogModal } = useDialogModal()
//   const { t } = useTranslation()

//   return (
//     <StyledShareContainer onClick={showModal}>
//       <Contact />
//       <ShareModal />
//       <DialogModal
//         title={t('homePageSearch.advisor.thanksTitle')}
//         desc={t('homePageSearch.advisor.thanksDesc')}
//         confirmButtonText={t('homePageSearch.advisor.alertButton')}
//       />
//     </StyledShareContainer>
//   )
// }

export const useShareModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  const ShareModal = ({ dataForAmplitude }: ShareModalProps) => {
    const onClickCancel = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation()
      dataForAmplitude && trackCarVariantSharePopupClose(dataForAmplitude)
      hideModal()
    }

    const urlOrigin = client ? window.location.href : ''

    const shareModals: ShareButton[] = [
      {
        icon: <img src={WhatsappLogo} width={56} height={56} />,
        name: 'Whatsapp',
        url: `https://api.whatsapp.com/send?text=Cek mobil yang ini deh. Siapa tahu cocok dan masuk budget ${urlOrigin}`,
      },
      // temporary removed
      // {
      //   icon: <FacebookLogo />,
      //   name: 'Facebook',
      //   url: `https://www.facebook.com/sharer/sharer.php?u=${urlOrigin}&quote=Saya lagi lihat-lihat mobil yang ini di SEVA. Gimana pendapat kamu? Cocok ga?`,
      // },
      {
        icon: <img src={TwitterLogo} width={56} height={56} />,
        name: 'Twitter',
        url: `https://twitter.com/intent/tweet?url=${urlOrigin}&text=Saya lagi lihat-lihat mobil yang ini di SEVA. Gimana pendapat kamu? Cocok ga? 👉🏻`,
      },
      {
        icon: <img src={EmailLogo} width={56} height={56} />,
        name: 'Email',
        url: `mailto:user@example.com?subject=Cek mobil yang ini deh, oke ga?&body=Siapa tahu kamu juga ingin kasih pendapat atau tertarik ikut cek mobil yang lainnya.%0D%0AKalau saya, lagi lihat-lihat mobil yang ini 👉🏻 ${urlOrigin}`,
      },
    ]

    const amplitudeHandler = (name: string) => {
      if (dataForAmplitude) {
        if (name === 'Whatsapp') {
          trackCarVariantSharePopupWaClick(dataForAmplitude)
        } else if (name === 'Twitter') {
          trackCarVariantSharePopupTwitterClick(dataForAmplitude)
        } else if (name === 'Email') {
          trackCarVariantSharePopupEmailClick(dataForAmplitude)
        } else if (name === 'copyLink') {
          trackCarVariantSharePopupCopyLinkClick(dataForAmplitude)
        }
      }
    }

    return (
      <>
        <RenderModal blur={'0px'} transparent={false}>
          <StyledWrapper>
            <StyledContent>
              <StyledCloseIcon onClick={onClickCancel}>
                <IconClose color={colors.primary1} width={24} height={24} />
              </StyledCloseIcon>
              <StyledTitle>{t.shareModal.title}</StyledTitle>
              <StyledShareButtonList>
                {shareModals.map(({ icon, name, url }, index) => (
                  <StyledShareButton
                    key={index}
                    onClick={() => {
                      amplitudeHandler(name)
                      window.open(url)
                    }}
                  >
                    <StyledIcon>{icon}</StyledIcon>
                    <StyledText>{name}</StyledText>
                  </StyledShareButton>
                ))}
              </StyledShareButtonList>
              <StyledUrlField>
                <StyledUrlText>{urlOrigin}</StyledUrlText>
                <StyledCopyUrl
                  onClick={() => {
                    amplitudeHandler('copyLink')
                    navigator.clipboard.writeText(urlOrigin)
                  }}
                >
                  Copy
                </StyledCopyUrl>
              </StyledUrlField>
            </StyledContent>
          </StyledWrapper>
        </RenderModal>
      </>
    )
  }
  return { ShareModal, hideModal, showModal }
}

// const rightPadding = Math.max((screenWidth - maxPageWidthNumber) / 2, 0) + 16
// const StyledShareContainer = styled.div`
//   position: fixed;
//   right: ${rightPadding}px;
//   bottom: 16px;
//   z-index: 40;
// `

const StyledWrapper = styled.div`
  width: 700px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  padding: 0 16px;
`

const StyledContent = styled.div`
  border-radius: 16px;
  text-align: center;
  flex: 1;
  padding: 20px 24px 19px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: ${colors.white};
`
const StyledCloseIcon = styled.div`
  display: flex;
  align-self: flex-end;
`
const StyledShareButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 3px;
  cursor: pointer;
`

const StyledShareButtonList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: center;
  margin: 20px 0;
`

const StyledTitle = styled.h2`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0px;

  color: ${colors.title};
  margin-top: 12px;
`

const StyledIcon = styled.div`
  width: 64px;
  height: 50px;
  margin: 10px auto;
`

const StyledText = styled.span`
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0px;
  font-family: 'KanyonBold';
  color: ${colors.title};
`

const StyledUrlField = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1.5px solid #e4e9f1;
  box-sizing: border-box;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
`

const StyledUrlText = styled.span`
  font-family: 'Kanyon';
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 0px;
  text-overflow: ellipsis;
`

const StyledCopyUrl = styled.div`
  font-family: 'Kanyon';
  text-decoration: none;
  cursor: pointer;
  color: ${colors.primary1};
`
