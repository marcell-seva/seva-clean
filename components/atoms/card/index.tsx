import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/atoms/Card.module.css'
import { rupiah } from '../../../utils'
import { PropsCard } from '../../../utils/types/props'

const Card: React.FC<PropsCard> = ({ item }): JSX.Element => {
  const parseProductUrl = (variant: string, type: string) => {
    const variantParsed: string = variant.split(' ')[0].toLowerCase()
    const typeParsed: string = type.replace(/ /g, '-').toLowerCase()
    const url: string = `https://www.seva.id/mobil-baru/${variantParsed}/${typeParsed}`
    return url
  }

  return (
    <div className={styles.card}>
      <a href={parseProductUrl(item.brand, item.model)}>
        <Image
          src={item.image}
          width={600}
          height={420}
          alt="seva-product"
          sizes="(min-width: 1024px) 21.5vw, 17vw"
          className={styles.image}
        />
        <div className={styles.detail}>
          <h1 className={styles.titleText}>
            {item.brand} {item.model}
          </h1>
          <div>
            <p className={styles.subTitleText}>Cicilan mulai dari </p>
            <p className={styles.price}>
              Rp{' '}
              {rupiah(
                item.variants[item.variants.length - 1].monthlyInstallment,
              )}
            </p>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Card
