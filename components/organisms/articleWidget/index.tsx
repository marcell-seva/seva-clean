import React, { useState } from 'react'
import styles from 'styles/components/organisms/articleWidget.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { Article } from 'utils/types'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import elementId from 'utils/helpers/trackerId'
import { NavigationTabV2 } from 'components/molecules'
import { alephArticleCategoryList } from 'utils/config/articles.config'
import ArticleWidgetCard from './card'
import ArticleWidgetListCard from './list'

type ArticlesWidgetProps = {
  articles: Article[]
  onClickCategory: (value: string) => void
  articlesTabList: Article[]
}
const ArticleWidget = ({
  articles,
  onClickCategory,
  articlesTabList,
}: ArticlesWidgetProps) => {
  const [category, setCategory] = useState(alephArticleCategoryList[0].value)
  return (
    <div>
      <div className={styles.wrapperTop}>
        <div className={styles.row}>
          <h2 className={styles.textHeader}>Baca Artikel Terkini</h2>
          <a
            href="https://www.seva.id/blog"
            rel="noopener noreferrer"
            className={styles.textLink}
            onClick={() => {
              sendAmplitudeData(
                AmplitudeEventName.WEB_LP_ARTICLE_SEE_ALL_CLICK,
                { Article_Category: category },
              )
            }}
            data-testid={elementId.Homepage.Article.SeeAllButton}
          >
            Lihat semua
          </a>
        </div>
      </div>
      <div className={styles.containerCarousel}>
        <Swiper
          spaceBetween={20}
          pagination={{
            clickable: true,
            bulletClass: styles.bullet,
            bulletActiveClass: styles.bulletActive,
          }}
          modules={[Pagination]}
          className={styles.wrapper}
        >
          {articles
            .map((article, index) => (
              <SwiperSlide key={index} className={styles.content}>
                <ArticleWidgetCard currentTab={category} article={article} />
              </SwiperSlide>
            ))
            .slice(0, 3)}
        </Swiper>
      </div>
      <NavigationTabV2
        itemList={alephArticleCategoryList}
        onSelectTab={(value: any) => {
          onClickCategory(value)
          setCategory(value)
          sendAmplitudeData(AmplitudeEventName.WEB_LP_ARTICLE_CATEGORY_CLICK, {
            Article_Category: value,
          })
        }}
        isShowAnnouncementBox={false}
        onPage={'LC'}
      />
      <div className={styles.wrapperBottom}>
        <div>
          <div className={styles.wrapperCardList}>
            {articlesTabList
              ?.map((article: Article, index: number) => {
                return (
                  <ArticleWidgetListCard
                    article={article}
                    key={index}
                    currentTab={category}
                  />
                )
              })
              .slice(0, 3)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleWidget
