import React from 'react'
import styles from 'styles/components/organisms/articleListCard.module.scss'
import Image from 'next/image'
import { Article } from 'utils/types'
import { articleDateFormat } from 'utils/handler/date'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { LanguageCode } from 'utils/enum'

type ArticlesWidgetProps = {
  article: Article
  currentTab: string
}
const ArticleWidgetListCard = ({
  article,
  currentTab,
}: ArticlesWidgetProps) => {
  return (
    <div>
      <div
        className={styles.cardArticle}
        onClick={() => {
          sendAmplitudeData(AmplitudeEventName.WEB_LP_ARTICLE_CLICK, {
            Article_Category: currentTab,
            Article_Title: article.title,
            Article_URL: article.url,
          })
          window.location.href = article.url
        }}
      >
        <Image
          alt="list-article-seva"
          src={article.featured_image}
          width={143}
          height={108}
          style={{
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            height: '108px',
            width: '143px',
            objectFit: 'cover',
          }}
          loading="lazy"
        />
        {article.category && (
          <div className={styles.categoryTextWrapper}>
            <p>
              {article.category.length > 19
                ? article.category.slice(0, 16) + '...'
                : article.category}
            </p>
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
export default ArticleWidgetListCard
