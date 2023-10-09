import { Modal } from 'antd'
import React, {
  TextareaHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ModalProps } from 'antd'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms'
import styles from '../../../styles/components/organisms/popupPromo.module.scss'
import elementId from 'helpers/elementIds'
import { PopupPromoDataItemType, trackDataCarType } from 'utils/types/utils'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { LoanRank } from 'utils/types/models'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getBrandAndModelValue } from 'utils/handler/getBrandAndModel'

const initPromoList: PopupPromoDataItemType[] = [
  // {
  //   title: 'Promo Cuma di SEVA',
  //   body: [
  //     {
  //       title: 'Cashback 1 Angsuran',
  //       body: 'Dapatkan max. cashback 4 juta rupiah setelah melakukan pembayaran Angsuran Pertama. Khusus pembelian mobil secara kredit dengan tenor 1 - 5 tahun melalui ACC dan TAF.',
  //     },
  //     {
  //       title: 'Bebas 1 Tahun Asuransi Comprehensive Garda Oto',
  //       body: 'Berlaku untuk pembelian mobil baru Toyota dan Daihatsu dengan tipe mobil passenger car. Khusus pembelian mobil secara kredit dengan tenor 3 - 5 tahun.',
  //     },
  //   ],
  //   snk: 'https://www.seva.id/info/promo/cuma-di-seva/',
  // },
  {
    title: 'Paket Toyota Spektakuler',
    body: [
      {
        title: '',
        body: 'Dapatkan bunga spesial mulai dari 0%, bebas biaya administrasi atau bebas 2 tahun asuransi comprehensive hingga 20 juta rupiah untuk pembelian mobil baru Toyota Veloz, Avanza, Raize, dan Rush secara kredit. Khusus tipe Zenix Gasoline, berlaku bunga spesial mulai dari 2.77%.',
      },
    ],
    snk: 'https://www.seva.id/info/promo/toyota-spektakuler/',
  },

  {
    title: 'Promo Trade-In Daihatsu',
    body: [
      {
        title: 'Potongan DP & Cashback Daihatsu',
        body: 'Dapatkan cashback tambahan trade-in senilai 1 juta rupiah untuk pembelian mobil baru Brand Daihatsu semua tipe (LCGC dan non-LCGC).',
      },
    ],
    snk: 'https://www.seva.id/info/promo/promo-trade-in-daihatsu/',
  },
]

type PopupPromo = Omit<ModalProps, 'children'> & {
  data?: PopupPromoDataItemType[]
  additionalContainerClassname?: string
  carData?: any
}

export const PopupPromo = (props: PopupPromo) => {
  const [promoList, setPromoList] = useState(initPromoList)
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)

  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )
  const IsShowBadgeCreditOpportunity = getSessionStorage(
    SessionStorageKey.IsShowBadgeCreditOpportunity,
  )

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const trackClickPromoSK = (promoDetail: string, promoOrder: number) => {
    trackEventCountly(CountlyEventNames.WEB_PROMO_SK_CLICK, {
      CAR_BRAND: getBrandAndModelValue(props.carData.brand),
      CAR_MODEL: getBrandAndModelValue(props.carData.model),
      CAR_ORDER: props.carData.carOder,
      PROMO_DETAILS: promoDetail,
      PROMO_ORDER: promoOrder + 1,
      PELUANG_KREDIT_BADGE:
        isUsingFilterFinancial && IsShowBadgeCreditOpportunity
          ? dataCar?.PELUANG_KREDIT_BADGE
          : 'Null',
      PAGE_ORIGINATION: 'PDP',
    })
  }
  useEffect(() => {
    if (props.data) {
      setPromoList(props.data)
    }
  }, [props.data])

  const lastIndex = useMemo(() => {
    return promoList.length - 1
  }, [promoList])

  return (
    <Modal
      title={
        <Title data-testid={elementId.PLP.Text.JudulPopupPromo}>Promo</Title>
      }
      closeIcon={
        <IconClose
          width={24}
          height={22}
          color={colors.primaryBlack}
          datatestid={elementId.PLP.Close.Button.PopupPromo}
        />
      }
      footer={null}
      className="custom-modal-promo"
      width={343}
      centered
      {...props}
    >
      <div
        className={`${styles.container} ${props.additionalContainerClassname}`}
      >
        {promoList.map((item, index) => (
          <div key={index} className={styles.contentPromo}>
            <span className={styles.titlePromo}>{item.title}</span>
            <div className={styles.bodyWrapper}>
              {item.body.map((body, idx) => (
                <div key={idx} className={styles.bodyContentWrapper}>
                  {body.title && (
                    <span className={styles.bodyTitle}>{body.title}</span>
                  )}
                  <span className={styles.bodyPromo}>{body.body}</span>
                </div>
              ))}
            </div>
            <a
              className={styles.snk}
              target="_blank"
              href={item.snk}
              rel="noreferrer noopener"
              data-testid={elementId.PLP.Button.LihatSNK}
              onClick={() => trackClickPromoSK(item.title, index)}
            >
              Lihat S&K
            </a>
            {index !== lastIndex && <div className={styles.divider}></div>}
          </div>
        ))}
      </div>
    </Modal>
  )
}

const Title = ({
  children,
  ...props
}: TextareaHTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={styles.title} {...props}>
    {children}
  </h3>
)
