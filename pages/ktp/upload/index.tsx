import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Webcam from 'react-webcam'
import styled from 'styled-components'
import elementId from 'helpers/elementIds'
import { useAmplitudePageView } from 'utils/hooks/useAmplitudePageView'
import { trackViewPreapprovalKTPUploadCamera } from 'helpers/amplitude/preApprovalEventTracking'
import { getFrameSize, getImageBase64ByFile } from 'utils/handler/image'
import { DocumentType, FrameType, ZIndex } from 'utils/enum'
import { useRouter } from 'next/router'
import { useQuery } from 'utils/hooks/useQuery'
import { useToast } from 'components/atoms/OldToast/Toast'
import { isFirefox, isMobileDevice, screenSize } from 'utils/window'
import { useGalleryContext } from 'services/context/galleryContext'
import { uploadKtpSpouseQueryParam, verifyKtpUrl } from 'utils/helpers/routes'
import {
  ImageType,
  LocationStateKey,
  ToastType,
  UploadChannel,
} from 'utils/types/models'
import { Loading } from 'components/atoms/icon/OldLoading'
import { CameraFrame } from 'components/atoms/cameraFrame'
import { colors } from 'styles/colors'
import { IconChecked } from 'components/atoms'
import { IconCamera, IconUpload } from 'components/atoms/icon'
import { maxPageWidth, screenHeight } from 'styles/globalStyle'
import { CameraSelect } from 'components/molecules/cameraSelect'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import Image from 'next/image'

const ChevronLeft = '/revamp/icon/chevron-left.webp'

const guideline = [
  'Pastikan menggunakan KTP valid yang akan digunakan untuk Surat Pemesanan Kendaraan, dan bukan hasil edit atau fotokopi',
  'Pastikan foto KTP terlihat jelas dan tidak kabur',
  'Pastikan KTP tidak rusak dan data dapat terbaca',
]

