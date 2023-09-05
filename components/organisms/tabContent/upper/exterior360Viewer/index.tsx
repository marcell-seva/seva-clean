import React, { useRef } from 'react'
import dynamic from 'next/dynamic'

const Tridi: any = dynamic(() => import('react-tridi'), {
  ssr: false,
})

import 'react-tridi/dist/index.css'
import styles from 'styles/components/organisms/exterior360Viewer.module.scss'
import { RotateLeft, RotateRight } from 'components/atoms'
import { exteriorImagesListNew } from 'config/Exterior360ImageList.config'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { LoanRank } from 'utils/types/models'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useCar } from 'services/context/carContext'
interface Props {
  isShowAnnouncementBox: boolean | null
}
const Exterior360ViewerTab = ({ isShowAnnouncementBox }: Props) => {
  const tridiRef = useRef<any>(null)
  const router = useRouter()
  const loanRankcr = router.query.loanRankCVL ?? ''
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  const { carModelDetails } = useCar()

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const getImage = () => {
    const currentUrlPathname = router.asPath
    const temp = exteriorImagesListNew.filter((item) =>
      currentUrlPathname.includes(item.url),
    )
    if (temp.length === 0) return []
    return temp[0].source
  }

  const trackCountOnRotate = () => {
    const hasTracked360Exterior = getSessionStorage(
      SessionStorageKey.HasTracked360Exterior,
    )

    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }

    if (!hasTracked360Exterior) {
      trackEventCountly(CountlyEventNames.WEB_PDP_CAR_ROTATE_CLICK, {
        CAR_BRAND: carModelDetails?.brand ?? 'Null',
        CAR_MODEL: carModelDetails?.model ?? 'Null',
        PELUANG_KREDIT_BADGE: isUsingFilterFinancial ? creditBadge : 'Null',
      })
      saveSessionStorage(SessionStorageKey.HasTracked360Exterior, 'true')
    }
  }

  const onDragEndHandler = () => {
    trackCountOnRotate()
  }

  const onClickRotateRight = () => {
    trackCountOnRotate()
    tridiRef.current?.next()
  }

  const onClickRotateLeft = () => {
    trackCountOnRotate()
    tridiRef.current?.prev()
  }

  return (
    <div
      className={styles.container}
      style={{ marginTop: isShowAnnouncementBox ? '44px' : '0px' }}
      data-testid={elementId.Tab + '360-exterior-image'}
    >
      <Tridi
        ref={tridiRef}
        images={getImage()}
        count="18"
        inverse
        className={styles.tridiStyle}
        onDragEnd={onDragEndHandler}
      />
      <div className={styles.buttonWrapper}>
        <div
          onClick={onClickRotateRight}
          data-testid={elementId.Tab + '360-exterior-previous-image'}
        >
          <RotateRight width={65} height={30} color={'#000'} />
        </div>
        <div
          onClick={onClickRotateLeft}
          data-testid={elementId.Tab + '360-exterior-next-image'}
        >
          <RotateLeft width={65} height={30} color={'#000'} />
        </div>
      </div>
    </div>
  )
}

export default Exterior360ViewerTab
