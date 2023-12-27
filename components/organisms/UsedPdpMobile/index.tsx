import React, { useContext, useEffect, useState } from 'react'
import {
  AdaOTOdiSEVALeadsForm,
  FooterMobile,
  HeaderMobile,
  PdpUsedCarLowerSection,
  PdpUsedCarUpperSection,
} from 'components/organisms'
import styles from 'styles/pages/carVariantList.module.scss'
import { SessionStorageKey } from 'utils/enum'
import { IconLocation } from 'components/atoms'
import elementId from 'helpers/elementIds'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import {
  addSeparator,
  capitalizeFirstLetter,
  capitalizeWords,
} from 'utils/stringUtils'
import { getToken } from 'utils/handler/auth'
import { valueMenuTabCategory } from 'helpers/countly/countly'
import { useUtils } from 'services/context/utilsContext'
import dynamic from 'next/dynamic'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { usedCar } from 'services/context/usedCarContext'
import clsx from 'clsx'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'

const UsedCarOverlayGallery = dynamic(() =>
  import('components/molecules').then((mod) => mod.UsedCarOverlayGallery),
)
const CitySelectorModal = dynamic(() =>
  import('components/molecules').then((mod) => mod.CitySelectorModal),
)
const ShareModal = dynamic(() =>
  import('components/molecules').then((mod) => mod.ShareModal),
)
const ProductDetailEmptyState = dynamic(() =>
  import('components/organisms').then((mod) => mod.ProductDetailEmptyState),
)

export interface CarVariantListPageUrlParams {
  brand: string
  model: string
  tab: string
}

interface UsedCarVariantListProps {
  isOTO?: boolean
}

export default function UsedCarVariantList({
  isOTO = false,
}: UsedCarVariantListProps) {
  const [isPreviewGalleryOpened, setIsPreviewGalleryOpened] =
    useState<boolean>(false)
  const [status, setStatus] = useState<'loading' | 'empty' | 'exist'>('exist')
  const [galleryIndexActive, setGalleryIndexActive] = useState<number>(0)
  const [dataPreviewImages, setDataPreviewImages] = useState<Array<string>>([])
  const { usedCarModelDetailsRes } = useContext(UsedPdpDataLocalContext)
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)
  const modelName =
    usedCarModelDetailsRes && capitalizeWords(usedCarModelDetailsRes.modelName)

  const { detail } = usedCar()

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const handlePreviewOpened = (payload: number) => {
    setGalleryIndexActive(payload)
    setIsPreviewGalleryOpened(true)
  }

  const handlePreviewClosed = (payload: number) => {
    setGalleryIndexActive(payload)
    setIsPreviewGalleryOpened(false)
  }

  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox } = useUtils()
  const [isOpenShareModal, setIsOpenShareModal] = useState(false)

  const [isActive, setIsActive] = useState(false)
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

  useAfterInteractive(() => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        saveShowAnnouncementBox(isShowAnnouncement as boolean)
      } else {
        saveShowAnnouncementBox(true)
      }
    } else {
      saveShowAnnouncementBox(false)
    }
  }, [dataAnnouncementBox])

  useEffect(() => {
    if (detail) {
      setStatus('exist')
    }
  }, [detail])

  const renderContent = () => {
    switch (status) {
      case 'empty':
        return (
          <>
            <ProductDetailEmptyState
              model={''}
              message={`${''}  tersedia di`}
            />
          </>
        )
      case 'exist':
        return (
          <>
            <PdpUsedCarUpperSection
              isPreviewOpened={isPreviewGalleryOpened}
              activeIndex={galleryIndexActive}
              emitActiveIndex={(e: number) => handlePreviewOpened(e)}
              emitDataImages={(e: Array<string>) => setDataPreviewImages(e)}
            />
            <div className={styles.wrapper}>
              <h1 className={styles.titleCar}>
                {`${capitalizeFirstLetter(
                  usedCarModelDetailsRes?.brandName as string,
                )}  ${modelName} ${usedCarModelDetailsRes?.variantName} ${
                  usedCarModelDetailsRes?.nik
                }`}
              </h1>
              <h3 className={styles.titlePrice}>
                Rp
                {addSeparator(
                  usedCarModelDetailsRes?.priceValue.split('.')[0] as string,
                )}
              </h3>
              <div className={styles.wrapperLocation}>
                <IconLocation
                  width={18}
                  height={18}
                  color="#B4231E"
                  alt="SEVA Location Icon"
                />
                <p className={styles.titleLocation}>
                  {usedCarModelDetailsRes?.cityName}
                </p>
              </div>
            </div>
            <PdpUsedCarLowerSection
              showAnnouncementBox={showAnnouncementBox}
              isShowAnnouncementBox={showAnnouncementBox}
            />
          </>
        )
      default:
        return <ProductDetailEmptyState model={''} message={''} />
    }
  }
  return (
    <>
      <div
        className={clsx({
          [styles.container]: true,
          [styles.showAAnnouncementBox]: showAnnouncementBox,
        })}
      >
        <HeaderMobile
          isActive={isActive}
          setIsActive={setIsActive}
          style={{
            position: 'fixed',
          }}
          emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
          setShowAnnouncementBox={saveShowAnnouncementBox}
          isShowAnnouncementBox={showAnnouncementBox}
          pageOrigination={'PDP - ' + valueMenuTabCategory()}
          isOTO={isOTO}
        />
        <div className={styles.content}>{renderContent()}</div>
        <FooterMobile pageOrigination="PDP - " />
      </div>

      {isPreviewGalleryOpened && (
        <UsedCarOverlayGallery
          items={dataPreviewImages}
          emitActiveIndex={(e: number) => handlePreviewClosed(e)}
          activeIndex={galleryIndexActive}
        />
      )}
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => {
          setIsOpenCitySelectorModal(false)
        }}
        cityListFromApi={cities}
        pageOrigination="PDP"
        sourceButton={''}
      />
      {isModalOpenend && (
        <AdaOTOdiSEVALeadsForm onCancel={closeLeadsForm} onPage="PDP" />
      )}
      <ShareModal
        open={isOpenShareModal}
        onCancel={() => setIsOpenShareModal(false)}
        data-testid={elementId.PDP.ShareModal.Container}
      />
    </>
  )
}
