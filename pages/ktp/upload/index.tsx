import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Webcam from 'react-webcam'
import elementId from 'helpers/elementIds'
import { useAmplitudePageView } from 'utils/hooks/useAmplitudePageView'
import { trackViewPreapprovalKTPUploadCamera } from 'helpers/amplitude/preApprovalEventTracking'
import { getFrameSize, getImageBase64ByFile } from 'utils/handler/image'
import {
  DocumentType,
  FrameType,
  LocalStorageKey,
  SessionStorageKey,
} from 'utils/enum'
import { useRouter } from 'next/router'
import { useQuery } from 'utils/hooks/useQuery'
import { useToast } from 'components/atoms/OldToast/Toast'
import { isFirefox, isMobileDevice } from 'utils/window'
import { useGalleryContext } from 'services/context/galleryContext'
import {
  creditQualificationResultUrl,
  creditQualificationReviewUrl,
  formKtpUrl,
  ktpReviewUrl,
  landingKtpUrl,
  multiResultCreditQualificationPageUrl,
  previewKtpUrl,
  uploadKtpSpouseQueryParam,
  verifyKtpUrl,
} from 'utils/helpers/routes'
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
import { CameraSelect } from 'components/molecules/cameraSelect'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import Image from 'next/image'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { defineRouteName } from 'utils/navigate'
import { FormLCState } from 'utils/types/utils'
import { useValidateUserFlowKKIA } from 'utils/hooks/useValidateUserFlowKKIA'
import styles from 'styles/pages/ktp-upload.module.scss'
import dynamic from 'next/dynamic'
import { useMediaQuery } from 'react-responsive'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useBeforePopState } from 'utils/hooks/useBeforePopState'
import { getLocalStorage } from 'utils/handler/localStorage'

const ChevronLeft = '/revamp/icon/chevron-left.webp'

const guideline = [
  'Pastikan menggunakan KTP valid yang akan digunakan untuk Surat Pemesanan Kendaraan, dan bukan hasil edit atau fotokopi',
  'Pastikan foto KTP terlihat jelas dan tidak kabur',
  'Pastikan KTP tidak rusak dan data dapat terbaca',
]

