import React from 'react'
import styles from 'styles/components/organisms/articleWidget.module.scss'
import { LanguageCode } from 'utils/types/models'
import { Article } from 'utils/types'
import Image from 'next/image'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { articleDateFormat } from 'utils/handler/date'

type ArticlesWidgetProps = {
  article: Article
  currentTab: string
}
const ArticleWidgetCard = ({ article, currentTab }: ArticlesWidgetProps) => {
  console.log('datas', article.featured_image)
  return (
    <div>
      <div
        className={styles.cardArticle}
        onClick={() => {
          sendAmplitudeData(AmplitudeEventName.WEB_LP_MAIN_ARTICLE_CLICK, {
            Article_Category: currentTab,
            Article_Title: article.title,
            Article_URL: article.url,
          })
          window.location.href = article.url
        }}
      >
        <Image
          alt="article"
          src={article.featured_image}
          width={480}
          height={258}
          className={styles.images}
        />
        {article.category && (
          <div className={styles.categoryTextWrapper}>
            <p>{article.category}</p>
          </div>
        )}
        <div className={styles.descriptionWrapper}>
          <p className={styles.textDate}>
            {articleDateFormat(new Date(article.publish_date), LanguageCode.id)}
          </p>
          <p className={styles.textTitle}>{article.title}</p>
        </div>
      </div>
    </div>
  )
}

export default ArticleWidgetCard
