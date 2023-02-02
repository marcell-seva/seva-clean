import Image from 'next/image'
import React from 'react'
import { isVariableDeclarationList } from 'typescript'
import styles from '../../../styles/atoms/Card.module.css'

export default function Card({ item }: any) {
  const parseProductUrl = (variant: string, type: string) => {
    const variantParsed: string = variant.split(' ')[0].toLowerCase()
    const typeParsed: string = type.replace(/ /g, '-').toLowerCase()
    const url: string = `https://www.seva.id/mobil-baru/${variantParsed}/${typeParsed}`
    return url
  }

  const getNumber = (num: number) => {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e6, symbol: ' Jt' },
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value
      })

    const result = item
      ? (num / item.value).toFixed(2).replace(rx, '$1') + item.symbol
      : '0'

    return result.replace('.', ',')
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
              {getNumber(
                item.variants[item.variants.length - 1].monthlyInstallment,
              )}
            </p>
          </div>
        </div>
      </a>
    </div>
  )
}
