import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../../../styles/Article.module.css'
import { api } from '../../../services/api'
import {
  IconBackButton,
  IconNextButton,
  ShimmerCardArticle,
  Test,
} from '../../atoms'
import { useIsMobile } from '../../../utils'
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

export default function Article({ data }: any) {
  const isMobile = useIsMobile()
  const [categoryActive, setCategoryActive] = useState<string>('Semua Artikel')
  const [subArticle, setSubArticle] = useState<any>(data)
  const redirectArticle = 'https://www.seva.id/blog/'
  const categoryList = [
    { title: 'Semua Artikel', id: 65 },
    { title: 'Modifikasi', id: 796 },
    { title: 'Review Otomotif', id: 972 },
    { title: 'Tips & Rekomendasi', id: 974 },
    { title: 'Keuangan', id: 979 },
    { title: 'Travel & Lifestyle', id: 981 },
    { title: 'Hobi & Komunitas', id: 993 },
  ]

  const ShadowSlider = () => <div className={styles.shadowSlider}></div>
  const getArticleByCategory = async (payload: string) => {
    try {
      setSubArticle([])
      const res = await api.getSubArticle(payload)
      setSubArticle(res)
    } catch (error) {
      throw error
    }
  }

  const ItemMobile = ({ item }: any) => (
    <a href={item.url} className={styles.itemArticleMobile}>
      <Image
        src={item.featured_image}
        alt="article-sub-main-image"
        width={86}
        height={86}
        sizes="(max-width: 1024px) 12vw, 20vw"
        className={styles.subMainImage}
      />
      <div className={styles.mainInfo}>
        <div className={styles.capsuleWrapper}>
          <p className={styles.capsuleText}>{item.category}</p>
        </div>
        <h4 className={styles.titleText}>{item.title}</h4>
        <p className={styles.dateText}>{item.publish_date}</p>
      </div>
    </a>
  )

  const ItemDekstop = ({ item }: any) => (
    <a href={item.url} className={styles.itemArticleDekstop}>
      <Image
        src={item.featured_image}
        alt="article-sub-main-image"
        width={245}
        height={135}
        sizes="(max-width: 1024px) 12vw, 20vw"
        className={styles.subMainImage}
      />
      <div className={styles.capsuleWrapper}>
        <p className={styles.capsuleText}>{item.category}</p>
      </div>
      <p className={styles.dateText}>{item.publish_date}</p>
      <p className={styles.descSubText}>{item.title}</p>
    </a>
  )

  const MainArticleMobile = ({ item }: any) => (
    <a href={item.url} className={styles.wrapperMainInfoMobile}>
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
    </a>
  )

  const MainArticleDesktop = ({ item }: any) => (
    <a href={item.url} className={styles.wrapperMainInfoDekstop}>
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
    </a>
  )

  const Category = ({ name, id, isActive }: CategoryProps) => (
    <button
      onClick={() => {
        setCategoryActive(name)
        if (id === undefined || id.toString() === '65') setSubArticle(data)
        else getArticleByCategory(id)
      }}
      className={isActive ? styles.selectorActive : styles.selectorInActive}
    >
      {name}
    </button>
  )

  const renderSubArticle = () => {
    if (subArticle.length === 0) {
      return (
        <div className={styles.shimmerWrapper}>
          <ShimmerCardArticle />
          <ShimmerCardArticle />
          <ShimmerCardArticle />
          <ShimmerCardArticle />
        </div>
      )
    } else if (isMobile && subArticle.length > 0) {
      return subArticle
        .slice(0, 3)
        .map((item: any, key: number) => <ItemMobile key={key} item={item} />)
    } else {
      return subArticle
        .slice(0, 4)
        .map((item: any, key: number) => <ItemDekstop key={key} item={item} />)
    }
  }

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
            {!isMobile && (
              <>
                <div
                  className={`image-swiper-button-prev-article ${styles.navigationBackButton}`}
                >
                  <IconBackButton width={80} height={80} />
                </div>
                <div
                  className={`image-swiper-button-next-article ${styles.navigationNextButton}`}
                >
                  <IconNextButton width={80} height={80} />
                </div>
              </>
            )}
            <div className="swiper mySwiperArticle">
              <div className="swiper-wrapper">
                {categoryList.map((item: any) => (
                  <div className={`swiper-slide ${styles.slide}`} key={item.id}>
                    <Category
                      name={item.title}
                      isActive={categoryActive === item.title}
                      id={item.id}
                    />
                  </div>
                ))}
                {!isMobile && (
                  <>
                    <div className={`swiper-slide ${styles.slide}`}>
                      <ShadowSlider />
                    </div>
                    <div className={`swiper-slide ${styles.slide}`}>
                      <ShadowSlider />
                    </div>
                    <div className={`swiper-slide ${styles.slide}`}>
                      <ShadowSlider />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.collectionArticle}>{renderSubArticle()}</div>
        </div>
      </div>
    </div>
  )
}
