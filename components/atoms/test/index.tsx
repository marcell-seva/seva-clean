import Image from 'next/image'
import React from 'react'

import styles from '../../../styles/Article.module.css'

export default function Test({ item }: any) {
  return (
    <div className={styles.wrapperMainInfoDekstop}>
      <Image
        src={item.featured_image}
        alt="article-main-image"
        width={470}
        height={280}
        defaultValue={item.featured_image}
        className={styles.mainImage}
      />
      <div className={styles.flexRowBetween}>
        <div className={styles.capsuleWrapper}>
          <p className={styles.capsuleText}>{item.category}</p>
        </div>
        <p className={styles.dateText}>{item.publish_date}</p>
      </div>
      <div>
        <h4 className={styles.titleText}>{item.title}</h4>
        <p className={styles.descText}>{item.excerpt}</p>
        <button className={styles.wrapperButton}>Baca Selengkapnya</button>
      </div>
    </div>
  )
}
