import React from 'react'
import styles from 'styles/saas/components/molecules/shareModal.module.scss'
import { Modal, ModalProps } from 'antd'
import {
  IconClose,
  IconFacebook,
  IconLink,
  IconTwitter,
  IconWhatsapp,
} from 'components/atoms'
import elementId from 'helpers/elementIds'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { LocalStorageKey } from 'utils/models/models'
// import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import {
  trackCarVariantSharePopupClose,
  trackCarVariantSharePopupCopyLinkClick,
  trackCarVariantSharePopupTwitterClick,
  trackCarVariantSharePopupWaClick,
} from 'helpers/amplitude/seva20Tracking'
import { CityOtrOption } from 'utils/types/utils'
import { client } from 'const/const'

type Props = ModalProps

export const ShareModal = (props: Props) => {
  const { carModelDetails } = useContextCarModelDetails()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModelDetails?.brand ?? '',
      Car_Model: carModelDetails?.model ?? '',
      // OTR: `Rp${replacePriceSeparatorByLocalization(
      //   carModelDetails?.variants[0].priceValue as number,
      //   LanguageCode.id,
      // )}`,
      City: cityOtr?.cityName || 'null',
      Page_Origination_URL: client ? window.location.href : '',
    }
  }

  const onClickFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=Saya lagi lihat-lihat mobil yang ini di SEVA. Gimana pendapat kamu? Cocok ga? 👉🏻`,
    )
  }

  const onClickTwitter = () => {
    trackCarVariantSharePopupTwitterClick(getDataForAmplitude())
    window.open(
      `https://twitter.com/intent/tweet?&text=Saya lagi lihat-lihat mobil yang ini di SEVA. Gimana pendapat kamu? Cocok ga? 👉🏻 ${window.location.href}`,
    )
  }

  const onClickWhatsapp = () => {
    trackCarVariantSharePopupWaClick(getDataForAmplitude())
    window.open(
      `https://api.whatsapp.com/send?text=Saya lagi lihat-lihat mobil yang ini di SEVA. Gimana pendapat kamu? Cocok ga? 👉🏻 ${window.location.href}`,
    )
  }

  const onClickCopy = () => {
    trackCarVariantSharePopupCopyLinkClick(getDataForAmplitude())
    navigator.clipboard.writeText(window.location.href)
  }

  const afterCloseModalHandler = () => {
    trackCarVariantSharePopupClose(getDataForAmplitude())
  }

  return (
    <Modal
      closable={true}
      closeIcon={
        <IconClose
          width={24}
          height={24}
          color="#13131B"
          datatestid={elementId.PDP.Button.Close.PopupShare}
        />
      }
      centered
      className="share-custom-modal"
      footer={null}
      maskStyle={{ background: 'rgba(19, 19, 27, 0.5)' }}
      afterClose={afterCloseModalHandler}
      {...props}
    >
      <h2 className={styles.title}>Bagikan ke Temanmu:</h2>

      <div className={styles.itemsGroup}>
        <div
          role="button"
          className={styles.itemWrapper}
          onClick={onClickFacebook}
          data-testid={elementId.PDP.CTA.Popup.Facebook}
        >
          <div className={styles.iconWrapper}>
            <IconFacebook width={16} height={16} color="#337FFF" />
          </div>
          <span className={styles.itemLabel}>Facebook</span>
        </div>

        <div
          role="button"
          className={styles.itemWrapper}
          onClick={onClickTwitter}
          data-testid={elementId.PDP.CTA.Popup.Twitter}
        >
          <div className={styles.iconWrapper}>
            <IconTwitter width={16} height={16} color="#33CCFF" />
          </div>
          <span className={styles.itemLabel}>Twitter</span>
        </div>

        <div
          role="button"
          className={styles.itemWrapper}
          onClick={onClickWhatsapp}
          data-testid={elementId.PDP.CTA.Popup.WA}
        >
          <div className={styles.iconWrapper}>
            <IconWhatsapp width={16} height={16} />
          </div>
          <span className={styles.itemLabel}>WhatsApp</span>
        </div>

        <div
          role="button"
          className={styles.itemWrapper}
          onClick={onClickCopy}
          data-testid={elementId.PDP.CTA.Popup.CopyLink}
        >
          <div className={styles.iconWrapper}>
            <IconLink width={16} height={16} color="#246ED4" />
          </div>
          <span className={styles.itemLabel}>Salin Tautan</span>
        </div>
      </div>
    </Modal>
  )
}