export default function CameraKtp() {
  useAmplitudePageView(trackViewPreapprovalKTPUploadCamera)
  const ratio = 4
  const {
    width: frameWidth,
    height: frameHeight,
    horizontalMargin,
  } = getFrameSize(DocumentType.KTP, FrameType.Capture)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { ktpType }: { ktpType: string } = useQuery(['ktpType'])
  const [imageData, setImageData] = useState<string>()
  const [imageFile, setImageFile] = useState<File>()
  const [deviceId, setDeviceId] = useState<string>('')
  const [isUserMediaReady, setUserMediaReady] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  const commonErrorMessage = 'common.errorMessage'
  const imageTypeErrorMessage = 'gallery.imageTypeError'
  const [errorMessage, setErrorMessage] = useState<string>(commonErrorMessage)
  const { showToast, RenderToast } = useToast()
  const { setGalleryFile, setPhotoFile } = useGalleryContext()
  const CameraConstraints = {
    aspectRatio: isMobileDevice
      ? frameHeight / frameWidth
      : frameWidth / frameHeight,
  }

  const capture = useCallback(() => {
    const ref = webcamRef.current
    if (ref != null) {
      let resolution = {
        width: frameWidth * ratio,
        height: frameHeight * ratio,
      }
      if (window.innerWidth >= 481 && window.innerWidth <= 1024) {
        resolution = {
          width: frameWidth * ratio,
          height: frameHeight * ratio * 2.5,
        }
      }
      if (isFirefox) {
        if (isMobileDevice) {
          // height * 2 so that the image will be more square
          // because firefox doesnt automatically crop captured image
          resolution = {
            width: frameWidth * ratio,
            height: frameHeight * ratio * 2,
          }
        } else {
          // for firefox web desktop
          // height * 1.2
          resolution = {
            width: frameWidth * ratio,
            height: frameHeight * ratio * 1.2,
          }
        }
      }
      const imageSrc = ref.getScreenshot(resolution)
      if (imageSrc) {
        const file = dataURItoFile(imageSrc)
        setImageFile(file)
        setImageData(imageSrc)
      }
      !!imageSrc && setImageData(imageSrc)
    }
  }, [webcamRef])

  function dataURItoFile(dataURI: string): File {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new File([ab], 'image.jpg', { type: mimeString })
  }

  useEffect(() => {
    if (imageData) {
      setGalleryFile(imageData as string)
      setPhotoFile(imageFile)
      const nextLocation = {
        pathname: verifyKtpUrl,
        query: {
          [LocationStateKey.Channel]: UploadChannel.Camera as string,
          ...getNextLocationQueryParam(),
        },
      }

      router.push(nextLocation)
    }
  }, [imageData])

  const onError = () => {
    setUserMediaReady(false)
    setLoading(false)
    showToast()
  }
  const onSelected = (deviceIdParam: string | null) => {
    if (deviceIdParam === null) {
      onError()
    } else {
      setLoading(false)
      setDeviceId(deviceIdParam)
    }
  }

  const onUserMedia = () => {
    setUserMediaReady(true)
  }

  const getTitleText = () => {
    if (ktpType && ktpType.toLowerCase() === 'spouse') {
      return 'Foto KTP Pasangan'
    } else {
      return 'Foto KTP'
    }
  }

  const onGalleryInputButtonClick = () => {
    inputRef.current?.click()
  }

  const onGalleryInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length < 1) {
      setErrorMessage(commonErrorMessage)
      showToast()
      return
    }
    if (Object.values(ImageType).includes(files[0].type as ImageType)) {
      handleImage(files[0])
    } else {
      setErrorMessage(imageTypeErrorMessage)
      showToast()
    }
  }

  const getNextLocationQueryParam = () => {
    if (ktpType && ktpType.toLowerCase() === 'spouse') {
      return {
        ktpType: 'spouse',
      }
    } else {
      return ''
    }
  }

  const handleImage = (file: File) => {
    getImageBase64ByFile(file, (value) => {
      if (!!value) {
        setGalleryFile(value as string)
        setPhotoFile(file)

        const nextLocation = {
          pathname: verifyKtpUrl,
          query: {
            [LocationStateKey.Channel]: UploadChannel.Camera as string,
            [LocationStateKey.Base64]: value as string,
            ...getNextLocationQueryParam(),
          },
        }
        router.push(nextLocation)
      } else {
        showToast()
      }
    })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <StyledWrapper padding={horizontalMargin}>
        <Image
          src={ChevronLeft}
          alt="back"
          onClick={() => router.back()}
          style={{
            position: 'absolute',
            top: '20px',
            left: '25px',
            cursor: 'pointer',
          }}
          data-testid={elementId.Profil.ArrowBack}
        />
        <h1
          style={{
            margin: '50px 0 0',
            fontSize: '28px',
            lineHeight: '40px',
            color: '#fff',
          }}
        >
          {getTitleText()}
        </h1>
        <StyledTitle margin={horizontalMargin}>
          Sesuaikan posisi KTP dengan garis bantu yang tersedia
        </StyledTitle>
        <StyledWebcamWrapper>
          <Webcam
            style={{
              borderRadius: '12px',
              objectFit: 'cover',
              padding: '2px',
            }}
            width={frameWidth}
            height={frameHeight}
            onLoad={() => setLoading(true)}
            audio={false}
            ref={webcamRef}
            screenshotFormat={ImageType.JPEG}
            videoConstraints={{
              aspectRatio: CameraConstraints.aspectRatio,
              deviceId: deviceId || undefined,
            }}
            screenshotQuality={1}
            mirrored={false}
            imageSmoothing={true}
            onUserMedia={onUserMedia}
            onUserMediaError={onError}
          />
          <StyledFrameWrapper>
            <CameraFrame color={colors.primary1} height={frameHeight + 4} />
          </StyledFrameWrapper>
        </StyledWebcamWrapper>

        {isUserMediaReady && (
          <StyledFooterWrapper>
            <CameraSelect onSelected={onSelected} isKtp={true} />
            <StyledGuidlineWrapper>
              {guideline.map((item, index) => (
                <div
                  key={index}
                  style={{ display: 'flex', flexDirection: 'row', gap: 8 }}
                >
                  <div>
                    <IconChecked
                      width={12}
                      height={12}
                      color={colors.white}
                      fillColor={colors.primaryDarkBlue}
                    />
                  </div>
                  <StyledGuidlineText>{item}</StyledGuidlineText>
                </div>
              ))}
            </StyledGuidlineWrapper>
            <StyledBottomWrapper>
              <div role="button" onClick={onGalleryInputButtonClick}>
                <IconUpload width={32} height={32} color={colors.white} />
              </div>
              <StyledInput
                ref={inputRef}
                type={'file'}
                accept={[ImageType.PNG, ImageType.JPEG, ImageType.JPG].join(
                  ',',
                )}
                onChange={onGalleryInputChange}
              />
              <StyledButton
                data-testid={elementId.Profil.Button.CaptureImage}
                onClick={capture}
              >
                <IconCamera width={38} height={38} />
              </StyledButton>
              <div style={{ width: 32, height: 32 }}></div>
            </StyledBottomWrapper>
          </StyledFooterWrapper>
        )}
      </StyledWrapper>
      <RenderToast
        type={ToastType.Error}
        message="Oops.. Sepertinya terjadi kesalahan. Coba lagi nanti"
      />
    </>
  )
}

const StyledWrapper = styled.div<{ padding: number }>`
  max-width: ${maxPageWidth};
  min-height: ${screenHeight}px;
  width: 100%;
  display: flex;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  color: ${colors.body};
  background: ${colors.greyscale};
  text-align: center;
`
const StyledTitle = styled.p<{ margin: number }>`
  width: 67%;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.white};
  @media (max-width: ${screenSize.mobileS}) {
    padding: 8px 0;
  }
`
const StyledWebcamWrapper = styled.div`
  display: flex;
  position: relative;
  background: ${colors.greyscale};
  border-radius: 8px;
  margin-top: 16px;
`
const StyledFrameWrapper = styled.div`
  width: 100%;
  position: absolute;
`
const StyledFooterWrapper = styled.div`
  margin-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background: ${colors.greyscale};
  z-index: ${ZIndex.Menubar};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`

const StyledBottomWrapper = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0 30px;
  justify-content: space-between;
`

const StyledButton = styled.div`
  padding: 12.8px;
  border-radius: 50%;
  background-color: ${colors.white};
`

const StyledGuidlineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`

const StyledGuidlineText = styled.span`
  font-family: var(--open-sans);
  font-size: 12px;
  line-height: 18px;
  color: ${colors.white};
  text-align: left;
`

const StyledInput = styled.input`
  position: absolute;
  display: none;
`
