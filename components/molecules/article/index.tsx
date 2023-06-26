import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from 'styles/saas/components/molecules/Article.module.scss'
import { api } from 'services/api'
import {
  IconBackButton,
  IconNextButton,
  ShimmerCardArticle,
} from 'components/atoms'
import { useIsMobile } from 'utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import { Article, PropsArticle, PropsCategory } from 'utils/types'

type TypesArticle = {
  item: Article
}

const Article: React.FC<PropsArticle> = ({ data }): JSX.Element => {
  const isMobile = useIsMobile()
  const headerText = 'Baca Artikel Terkini'
  const buttonText = 'LIHAT SEMUA'
  const articleText = 'Baca Selengkapnya'
  const [categoryActive, setCategoryActive] = useState<string>('Semua Artikel')
  const [subArticle, setSubArticle] = useState<Array<Article> | Array<any>>(
    data,
  )
  const redirectArticle: string = 'https://www.seva.id/blog/'
  const categoryList: Array<{ id: number; title: string }> = [
    { title: 'Semua Artikel', id: 65 },
    { title: 'Modifikasi', id: 974 },
    { title: 'Review Otomotif', id: 972 },
    { title: 'Tips & Rekomendasi', id: 993 },
    { title: 'Keuangan', id: 979 },
    { title: 'Travel & Lifestyle', id: 796 },
    { title: 'Hobi & Komunitas', id: 981 },
  ]
  const ShadowSlider: React.FC = (): JSX.Element => (
    <div className={styles.shadowSlider} />
  )

  const ItemMobile: React.FC<TypesArticle> = ({ item }): JSX.Element => (
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
        <h1 className={styles.titleText}>{item.title}</h1>
        <p className={styles.dateText}>{item.publish_date}</p>
      </div>
    </a>
  )

  const ItemDekstop: React.FC<TypesArticle> = ({ item }): JSX.Element => (
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

  const MainArticleMobile: React.FC<TypesArticle> = ({ item }): JSX.Element => (
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
        <h1 className={styles.titleText}>{item.title}</h1>
        <p className={styles.dateText}>{item.publish_date}</p>
      </div>
    </a>
  )

  const MainArticleDesktop: React.FC<TypesArticle> = ({
    item,
  }): JSX.Element => (
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
        <h1 className={styles.titleText}>{item.title}</h1>
        <p className={styles.descText}>{item.excerpt}</p>
        <button className={styles.wrapperButton}>{articleText}</button>
      </div>
    </a>
  )

  const Category: React.FC<PropsCategory> = ({
    name,
    id,
    isActive,
  }): JSX.Element => (
    <button
      onClick={() => {
        setCategoryActive(name)
        if (id === undefined || id === 65) setSubArticle(data)
        else getArticleByCategory(id)
      }}
      className={isActive ? styles.selectorActive : styles.selectorInActive}
    >
      {name}
    </button>
  )

  const getArticleByCategory = async (payload: number): Promise<any> => {
    try {
      setSubArticle([])
      const res: any = await api.getSubArticle(payload)
      setSubArticle(res)
    } catch (error) {
      throw error
    }
  }

  const renderSubArticle = (): JSX.Element | Array<JSX.Element> => {
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
        <h1 className={styles.headerText}>{headerText}</h1>
        <a
          href={redirectArticle}
          target="_blank"
          className={styles.redirectText}
          rel="noreferrer"
        >
          {buttonText}
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
              <Swiper
                cssMode
                navigation={{
                  nextEl: '.image-swiper-button-next-article',
                  prevEl: '.image-swiper-button-prev-article',
                }}
                slidesPerGroup={3}
                slidesPerView={4}
                spaceBetween={10}
                breakpoints={{
                  1024: {
                    slidesPerGroup: 3,
                    slidesPerView: 4,
                    spaceBetween: 10,
                    cssMode: false,
                  },
                }}
                modules={[Navigation]}
              >
                {categoryList.map((item: any) => (
                  <SwiperSlide className={styles.slide} key={item.id}>
                    <Category
                      name={item.title}
                      isActive={categoryActive === item.title}
                      id={item.id}
                    />
                  </SwiperSlide>
                ))}
                {!isMobile && (
                  <>
                    <SwiperSlide className={styles.slide}>
                      <ShadowSlider />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                      <ShadowSlider />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                      <ShadowSlider />
                    </SwiperSlide>
                  </>
                )}
              </Swiper>
            </div>
          </div>
          <div className={styles.collectionArticle}>{renderSubArticle()}</div>
        </div>
      </div>
    </div>
  )
}
export default Article
