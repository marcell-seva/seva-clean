import Image from 'next/image'
import React from 'react'
import styles from 'styles/saas/components/atoms/Card.module.scss'
import { rupiah } from 'utils'
import { Car } from 'utils/types'
type TypesCar = {
  item: Car
}
const Card: React.FC<TypesCar> = ({ item }): JSX.Element => {
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
          className={styles.cardImages}
        />
        <div className={styles.cardDetail}>
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
