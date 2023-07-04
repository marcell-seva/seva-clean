import React from 'react'
// import { Pannellum } from 'pannellum-react'
// import { ImageUnavailable } from '../../atoms/imageUnavailable'
import styles from 'styles/saas/components/organism/interior360Viewer.module.scss'
import { Icon360 } from 'components/atoms'
import { interiorImagesListNew } from 'config/Interior360ImageList.config'
import elementId from 'helpers/elementIds'

interface Props {
  isShowAnnouncementBox: boolean | null
}
export const Interior360ViewerTab = ({ isShowAnnouncementBox }: Props) => {
  const getImage = () => {
    const currentUrlPathname = window.location.pathname
    const temp = interiorImagesListNew.filter((item) =>
      currentUrlPathname.includes(item.url),
    )
    if (temp.length === 0) return ''
    return temp[0].source
  }

  const renderNonStatic = () => {
    if (getImage()?.includes('tso')) {
      return (
        <div
          className={styles.container}
          data-testid={elementId.Tab + '360-interior-image'}
        >
          {/* TODO find error */}
          {/* <Pannellum
            width="100%"
            height="100%"
            image={getImage()}
            pitch={-20}
            yaw={0}
            hfov={110}
            autoLoad
          ></Pannellum> */}
          <div className={styles.iconWrapper}>
            <Icon360 />
          </div>
        </div>
      )
    } else {
      return <iframe className={styles.styledIframe} src={getImage()} />
    }
  }

  // if (!getImage()) return <ImageUnavailable type={'interior 360'} />

  return (
    <div style={{ marginTop: isShowAnnouncementBox ? '24px' : '0px' }}>
      {getImage()?.includes('StaticImage') ? (
        <img className={styles.staticImage} src={getImage()}></img>
      ) : (
        renderNonStatic()
      )}
    </div>
  )
}
