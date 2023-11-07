import clsx from 'clsx'
import { DownOutlined } from 'components/atoms'
import React, { useState } from 'react'
import styles from 'styles/components/molecules/faqRefinancing.module.scss'
import { colors } from 'utils/helpers/style/colors'

export const FaqRefinancing = () => {
  const [collIndex, setCollIndex] = useState<number[]>([-1]) //collection index
  const [expandItem, setExpandItem] = useState<number[]>([-1]) //collection expand item
  const listFaq = [
    {
      question: `Apa itu Fasilitas Dana?`,
      answer: ` Fasilitas Dana adalah solusi untuk kebutuhan dana yang dapat langsung cair untuk 
      memenuhi semua kebutuhanmu, seperti modal usaha, pendidikan, pernikahan, renovasi rumah, 
      dan lainnya. Dengan jaringan yang tersebar luas, kamu dapat dengan mudah, aman, dan nyaman 
      mendapatkan Fasilitas Dana dengan jaminan BPKB mobil.`,
    },
    {
      question: `Apakah Fasilitas Dana merupakan KTA?`,
      answer: ` Fasilitas Dana tidak sama dengan Kredit Tanpa Agunan (KTA). 
      Fasilitas Dana memberikan bunga dan pencairan yang lebih kompetitif, serta diperlukan 
      jaminan BPKB mobil untuk dapat mencairkan dana yang kamu butuhkan.`,
    },
    {
      question: `Berapa lama tenor pinjaman yang disediakan?`,
      answer: ` Dana yang dipinjam dapat dicicil selama 1 – 4 Tahun.`,
    },
    {
      question: `Apa saja keuntungan dari meminjam dana ke Fasilitas Dana SEVA?`,
      answer: ` Dengan jaringan SEVA yang tersebar luas di berbagai kota di Indonesia, 
      kamu dapat mencairkan dana secara cepat dengan menjaminkan BPKB mobilmu. Dapatkan berbagai 
      promo menarik, bunga, dan jumlah pencairan yang kompetitif, secara mudah, aman, dan nyaman 
      sebagai solusi akan kebutuhan modal usaha, pendidikan, renovasi rumah, pernikahan, dan lainnya.`,
    },
  ]

  const onChooseItem = (index: number) => {
    if (collIndex.includes(index)) {
      const removeItem = collIndex.filter((item) => item !== index)
      setCollIndex([...removeItem])
      return setTimeout(() => {
        setExpandItem([...removeItem])
      }, 450)
    }

    setCollIndex([...collIndex, index])
    setExpandItem([...expandItem, index])
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {listFaq.map((item, index) => (
          <div
            className={clsx({
              [styles.boxFq]: true,
              [styles.boxFqOpened]: collIndex.includes(index),
            })}
            key={index}
            onClick={() => onChooseItem(index)}
          >
            <div className={styles.questionRow}>
              <span>{item.question}</span>
              <div
                className={clsx({
                  [styles.styledIcon]: true,
                  [styles.styledIconOpened]: collIndex.includes(index),
                })}
              >
                <DownOutlined
                  color={colors.primaryBlue}
                  width={10.64}
                  height={9.28}
                />
              </div>
            </div>
            {expandItem.includes(index) && (
              <div className={styles.answerBox}>
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
