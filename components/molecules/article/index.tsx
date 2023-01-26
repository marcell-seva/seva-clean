import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../../../styles/Article.module.css'
import { api } from '../../../services/api'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { IconBackButton, IconNextButton } from '../../atoms'

interface Article {
  title: string
  category: string
  category_link: string
  url: string
  excerpt: string
  publish_date: string
  writer_name: string
  writer_initial: string
  featured_image: string
}

interface CategoryProps {
  name: string
  id?: string
  isActive?: boolean
}

export default function Article({ data, getArticle }: any) {
  const [categoryActive, setCategoryActive] = useState<string>('Semua Artikel')
  const [subArticle, setSubArticle] = useState<any>(data)
  const redirectArticle = 'https://www.seva.id/blog/'

  const getArticleByCategory = async (payload: string) => {
    try {
      const res = await api.getSubArticle(payload)
      setSubArticle(res)
    } catch (error) {
      throw error
    }
  }

  const ItemMobile = ({ item }: any) => (
    <div className={styles.itemArticleMobile}>
      <Image
        src={item.featured_image}
        alt="article-sub-main-image"
        width={86}
        height={86}
        className={styles.subMainImage}
      />
      <div className={styles.mainInfo}>
        <div className={styles.capsuleWrapper}>
          <p className={styles.capsuleText}>{item.category}</p>
        </div>
        <h4 className={styles.titleText}>{item.title}</h4>
        <p className={styles.dateText}>{item.publish_date}</p>
      </div>
    </div>
  )

  const ItemDekstop = ({ item }: any) => (
    <div className={styles.itemArticleDekstop}>
      <Image
        src={item.featured_image}
        alt="article-sub-main-image"
        width={245}
        height={135}
        className={styles.subMainImage}
      />
      <div className={styles.capsuleWrapper}>
        <p className={styles.capsuleText}>{item.category}</p>
      </div>
      <p className={styles.dateText}>{item.publish_date}</p>
      <p className={styles.descSubText}>{item.title}</p>
    </div>
  )

  const MainArticleMobile = ({ item }: any) => (
    <div className={styles.wrapperMainInfoMobile}>
      <Image
        src={item.featured_image}
        alt="article-main-image"
        width={470}
        height={280}
        className={styles.mainImage}
      />
      <div className={styles.mainInfo}>
        <div className={styles.capsuleWrapper}>
          <p className={styles.capsuleText}>{item.category}</p>
        </div>
        <h4 className={styles.titleText}>{item.title}</h4>
        <p className={styles.dateText}>{item.publish_date}</p>
      </div>
    </div>
  )

  const MainArticleDesktop = ({ item }: any) => {
    return (
      <div className={styles.wrapperMainInfoDekstop}>
        <Image
          src={item.featured_image}
          alt="article-main-image"
          width={470}
          height={280}
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

  const Category = ({ name, id, isActive }: CategoryProps) => (
    <button
      onClick={() => {
        setCategoryActive(name)
        if (id === undefined) setSubArticle(data)
        else getArticleByCategory(id)
      }}
      className={isActive ? styles.selectorActive : styles.selectorInActive}
    >
      {name}
    </button>
  )

  return (
    <div className={styles.container}>
      <div className={styles.flexRowBetween}>
        <h1 className={styles.headerText}>Baca Artikel Terkini</h1>
        <a
          href={redirectArticle}
          target="_blank"
          className={styles.redirectText}
          rel="noreferrer"
        >
          LIHAT SEMUA
        </a>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.mainArticle}>
          <MainArticleMobile item={data[0]} />
          <MainArticleDesktop item={data[0]} />
        </div>

        <div className={styles.subArticle}>
          <div className={styles.category}>
            <div
              className={`image-swiper-button-prev-article-list ${styles.navigationBackButton}`}
            >
              <IconBackButton width={80} height={80} />
            </div>
            <div
              className={`image-swiper-button-next-article-list ${styles.navigationNextButton}`}
            >
              <IconNextButton width={80} height={80} />
            </div>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.image-swiper-button-next-article-list',
                prevEl: '.image-swiper-button-prev-article-list',
                disabledClass: 'swiper-button-disabled',
              }}
              slidesPerGroup={3}
              slidesPerView={4}
              spaceBetween={10}
            >
              <SwiperSlide>
                <Category
                  name="Semua Artikel"
                  isActive={categoryActive === 'Semua Artikel'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Category
                  name="Modifikasi"
                  id="974"
                  isActive={categoryActive === 'Modifikasi'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Category
                  name="Review Otomotif"
                  id="972"
                  isActive={categoryActive === 'Review Otomotif'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Category
                  name="Tips & Rekomendasi"
                  id="993"
                  isActive={categoryActive === 'Tips & Rekomendasi'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Category
                  name="Keuangan"
                  id="979"
                  isActive={categoryActive === 'Keuangan'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Category
                  name="Travel & Lifestyle"
                  id="796"
                  isActive={categoryActive === 'Travel & Lifestyle'}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Category
                  name="Hobi & Komunitas"
                  id="981"
                  isActive={categoryActive === 'Hobi & Komunitas'}
                />
              </SwiperSlide>
            </Swiper>
          </div>

          <div className={styles.collectionArticle}>
            {subArticle.slice(0, 3).map((item: any, key: number) => (
              <ItemMobile key={key} item={item} />
            ))}
            {/* desktop */}
            {subArticle.slice(0, 4).map((item: any, key: number) => (
              <ItemDekstop key={key} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
