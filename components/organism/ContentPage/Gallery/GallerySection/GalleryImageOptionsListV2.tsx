import React, { createRef, MutableRefObject, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'
import { colors } from 'styles/colors'
// import { isIphone } from 'utils/window'

interface Props {
  imageOptionsList: string[]
  onChooseImageOption: (chosenIndex: number, imgUrl: string) => void
  currentSlide: number
}

export const GalleryImageOptionsListV2 = ({
  imageOptionsList,
  onChooseImageOption,
  currentSlide,
}: Props) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>
  const refs = imageOptionsList.reduce<any>((acc, value) => {
    acc[value] = createRef()
    return acc
  }, {})

  const lastIndex = imageOptionsList.length - 1

  const scrollToOption = (index: number, item: string) => {
    // const behavior = isIphone ? 'auto' : 'smooth' // scroll behavior
    const behavior = 'smooth'
    const block = isMobile
      ? 'nearest'
      : index === 0 || index === lastIndex
      ? 'nearest'
      : 'center'
    const inline = isMobile ? 'center' : 'nearest'

    refs[item].current.scrollIntoView({
      behavior,
      block,
      inline,
    })

    const scrollTop = { top: -50, behavior } as ScrollToOptions
    const scrollBottom = { top: 2000, behavior } as ScrollToOptions
    const scrollLeft = { left: -10, behavior } as ScrollToOptions
    const scrollRight = { left: 1000, behavior } as ScrollToOptions

    if (index === 0)
      containerRef.current.scrollTo(isMobile ? scrollLeft : scrollTop)
    if (index === lastIndex)
      containerRef.current.scrollTo(isMobile ? scrollRight : scrollBottom)
  }
  const onClickImage = (chosenIndex: number, item: string) => {
    scrollToOption(chosenIndex, item)
    onChooseImageOption(chosenIndex, item)
  }

  useEffect(() => {
    scrollToOption(0, imageOptionsList[0])
  }, [imageOptionsList])

  return (
    <Container ref={containerRef}>
      <ImageListWrapper>
        {imageOptionsList.map((item, index) => (
          <StyledImage
            ref={refs[item]}
            src={item}
            key={index}
            onClick={() => onClickImage(index, item)}
            isSelected={currentSlide === index}
          />
        ))}
      </ImageListWrapper>
    </Container>
  )
}

export const Container = styled.div`
  width: 100%;
  overflow: auto;

  @media (min-width: 1025px) {
    padding: 12px 0;

    /* width */
    &::-webkit-scrollbar {
      width: 7px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: ${colors.line};
      border-radius: 4px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: ${colors.placeholder};
      border-radius: 4px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: ${colors.placeholder};
    }
  }
`

const ImageListWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;

  @media (min-width: 1025px) {
    flex-direction: column;
    gap: 24px;
  }
`

const StyledImage = styled.img<{
  isSelected: boolean
}>`
  width: 28vw;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  cursor: pointer;

  @media (min-width: 1025px) {
    width: 266px;
    height: auto;
    border-radius: 6px;
    box-shadow: ${({ isSelected }) =>
      isSelected && `0px 0px 12px 2px rgba(35, 109, 210, 0.8)`};
  }
`
