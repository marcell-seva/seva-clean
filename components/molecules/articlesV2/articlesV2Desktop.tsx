import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import urls from 'helpers/urls'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { encryptValue, decryptValue } from 'utils/encryptionUtils'
import {
  trackArticleCategoryItemClick,
  trackArticleSeeAllClick,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { parsedToUnCapitalizeWithHyphen } from 'utils/parsedToUnCapitalizeWithHyphen'
import { ArticleCategoryType, ArticleData } from 'utils/types/utils'
import { articleCategoryList } from 'config/articles.config'
import { LocalStorageKey } from 'utils/enum'
import { ArticleItemType, ArticlesItemV2Desktop } from './ArticlesItemV2Desktop'
import { ArticlesItemV2Placeholder } from './ArticlesItemV2Placeholder'
import { Previous } from 'components/atoms/icon/Previous'
import { HomePageDataLocalContext } from 'pages'
import { useUtils } from 'services/context/utilsContext'

export const ArticlesV2Desktop = () => {
  const { articles } = useUtils()
  const [showArticle, setShowArticles] = useState<boolean>(true)
  const [mainArticle, setMainArticle] = useState<ArticleData>(articles[0])
  const [articlesList, setArticlesList] = useState<Array<ArticleData>>(articles)
  const [allArticles, setAllArticles] = useState<any>()
  const categoryScrollWrapperRef = useRef<any>(null)
  const [isShowPrev, setIsShowPrev] = useState(false)
  const [isShowNext, setIsShowNext] = useState(true)
  const [categoryList, setCategoryList] = useState(articleCategoryList)

  const compare = (a: any, b: any) => {
    return (
      new Date(b.publish_date).valueOf() - new Date(a.publish_date).valueOf()
    )
  }

  const getArticlesAllCategory = async () => {
    const [cat1, cat2, cat3, cat4, cat5, cat6, cat7] = await Promise.all(
      categoryList.map(async (item) => {
        const response = await fetch(item.url)
        return await response.json()
      }),
    )

    setMainArticle(cat1.sort(compare)[0])
    // default use "Semua Artikel" (first category)
    setArticlesList(cat1)

    const tempArr = []
    tempArr.push(cat1)
    tempArr.push(cat2)
    tempArr.push(cat3)
    tempArr.push(cat4)
    tempArr.push(cat5)
    tempArr.push(cat6)
    tempArr.push(cat7)
    setAllArticles(tempArr)
  }

  useEffect(() => {
    setDataBaseConfig()
    getArticlesAllCategory()
  }, [])

  const setDataBaseConfig = async () => {
    const data: string | null = getLocalStorage(LocalStorageKey.baseConf)
    if (data !== null) {
      const decryptedValue = JSON.parse(decryptValue(data))
      setShowArticles(decryptedValue.attributes.homepage_articles)
    } else {
      getDataBaseConfig()
    }
  }

  const getDataBaseConfig = async () => {
    await fetch('https://api.sslpots.com/api/base-conf', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((response: any) => {
        const dataBaseConf = response.data
        setShowArticles(dataBaseConf.attributes.homepage_articles)
        saveLocalStorage(
          LocalStorageKey.baseConf,
          encryptValue(JSON.stringify(dataBaseConf)),
        )
      })
  }

  const onClickCategory = (item: ArticleCategoryType, index: number) => {
    trackArticleCategoryItemClick({
      Article_Category: item.name,
    })

    const resetted = categoryList.map((el: ArticleCategoryType) => ({
      ...el,
      isSelected: false,
    }))
    const newList = resetted.map((el) => {
      if (el.name === item.name) {
        return { ...el, isSelected: true }
      }
      return el
    })
    setCategoryList(newList)

    setArticlesList(allArticles[index])
  }

  const sideScroll = (
    element: HTMLDivElement,
    speed: number,
    distance: number,
    step: number,
  ) => {
    const maxScrollLeft = element.scrollWidth - element.clientWidth
    let scrollAmount = 0
    const slideTimer = setInterval(() => {
      element.scrollLeft += step
      scrollAmount += Math.abs(step)
      if (scrollAmount >= distance) {
        if (Math.ceil(element.scrollLeft) >= maxScrollLeft) {
          // hide next arrow if slide is on far right
          setIsShowNext(false)
        } else if (Math.ceil(element.scrollLeft) === 0) {
          // hide prev arrow if slide is on far left
          setIsShowPrev(false)
        } else {
          setIsShowPrev(true)
          setIsShowNext(true)
        }

        clearInterval(slideTimer)
      }
    }, speed)
  }

  const onClickPrevCategory = () => {
    sideScroll(categoryScrollWrapperRef.current, 10, 350, -10)
  }

  const onClickNextCategory = () => {
    sideScroll(categoryScrollWrapperRef.current, 10, 350, 10)
  }

  const clickSeeAll = () => {
    const selectedCategory = categoryList.filter((item) => item.isSelected)
    if (selectedCategory.length > 0) {
      trackArticleSeeAllClick({
        Article_Category: selectedCategory[0].name,
      })
    }
  }

  if (!showArticle) return <></>

  return (
    <Container>
      <Header>
        <Title>Baca Artikel Terkini</Title>
        <SeeAll
          data-testid={elementId.Homepage.Article.SeeAllButton}
          href={urls.articleWordpress}
          onClick={clickSeeAll}
        >
          LIHAT SEMUA
        </SeeAll>
      </Header>
      <Content>
        <div style={{ width: '50%' }}>
          {mainArticle ? (
            <ArticlesItemV2Desktop
              data={mainArticle}
              articleType={ArticleItemType.primary}
            />
          ) : (
            <ArticlesItemV2Placeholder />
          )}
        </div>
        <div style={{ width: '50%' }}>
          <CategorySection>
            <CategoryScrollWrapper
              id="article-category-scroll-wrapper"
              ref={categoryScrollWrapperRef}
            >
              {categoryList.map((item, index) => (
                <CategoryBox
                  key={index}
                  isSelected={item.isSelected}
                  onClick={() => onClickCategory(item, index)}
                  data-testid={
                    parsedToUnCapitalizeWithHyphen(item.name) +
                    elementId.Homepage.Article.ButtonCategory
                  }
                >
                  {item.name}
                </CategoryBox>
              ))}
            </CategoryScrollWrapper>
            {isShowPrev && (
              <StyledButtonPrev onClick={onClickPrevCategory}>
                <Previous />
              </StyledButtonPrev>
            )}
            {isShowNext && (
              <StyledButtonNext onClick={onClickNextCategory}>
                <Previous />
              </StyledButtonNext>
            )}
          </CategorySection>
          <ArticlesListSection>
            {articlesList.length > 0 ? (
              articlesList.slice(0, 4).map((item, index) => {
                return (
                  <ArticlesItemV2Desktop
                    data={item}
                    key={index}
                    articleType={ArticleItemType.secondary}
                  />
                )
              })
            ) : (
              <>
                <ArticlesItemV2Placeholder />
                <ArticlesItemV2Placeholder />
                <ArticlesItemV2Placeholder />
              </>
            )}
          </ArticlesListSection>
        </div>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 20px 0 100px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const Title = styled.h2`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0px;
  color: ${colors.title};
`

const SeeAll = styled.a`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0px;
  color: ${colors.primaryBlue};
  text-decoration: none;
  &:link {
    color: ${colors.primaryBlue};
  }
  &:visited {
    color: ${colors.primaryBlue};
  }
`

const Content = styled.div`
  display: flex;
  gap: 50px;
`

const CategorySection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
`

const CategoryScrollWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  /* use overflow hidden so it cant be scroll with touchpad */
  overflow-x: hidden;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

const CategoryBox = styled.button<{
  isSelected: boolean
}>`
  height: 40px;
  width: auto;
  white-space: nowrap;
  background-color: ${({ isSelected }) =>
    isSelected ? colors.primarySky2 : colors.white};
  border: 1px solid ${colors.primarySky2};
  padding: 14px 16px;
  font-family: var(--open-sans-semi-bold);
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
  color: ${({ isSelected }) => (isSelected ? colors.body2 : colors.label)};
  cursor: pointer;
`

const StyledButtonNext = styled.button`
  position: absolute;
  top: 0;
  right: -34px;
  z-index: 2;
  width: 48px;
  height: 48px;
  border: none;
  background: ${colors.white};
  box-shadow: 0px 1px 16px rgb(3 24 56 / 10%);
  border-radius: 8px;
  transform: rotate(-180deg);
  cursor: pointer;
`

const StyledButtonPrev = styled.button`
  position: absolute;
  top: 0;
  left: -34px;
  z-index: 2;
  width: 48px;
  height: 48px;
  border: none;
  background: ${colors.white};
  box-shadow: 0px 1px 16px rgb(3 24 56 / 10%);
  border-radius: 8px;
  cursor: pointer;
  cursor: pointer;
`

const ArticlesListSection = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 33px;
  grid-row-gap: 29px;
`
