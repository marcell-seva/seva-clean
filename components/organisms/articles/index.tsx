import {
  trackLCAllArticleClick,
  trackLCArticleClick,
} from 'helpers/amplitude/seva20Tracking'
import React from 'react'
import PrimaryCard from 'components/molecules/card/primaryCard'
import styles from 'styles/components/organisms/articles.module.scss'
import { Article } from 'utils/types'

type TArticlesProps = {
  articles: Article[]
  cityName: string
  carModel: string
  carBrand: string
  additionalContainerStyle?: string
  additionalLinkStyle?: string
}

export default function Articles({
  articles,
  carBrand,
  carModel,
  cityName,
  additionalContainerStyle,
  additionalLinkStyle,
}: TArticlesProps) {
  const [showAllArticlesUrl, setShowAllArticlesUrl] = React.useState('')

  const fetchBaseConfig = async () => {
    const response = await fetch('https://api.sslpots.com/api/base-conf')
    const responseData = await response.json()
    setShowAllArticlesUrl(responseData.data.attributes.show_all_articles_url)
  }

  React.useEffect(() => {
    fetchBaseConfig()
  }, [])

  const handleClickArticle = (url: string) => {
    trackLCArticleClick({
      Page_Origination: window.location.href,
      Car_Brand: carBrand,
      Car_Model: carModel,
      City: cityName,
      Article: url,
    })

    window.location.href = url
  }

  const handleClickAllArticle = () => {
    trackLCAllArticleClick({
      Page_Origination: window.location.href,
      Car_Brand: carBrand,
      Car_Model: carModel,
      City: cityName,
    })
    window.location.href = showAllArticlesUrl
  }

  return (
    <div className={`${styles.container} ${additionalContainerStyle}`}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>Baca Artikel Terkini</h3>

        <div
          onClick={handleClickAllArticle}
          className={`${styles.link} ${additionalLinkStyle}`}
        >
          Lihat Semua
        </div>
      </div>

      <div className={styles.articlesContainer}>
        {articles?.map((article) => (
          <PrimaryCard
            key={article.title}
            date={new Date(article.publish_date)}
            image={article.featured_image}
            title={article.title}
            url={article.url}
            label={article.category}
            handleClick={handleClickArticle}
          />
        ))}
      </div>
    </div>
  )
}
