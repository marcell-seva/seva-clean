import React, { useRef } from 'react'
import dynamic from 'next/dynamic'

const Tridi: any = dynamic(() => import('react-tridi'), {
  ssr: false,
})

import 'react-tridi/dist/index.css'
import styles from 'styles/saas/components/organism/exterior360Viewer.module.scss'
import { RotateLeft, RotateRight } from 'components/atoms'
import { exteriorImagesListNew } from 'config/Exterior360ImageList.config'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
interface Props {
  isShowAnnouncementBox: boolean | null
}
const Exterior360ViewerTab = ({ isShowAnnouncementBox }: Props) => {
  const tridiRef = useRef<any>(null)
  const router = useRouter()

  const getImage = () => {
    const currentUrlPathname = router.asPath
    const temp = exteriorImagesListNew.filter((item) =>
      currentUrlPathname.includes(item.url),
    )
    if (temp.length === 0) return []
    return temp[0].source
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
      />
      <div className={styles.buttonWrapper}>
        <div
          onClick={() => tridiRef.current?.next()}
          data-testid={elementId.Tab + '360-exterior-previous-image'}
        >
          <RotateRight width={65} height={30} color={'#000'} />
        </div>
        <div
          onClick={() => tridiRef.current?.prev()}
          data-testid={elementId.Tab + '360-exterior-next-image'}
        >
          <RotateLeft width={65} height={30} color={'#000'} />
        </div>
      </div>
    </div>
  )
}

export default Exterior360ViewerTab
