import React from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { articleDateFormat } from 'utils/dateUtils'
import styles from 'styles/ArticleStyle.module.css'
import {
  trackArticleSecondaryItemClick,
  trackArticlMainItemClick,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { parsedToUnCapitalizeWithHyphen } from 'utils/parsedToUnCapitalizeWithHyphen'
import { ArticleData } from 'utils/types/utils'
import { decodeHTML } from 'entities'
import { useUtils } from 'services/context/utilsContext'

const PlaceholderImage = '/revamp/illustration/placeholder-150.webp'

export enum ArticleItemType {
  primary = 'primary',
  secondary = 'secondary',
}

interface Props {
  data: ArticleData
  articleType?: ArticleItemType
}

export const ArticlesItemV2Desktop = ({
  data,
  articleType = ArticleItemType.primary,
}: Props) => {
  const { currentLanguage } = useUtils()

  const clickItemHander = () => {
    if (articleType === ArticleItemType.primary) {
      trackArticlMainItemClick({
        Article_Category: data.category,
        Article_Title: data.title,
        Article_URL: data.url,
      })
    } else if (articleType === ArticleItemType.secondary) {
      trackArticleSecondaryItemClick({
        Article_Category: data.category,
        Article_Title: data.title,
        Article_URL: data.url,
      })
    }
  }

  return (
    <Container>
      <a href={data.url} onClick={clickItemHander}>
        <StyledImage
          src={data.featured_image}
          placeholderSrc={PlaceholderImage}
          articleType={articleType}
          wrapperClassName={styles.lazyImage}
        />
      </a>
      <Content articleType={articleType}>
        <ContentHeader articleType={articleType}>
          <a
            style={{ width: 'fit-content' }}
            data-testId={
              elementId.Homepage.Article.LabelLink +
              parsedToUnCapitalizeWithHyphen(data.category)
            }
            href={data.category_link}
          >
            <Category>{data.category}</Category>
          </a>
          <DateText>
            {articleDateFormat(new Date(data.publish_date), currentLanguage)}
          </DateText>
        </ContentHeader>
        <ContentBody articleType={articleType}>
          <a href={data.url} onClick={clickItemHander}>
            <Title articleType={articleType}>{decodeHTML(data.title)}</Title>
          </a>
          {articleType === ArticleItemType.primary && (
            <>
              <a href={data.url} onClick={clickItemHander}>
                <Excerpt articleType={articleType}>
                  {decodeHTML(data.excerpt)}
                </Excerpt>
              </a>
              <a href={data.url} onClick={clickItemHander}>
                <StyledButton>
                  <ButtonText>Baca Selengkapnya</ButtonText>
                </StyledButton>
              </a>
            </>
          )}
        </ContentBody>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-datas: center;
`

const getArticleHeight = (articleType: ArticleItemType) => {
  if (articleType === ArticleItemType.primary) {
    return 'auto'
  } else if (articleType === ArticleItemType.secondary) {
    return '134px'
  } else {
    return 'auto'
  }
}

const StyledImage = styled(LazyLoadImage)<{
  articleType: ArticleItemType
}>`
  width: 100%;
  height: ${({ articleType }) => getArticleHeight(articleType)};
  border-radius: 4px;
  object-fit: cover;
`

const Content = styled.div<{
  articleType: ArticleItemType
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 8px;
`

const getContentHeaderDirection = (articleType: ArticleItemType) => {
  if (articleType === ArticleItemType.primary) {
    return 'row'
  } else if (articleType === ArticleItemType.secondary) {
    return 'column'
  } else {
    return 'row'
  }
}

const getContentHeaderAlignItems = (articleType: ArticleItemType) => {
  if (articleType === ArticleItemType.primary) {
    return 'center'
  } else if (articleType === ArticleItemType.secondary) {
    return 'flex-start'
  } else {
    return 'center'
  }
}

const ContentHeader = styled.div<{
  articleType: ArticleItemType
}>`
  display: flex;
  flex-direction: ${({ articleType }) =>
    getContentHeaderDirection(articleType)};
  align-items: ${({ articleType }) => getContentHeaderAlignItems(articleType)};
  justify-content: space-between;
  gap: 4px;
`

const getContentBodyMarginTop = (articleType: ArticleItemType) => {
  if (articleType === ArticleItemType.primary) {
    return '13px'
  } else if (articleType === ArticleItemType.secondary) {
    return '8px'
  } else {
    return '13px'
  }
}

const ContentBody = styled.div<{
  articleType: ArticleItemType
}>`
  margin-top: ${({ articleType }) => getContentBodyMarginTop(articleType)};
  display: flex;
  flex-direction: column;
`

const Category = styled.div`
  background-color: #eef6fb;
  border-radius: 12px;
  display: flex;
  align-datas: center;
  justify-content: center;
  width: fit-content;
  padding: 4px 10px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: ${colors.label};
`

const TitlePrimaryStyle = css`
  font-family: 'OpenSansSemiBold';
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
`

const TitleSecondaryStyle = css`
  font-family: 'OpenSans';
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
`

const getTitleStyle = (articleType: ArticleItemType) => {
  if (articleType === ArticleItemType.primary) {
    return TitlePrimaryStyle
  } else if (articleType === ArticleItemType.secondary) {
    return TitleSecondaryStyle
  } else {
    return TitlePrimaryStyle
  }
}

const Title = styled.span<{
  articleType: ArticleItemType
}>`
  ${({ articleType }) => getTitleStyle(articleType)};
  font-style: normal;
  color: #041736;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const getExcerptLineClamp = (articleType: ArticleItemType) => {
  if (articleType === ArticleItemType.primary) {
    return '4'
  } else if (articleType === ArticleItemType.secondary) {
    return '2'
  } else {
    return '4'
  }
}

const Excerpt = styled.span<{
  articleType: ArticleItemType
}>`
  margin-top: 8px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: justify;
  color: ${colors.body2};
  display: -webkit-box;
  -webkit-line-clamp: ${({ articleType }) => getExcerptLineClamp(articleType)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DateText = styled.span`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${colors.placeholder};
`

const StyledButton = styled.button`
  margin-top: 12px;
  background: #eef6fb;
  border: 1px solid ${colors.primaryDarkBlue};
  border-radius: 2px;
  padding: 8px 14px;
  cursor: pointer;
`

const ButtonText = styled.div`
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${colors.primaryDarkBlue};
`
