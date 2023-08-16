import React from 'react'
import { saveLocalStorage } from 'utils/handler/localStorage'
import DOMPurify from 'dompurify'
import { trackCarOfTheMonthItemClick } from 'helpers/amplitude/seva20Tracking'
import { carBrand } from './COMImage'
import { LocalStorageKey } from 'utils/enum'
import { client } from 'utils/helpers/const'
// import { getToken } from 'utils/handler/auth'
// import { useModalContext } from 'services/context/modalContext'

type carModel = {
  name: string
  desc: string
  link: string
}
interface InformationProps {
  carBrand: carBrand[]
  carModel: carModel[]
  tabIndex: number
  onSendOffer: () => void
  // onCheckLogin: () => void
}

export function Information({
  carBrand,
  tabIndex,
  carModel,
  onSendOffer,
}: // onCheckLogin,
InformationProps) {
  // const { patchModal } = useModalContext()
  return (
    <>
      <div className="information-wrapper-com">
        <div className="wrapper-com">
          <span className="car-title-com">{carModel[tabIndex]?.name}</span>
          <div
            className="car-desc-com"
            dangerouslySetInnerHTML={{
              __html: client
                ? DOMPurify.sanitize(carModel[tabIndex]?.desc)
                : carModel[tabIndex]?.desc,
            }}
          />
          <div className="button-wrapper-com">
            <a
              className="button-hyperlink-com"
              href={carModel[tabIndex]?.link}
              onClick={() => {
                trackCarOfTheMonthItemClick({
                  Car_Brand: carBrand[tabIndex].name,
                  Car_Model: carModel[tabIndex].name,
                })
              }}
            >
              LIHAT RINCIAN
            </a>
            <button
              className="button-com"
              onClick={() => {
                // if (!getToken()) {
                //   patchModal({ isOpenContactUsModal: true })
                //   onCheckLogin()
                // } else {
                // }
                saveLocalStorage(
                  LocalStorageKey.Model,
                  `${carModel[tabIndex].name}`,
                )
                onSendOffer()
              }}
            >
              MINTA PENAWARAN
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
