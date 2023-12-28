import React, { useState } from 'react'
import styles from 'styles/components/organisms/articleWidget.module.scss'
import 'swiper/css'
import 'swiper/css/pagination'
import { Article } from 'utils/types'
import elementId from 'utils/helpers/trackerId'
import { alephArticleCategoryList } from 'utils/config/articles.config'
import ArticleWidgetListCard from '../list'

type ArticlesWidgetProps = {
  articlesTabList: Article[]
}
const DealerArticleWidget = ({ articlesTabList }: ArticlesWidgetProps) => {
  const [category, setCategory] = useState(alephArticleCategoryList[2].value)
  return (
    <div>
      <div className={styles.wrapperTop}>
        <div className={styles.row}>
          <h2 className={styles.textHeader}>Baca Artikel Terkini</h2>
          <a
            href="https://www.seva.id/blog"
            rel="noopener noreferrer"
            className={styles.textLink}
            data-testid={elementId.Homepage.Article.SeeAllButton}
          >
            Lihat semua
          </a>
        </div>
      </div>
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
                    articleOrder={index}
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

export default DealerArticleWidget
