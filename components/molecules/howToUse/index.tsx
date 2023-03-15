import React from 'react'
import styles from 'styles/saas/components/molecules/HowToUse.module.scss'
import Image from 'next/image'
import blueRoundedImage from '/assets/vector/howToUse/blueRounded.png'
import redRoundedImage from '/assets/vector/howToUse/redRounded.png'
import { HowToUse, PropsHowToUse } from 'utils/types'

type TypesHowToUse = {
  data: HowToUse
}

const HowToUse: React.FC<TypesHowToUse> = ({ data }): JSX.Element => {
  const imageRootPath = 'https://api.sslpots.com'

  const Info: React.FC<PropsHowToUse> = ({
    title,
    desc,
    icon,
  }): JSX.Element => (
    <div className={styles.detailWrapper}>
      <div className={styles.bundleIcon}>
        <Image
          src={icon}
          alt="seva-icon-how-to-use"
          width={40}
          height={40}
          className={styles.icon}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.titleText}>{title}</h3>
        <p className={styles.descText}>{desc}</p>
      </div>
    </div>
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundLayer}>
        <div className={styles.wrapperVectorBlue}>
          <Image
            src={blueRoundedImage}
            alt="seva-vector-blue-rounded"
            width={200}
            height={140}
            className={styles.vectorBlueRounded}
          />
        </div>
        <div className={styles.wrapperVectorRed}>
          <Image
            src={redRoundedImage}
            alt="seva-vector-red-rounded"
            width={200}
            height={140}
            className={styles.vectorRedRounded}
          />
        </div>
      </div>
      <div className={styles.foreGroundLayer}>
        <h2 className={styles.headerText}>{data.head_title}</h2>
        <div className={styles.stepDetail}>
          <Info
            title={data.title_1}
            desc={data.subtitle_1}
            icon={`${imageRootPath}${data.icon_1.data.attributes.url}`}
          />
          <Info
            title={data.title_2}
            desc={data.subtitle_2}
            icon={`${imageRootPath}${data.icon_2.data.attributes.url}`}
          />
          <div className={styles.separator} />
          <Info
            title={data.title_3}
            desc={data.subtitle_3}
            icon={`${imageRootPath}${data.icon_3.data.attributes.url}`}
          />
        </div>
      </div>
    </div>
  )
}

export default HowToUse
