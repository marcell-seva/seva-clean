import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import GallerySectionV2 from './GallerySection/GallerySectionV2'
import styled from 'styled-components'
import { useCurrentLanguageFromContext } from 'context/currentLanguageContext/currentLanguageContext'
import { articleDateFormat } from 'utils/dateUtils'
import urls from 'helpers/urls'
import { useContextSpecialRateResults } from 'context/specialRateResultsContext/specialRateResultsContext'
import { Video } from './Video/Video'
import { useMediaQuery } from 'react-responsive'
import {
  trackWebPDPGalleryTab,
  WebVariantListPageParam,
} from 'helpers/amplitude/seva20Tracking'
import {
  formatSortPrice,
  replacePriceSeparatorByLocalization,
} from 'utils/numberUtils/numberUtils'
import { setTrackEventMoEngage } from 'helpers/moengage'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { articleCategoryList } from 'config/articles.config'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { Description } from 'components/organism/OldPdpSectionComponents/Description/Description'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
type tabProps = {
  tab: string | undefined
  isSticky?: boolean
}
const GalleryTab = memo(({ tab, isSticky }: tabProps) => {
  const { carModelDetails } = useContextCarModelDetails()
  const { carVariantDetails } = useContextCarVariantDetails()
  const { recommendations } = useContextRecommendations()
  const {
    carModelDetailsResDefaultCity,
    carVariantDetailsResDefaultCity,
    carRecommendationsResDefaultCity,
    carArticleReviewRes,
  } = useContext(PdpDataLocalContext)
  const modelDetailData = carModelDetails || carModelDetailsResDefaultCity
  const variantDetailData = carVariantDetails || carVariantDetailsResDefaultCity
  const recommendationsDetailData =
    recommendations.length !== 0
      ? recommendations
      : carRecommendationsResDefaultCity
  const { currentLanguage } = useCurrentLanguageFromContext()
  const { setSpecialRateResults } = useContextSpecialRateResults()
  const categoryList = articleCategoryList[2]
  const [articleList, setArticleList] = useState([])
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const getReview = async () => {
    let reviewCar = carArticleReviewRes
    if (!reviewCar) {
      const [carArticleReviewDataFromApiClient] = await Promise.all([
        fetch(categoryList.url).then((res) => res.json()),
      ])
      reviewCar = carArticleReviewDataFromApiClient
    }

    const modelWordpressTag =
      modelDetailData &&
      modelDetailData.modelWordpressTag &&
      modelDetailData?.modelWordpressTag.replace('-', ' ')
    const relatedArticle = reviewCar
      .filter((cat: any) => cat.title.toLowerCase().includes(modelWordpressTag))
      .slice(0, 3)
    if (relatedArticle && relatedArticle.length > 0) {
      setArticleList(relatedArticle)
    } else {
      setArticleList(reviewCar.slice(0, 3))
    }
  }
  const scrollToSectionContent = () => {
    scrollToContent.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }
  useEffect(() => {
    if (isSticky) {
      const timeout = setTimeout(() => {
        scrollToSectionContent()
      }, 10)

      return () => clearTimeout(timeout)
    }
  }, [tab])
  const scrollToContent = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    getReview()
    setSpecialRateResults([])
  }, [])

  const trackEventMoengage = (carImages: string[]) => {
    const objData = {
      brand: modelDetailData?.brand,
      model: modelDetailData?.model,
      price:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].priceValue
          : '-',
      monthly_installment:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].monthlyInstallment
          : '-',
      down_payment:
        modelDetailData?.variants && modelDetailData?.variants.length > 0
          ? modelDetailData.variants[0].dpAmount
          : '-',
      loan_tenure:
        modelDetailData?.variants && modelDetailData.variants.length > 0
          ? modelDetailData.variants[0].tenure
          : '-',
      car_seat: variantDetailData?.variantDetail.carSeats,
      fuel: variantDetailData?.variantDetail.fuelType,
      transmition: variantDetailData?.variantDetail.transmission,
      dimension:
        recommendationsDetailData?.filter(
          (car: any) => car.id === variantDetailData?.modelDetail.id,
        ).length > 0
          ? recommendationsDetailData?.filter(
              (car: any) => car.id === variantDetailData?.modelDetail.id,
            )[0].height
          : '',
      body_type: variantDetailData?.variantDetail.bodyType
        ? variantDetailData?.variantDetail.bodyType
        : '-',
      Image_URL: carImages[0],
      Brand_Model: `${modelDetailData?.brand} ${modelDetailData?.model}`,
    }
    setTrackEventMoEngage('view_variant_list_gallery_tab', objData)
  }
  useEffect(() => {
    if (modelDetailData && cityOtr) {
      const trackNewCarVariantList: WebVariantListPageParam = {
        Car_Brand: modelDetailData.brand as string,
        Car_Model: modelDetailData.model as string,
        OTR: `Rp${replacePriceSeparatorByLocalization(
          modelDetailData.variants[0].priceValue as number,
          LanguageCode.id,
        )}`,
        DP: `Rp${formatSortPrice(
          modelDetailData.variants[0].dpAmount as number,
        )} Juta`,
        Tenure: '5 Tahun',
        City: cityOtr.cityName || 'Jakarta Pusat',
      }

      trackWebPDPGalleryTab(trackNewCarVariantList)
      trackEventMoengage(modelDetailData?.images)
    }
  }, [modelDetailData, cityOtr])

  return (
    <>
      <div
        ref={scrollToContent}
        style={{ scrollMargin: isMobile ? '90px' : '30px' }}
      />
      <Container>
        <Description
          title={`Galeri ${modelDetailData.brand} ${modelDetailData.model}`}
          description={variantDetailData.variantDetail.description.id}
          carModel={modelDetailData}
          carVariant={variantDetailData}
          tab="gallery"
        />
      </Container>
      <ContainerGallery>
        <GallerySectionV2
          title={`Foto ${modelDetailData.brand} ${modelDetailData.model}`}
        />
      </ContainerGallery>
      <Video modelDetail={modelDetailData} />
      <ContainerContentArticle>
        <StyledText>
          Artikel Terkait {modelDetailData.brand + ' ' + modelDetailData.model}
        </StyledText>
        <ContainerArticle>
          {articleList.map((article: any) => {
            return (
              <ArticleItem key={article.post_id} href={article.url}>
                <ArticleItemImage src={article.featured_image} />
                <ArticleItemContent>
                  <StyledTextTitleArticle>
                    {article.title}
                  </StyledTextTitleArticle>
                  <StyledTextDateArticle>
                    {articleDateFormat(
                      new Date(article.publish_date),
                      currentLanguage,
                    )}
                  </StyledTextDateArticle>
                </ArticleItemContent>
              </ArticleItem>
            )
          })}
        </ContainerArticle>{' '}
        <StyledTextSeeAll href={urls.articleWordpress}>
          LIHAT SEMUA
        </StyledTextSeeAll>
      </ContainerContentArticle>
    </>
  )
})

export default GalleryTab

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  padding-top: 22px;

  @media (min-width: 1025px) {
    padding-top: 48px;
  }
`
const ContainerGallery = styled.div`
  margin-top: -20px;
`

const ContainerContentArticle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  padding-top: 34px;

  @media (min-width: 1025px) {
    max-width: 1040px;
    margin: 0 auto;
    padding: 47px 0 0;
  }
`
const ContainerArticle = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  margin-bottom: 5px;
`
const StyledText = styled.span`
  letter-spacing: 0px;
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;

  color: #031838;

  @media (min-width: 1025px) {
    width: 1040px;
    margin: 0 auto;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 14px;
  }
`
const StyledTextSeeAll = styled.a`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 16px;
  color: #246ed4;
  margin-bottom: 37px;
`

const ArticleItem = styled.a`
  display: flex;
  margin-bottom: 19px;
`

const ArticleItemImage = styled.img`
  border-radius: 4px;
  width: 105px;
  aspect-ratio: 3 / 2;
`

const ArticleItemContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 20px;
`

const StyledTextTitleArticle = styled.span`
  letter-spacing: 0px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #041736;
`

const StyledTextDateArticle = styled.span`
  letter-spacing: 0px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #9ea3ac;
`
