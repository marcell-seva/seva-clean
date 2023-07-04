import elementId from 'helpers/elementIds'
import { AlephArticleCategoryType } from 'utils/types/utils'

export const articleBaseUrl =
  'https://www.seva.id/wp-json/foodicious/latest-posts/'
export const articleBaseUrl2 = 'https://www.seva.id/wp-json/seva/latest-posts/'

export const alephArticleCategoryList: AlephArticleCategoryType[] = [
  {
    label: 'Semua',
    value: 'Semua',
    url: articleBaseUrl + 65,
    testid: elementId.Homepage.Article.Tab + 'semua-artikel',
  },
  {
    label: 'Modifikasi',
    value: 'Modifikasi',
    url: articleBaseUrl2 + 974,
    testid: elementId.Homepage.Article.Tab + 'modifikasi',
  },
  {
    label: 'Review Otomotif',
    value: 'Review Otomotif',
    url: articleBaseUrl2 + 972,
    testid: elementId.Homepage.Article.Tab + 'review-otomotif',
  },
  {
    label: 'Tips & Rekomendasi',
    value: 'Tips & Rekomendasi',
    url: articleBaseUrl2 + 993,
    testid: elementId.Homepage.Article.Tab + 'tips-rekomendasi',
  },
  {
    label: 'Keuangan',
    value: 'Keuangan',
    url: articleBaseUrl2 + 979,
    testid: elementId.Homepage.Article.Tab + 'keuangan',
  },
  {
    label: 'Travel & Lifestyle',
    value: 'Travel & Lifestyle',
    url: articleBaseUrl2 + 796,
    testid: elementId.Homepage.Article.Tab + 'travel-lifestyle',
  },
  {
    label: 'Hobi & Komunitas',
    value: 'Hobi & Komunitas',
    url: articleBaseUrl2 + 981,
    testid: elementId.Homepage.Article.Tab + 'hobi-komunitas',
  },
]