export default function CameraKtp() {
  useValidateUserFlowKKIA([
    creditQualificationReviewUrl,
    creditQualificationResultUrl,
    multiResultCreditQualificationPageUrl,
    ktpReviewUrl,
    formKtpUrl,
    verifyKtpUrl,
    landingKtpUrl,
    previewKtpUrl,
  ])
  useBeforePopState()
  const ratio = 4
  const { width: frameWidth, height: frameHeight } = getFrameSize(
    DocumentType.KTP,
    FrameType.Capture,
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const kkForm: FormLCState | null = getLocalStorage(
    LocalStorageKey.KalkulatorKreditForm,
  )
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const { fincap } = useFinancialQueryData()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { ktpType }: { ktpType: string } = useQuery(['ktpType'])
  const [imageData, setImageData] = useState<string>()
  const [imageFile, setImageFile] = useState<File>()
  const [deviceId, setDeviceId] = useState<string>('')
  const [isUserMediaReady, setUserMediaReady] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  const commonErrorMessage =
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi'
  const imageTypeErrorMessage =
    'Maaf, kami belum mendukung tipe file ini. Coba pakai tipe gambar .jpg, .jpeg, atau .png ya'
  const [errorMessage, setErrorMessage] = useState<string>(commonErrorMessage)
  const { showToast, RenderToast } = useToast()
  const { setGalleryFile, setPhotoFile } = useGalleryContext()
  const CameraConstraints = useMemo(() => {
    return {
      aspectRatio: isMobile
        ? frameHeight / frameWidth
        : frameWidth / frameHeight,
    }
  }, [isMobile])
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const isInPtbcFlow = kkFlowType && kkFlowType === 'ptbc'

  const trackKTPUpload = () => {
    const prevPage = getSessionStorage(SessionStorageKey.PreviousPage) as any
    const brand = kkForm?.model?.brandName || 'Null'
    const model = kkForm?.model
      ? kkForm?.model?.modelName.replace(brand, '')
      : 'Null'
    const track = {
      KTP_PROFILE: ktpType ? 'Spouse' : 'Main',
      PAGE_REFERRER:
        prevPage && prevPage.refer ? defineRouteName(prevPage.refer) : 'Null',
      PELUANG_KREDIT_BADGE: fincap
        ? kkForm && kkForm.model?.loanRank
          ? kkForm.model.loanRank === 'Green'
            ? 'Mudah disetujui'
            : 'Sulit disetujui'
          : 'Null'
        : 'Null',
      CAR_BRAND: brand,
      CAR_MODEL: model,
    }

    if (isInPtbcFlow) {
      trackEventCountly(CountlyEventNames.WEB_PTBC_KTP_PAGE_PHOTO_VIEW, {
        KTP_PROFILE: ktpType ? 'Spouse' : 'Main',
      })
    } else {
      trackEventCountly(CountlyEventNames.WEB_KTP_PAGE_PHOTO_VIEW, track)
    }
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
    trackEventCountly(CountlyEventNames.WEB_KTP_PAGE_PHOTO_CAPTURE_CLICK)
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

  useAfterInteractive(() => {
    const timeout = setTimeout(() => {
      trackKTPUpload()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (imageData) {
      setGalleryFile(imageData as string)
      saveSessionStorage(
        SessionStorageKey.LastVisitedPageKKIAFlow,
        window.location.pathname,
      )
      const nextLocation = {
        pathname: verifyKtpUrl,
        search: getNextLocationQueryParam(),
      }
      setPhotoFile(imageFile)
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
    trackEventCountly(CountlyEventNames.WEB_KTP_PAGE_PHOTO_UPLOAD_CLICK)
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
      return uploadKtpSpouseQueryParam
    } else {
      return ''
    }
  }

  const handleImage = (file: File) => {
    getImageBase64ByFile(file, (value) => {
      if (!!value) {
        setGalleryFile(value as string)
        saveSessionStorage(
          SessionStorageKey.LastVisitedPageKKIAFlow,
          window.location.pathname,
        )
        const nextLocation = {
          pathname: verifyKtpUrl,
          search: getNextLocationQueryParam(),
        }
        setPhotoFile(file)
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
      <div className={styles.wrapper}>
        <Image
          src={ChevronLeft}
          alt="back"
          onClick={() => {
            saveSessionStorage(
              SessionStorageKey.LastVisitedPageKKIAFlow,
              window.location.pathname,
            )
            router.back()
          }}
          height={14}
          width={8}
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
        <span className={styles.title}>
          Sesuaikan posisi KTP dengan garis bantu yang tersedia
        </span>
        <div className={styles.webcamWrapper}>
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
          <div className={styles.frameWrapper}>
            <CameraFrame color={colors.primary1} height={frameHeight + 4} />
          </div>
        </div>

        <div className={styles.footerWrapper}>
          {isUserMediaReady && (
            <CameraSelect onSelected={onSelected} isKtp={true} />
          )}
          <div className={styles.guideLineWrapper}>
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
                <span className={styles.guideLineText}>{item}</span>
              </div>
            ))}
          </div>
          <div className={styles.bottomWrapper}>
            <div role="button" onClick={onGalleryInputButtonClick}>
              <IconUpload width={32} height={32} color={colors.white} />
            </div>
            <input
              className={styles.input}
              ref={inputRef}
              type={'file'}
              accept={[ImageType.PNG, ImageType.JPEG, ImageType.JPG].join(',')}
              onChange={onGalleryInputChange}
            />
            {isUserMediaReady && (
              <button
                className={styles.button}
                data-testid={elementId.Profil.Button.CaptureImage}
                onClick={capture}
              >
                <IconCamera width={38} height={38} />
              </button>
            )}

            <div style={{ width: 32, height: 32 }}></div>
          </div>
        </div>
      </div>
      <RenderToast type={ToastType.Error} message={errorMessage} />
    </>
  )
}
