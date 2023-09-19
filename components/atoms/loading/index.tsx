import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useModal } from '../ModalOld/Modal'
import { ModalBody } from '../ModalBodyWrapper/ModalBodyWrapper'
import { ProgressBar } from '../progressBar'
import { TextMediumRegular } from '../typography/TextMediumRegular'
import { H2MediumBold } from 'utils/typography/H2MediumBold'
import dynamic from 'next/dynamic'

const MasterImage = dynamic(() =>
  import('../masterImage').then((mod) => mod.MasterImage),
)

interface LoadingPageProps {
  progress: number
  isShowLoading: boolean
  title?: string
  message?: string
  masterImage?: JSX.Element
}

export const Loading = ({
  progress,
  isShowLoading,
  title,
  message = 'loadingPage.title',
  masterImage = <MasterImage width={'100%'} height={'100%'} />,
}: LoadingPageProps) => {
  const { t } = useTranslation()
  const { showModal, hideModal, RenderModal } = useModal()
  useEffect(() => {
    isShowLoading ? showModal() : hideModal()
  }, [isShowLoading])

  // AS REQUESTED ON 15 FEB 22
  // MAYBE TEMPORARY
  const enableLoadingComponent = false

  return (
    <>
      {enableLoadingComponent && (
        <RenderModal>
          <ModalBody>
            <LoadingModalWrapper>
              {masterImage && (
                <StyledImgContainer>{masterImage}</StyledImgContainer>
              )}
              <ProgressBarWrapper>
                <ProgressBar percentage={progress} />
              </ProgressBarWrapper>
              <LoadingMessage>
                {title && <StyledTitle>{t(title)}</StyledTitle>}
                <TextMediumRegular>{t(message)}</TextMediumRegular>
              </LoadingMessage>
            </LoadingModalWrapper>
          </ModalBody>
        </RenderModal>
      )}
    </>
  )
}

const LoadingModalWrapper = styled.div`
  padding: 70px 18px 32px;
`

const StyledImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const ProgressBarWrapper = styled.div`
  margin: 44px 52px 24px;
`

const LoadingMessage = styled.div`
  text-align: center;
`

const StyledTitle = styled(H2MediumBold)`
  margin: 28px auto 10px;
`
