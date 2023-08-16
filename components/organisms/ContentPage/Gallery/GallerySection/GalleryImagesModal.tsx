import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { CloseOutlined2 } from 'components/atoms'
import { useModal } from 'components/atoms/ModalOld/Modal'

interface Props {
  imageList: string[]
  selectedImageIndex: number
}

export const useGalleryImagesModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  const closeModal = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    hideModal()
  }

  const GalleryImagesModal = ({ imageList, selectedImageIndex }: Props) => {
    const qweRef = useRef<any>(null)
    const imagesRef = useRef<Array<HTMLDivElement | null>>([]) // access the elements with imagesRef.current[n]

    useEffect(() => {
      // used to resize array if imageList updated
      imagesRef.current = imagesRef.current.slice(0, imageList.length)
    }, [imageList])

    useEffect(() => {
      if (
        imagesRef &&
        imagesRef.current[selectedImageIndex] &&
        selectedImageIndex !== 0 // no need to scroll for the first image
      ) {
        imagesRef.current[selectedImageIndex]?.scrollIntoView()
      }
    }, [imagesRef])

    return (
      <>
        <RenderModal blur={'0px'} transparent={false}>
          <StyledWrapper>
            <StyledContent ref={qweRef}>
              <StickyWrapper>
                <CloseButtonWrapper onClick={closeModal}>
                  <CloseOutlined2 color={colors.white} width={16} height={16} />
                </CloseButtonWrapper>
              </StickyWrapper>
              <ImageListWrapper>
                {imageList.map((item, index) => (
                  <div
                    ref={(el) => (imagesRef.current[index] = el)}
                    key={index}
                  >
                    <StyledImage src={item} />
                  </div>
                ))}
              </ImageListWrapper>
            </StyledContent>
          </StyledWrapper>
        </RenderModal>
      </>
    )
  }

  return { GalleryImagesModal, hideModal, showModal }
}

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: unset;
}
`

const StyledContent = styled.div`
  background: ${colors.black};
  position: relative;
  border-radius: 0;
  flex: 1;
  padding: 24px 0 20px;
  height: fit-content;
`

const ImageListWrapper = styled.div`
  margin-top: 40px;
  background: ${colors.black};
  display: flex;
  flex-direction: column;
  gap: 21px;
`

const StickyWrapper = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 24px;
  display: flex;
  align-items: flex-end;
  float: right;
  margin-right: 20px;
`

const CloseButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const StyledImage = styled(LazyLoadImage)`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
`
