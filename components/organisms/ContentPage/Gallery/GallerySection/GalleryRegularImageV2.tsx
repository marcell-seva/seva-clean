import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useMediaQuery } from 'react-responsive'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { colors } from 'styles/colors'
import { GalleryImageOptionsListV2 } from './GalleryImageOptionsListV2'
import { useGalleryImagesModal } from './GalleryImagesModal'
import { ImageUnavailable } from './ImageUnavailable'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import {
  CarVariantPhotoParam,
  trackPDPPhotoClick,
} from 'helpers/amplitude/seva20Tracking'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { LocalStorageKey } from 'utils/enum'
import { useCar } from 'services/context/carContext'

type ImageList = {
  exterior: string[]
  interior: string[]
}
interface Props {
  imageList: ImageList
  isSelectedExterior: boolean
}

export const GalleryRegularImageV2 = ({
  imageList,
  isSelectedExterior,
}: Props) => {
  const { carModelDetails } = useCar()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentImageList, setCurrentImageList] = useState(imageList.exterior)
  const { showModal: showGalleryImagesModal, GalleryImagesModal } =
    useGalleryImagesModal()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const trackEventPhoto = (photoType: string, imgUrl: string) => {
    const trackProperties: CarVariantPhotoParam = {
      Car_Brand: carModelDetails?.brand as string,
      Car_Model: carModelDetails?.model as string,
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
      Photo_Type: photoType,
      City: cityOtr?.cityName || 'null',
      Image_URL: imgUrl,
    }
    trackPDPPhotoClick(
      TrackingEventName.WEB_PDP_CAROUSEL_PHOTO_CLICK,
      trackProperties,
    )
  }

  useEffect(() => {
    if (isSelectedExterior) {
      setCurrentImageList(imageList.exterior)
    } else {
      setCurrentImageList(imageList.interior)
    }
    // set to the first image everytime change image type
    setCurrentSlide(0)
  }, [isSelectedExterior])

  const updateCurrentSlide = (index: number) => {
    if (currentSlide !== index) {
      setCurrentSlide(index)
    }
  }

  const onClickBigImage = (index: number) => {
    setSelectedImageIndex(index)
    showGalleryImagesModal()
  }

  return (
    <>
      <Container>
        {currentImageList.length > 0 ? (
          <>
            <BigDisplay>
              {isMobile ? (
                <StyledCarousel
                  emulateTouch={true}
                  showThumbs={false}
                  showStatus={false}
                  showArrows={false}
                  autoPlay={false}
                  swipeable={true}
                  infiniteLoop={false}
                  showIndicators={false}
                  stopOnHover={false}
                  selectedItem={currentSlide}
                  onChange={updateCurrentSlide}
                  isMobile={isMobile}
                >
                  {currentImageList.map((item: any, index: number) => (
                    <div
                      style={{ cursor: 'pointer' }}
                      key={index}
                      onClick={() => onClickBigImage(index)}
                    >
                      <StyledBigImage src={item} />
                    </div>
                  ))}
                </StyledCarousel>
              ) : (
                <StyledBigImage src={currentImageList[currentSlide]} />
              )}
              <SlideNumberWrapper>
                {`${currentSlide + 1}/${currentImageList.length}`}
              </SlideNumberWrapper>
              {isMobile && <SwipeGuideWrapper>SWIPE &gt;</SwipeGuideWrapper>}
            </BigDisplay>
            <GalleryImageOptionsListV2
              imageOptionsList={currentImageList}
              onChooseImageOption={(chosenIndex, imgUrl) => {
                setCurrentSlide(chosenIndex)
                trackEventPhoto(
                  isSelectedExterior ? 'Exterior' : 'Interior',
                  imgUrl,
                )
              }}
              currentSlide={currentSlide}
            />
          </>
        ) : (
          <ImageUnavailable type={'interior'} /> // every car always has exterior
        )}
      </Container>
      <GalleryImagesModal
        imageList={currentImageList}
        selectedImageIndex={selectedImageIndex}
      />
    </>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (min-width: 1025px) {
    flex-direction: row;
    height: 552px;
  }
`

const BigDisplay = styled.div`
  width: 100%;
  position: relative;
`

const StyledCarousel = styled(Carousel)<{
  isMobile: boolean
}>`
  && .slide {
    background: none;
    align-items: center;
    justify-content: center;
    display: ${({ isMobile }) => (isMobile ? 'block' : 'flex')};
    aspect-ratio: 4 / 3;
  }
  && .carousel * {
    box-sizing: border-box;
  }
}
`

const StyledBigImage = styled(LazyLoadImage)`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: contain;

  @media (min-width: 1025px) {
    width: 733px;
    border-radius: 6px;
  }
`

const BigDisplayCarouselWordingStyle = css`
  background: ${colors.white};
  opacity: 0.5;
  border-radius: 8px;
  height: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 7px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 32px;
  color: ${colors.black};

  @media (min-width: 1025px) {
    border-radius: 12px;
    width: 60px;
    height: 30px;
    padding: 0;
    font-family: 'OpenSansSemiBold';
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }
`

const SlideNumberWrapper = styled.div`
  position: absolute;
  left: 14px;
  bottom: 14px;
  ${BigDisplayCarouselWordingStyle};

  @media (min-width: 1025px) {
    left: 30px;
    bottom: 30px;
  }
`

const SwipeGuideWrapper = styled.div`
  position: absolute;
  right: 14px;
  bottom: 14px;
  ${BigDisplayCarouselWordingStyle};
`
