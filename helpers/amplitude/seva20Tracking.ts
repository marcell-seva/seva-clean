import { logAmplitudeEvent } from 'services/amplitude'
import { PageFrom } from 'utils/types/models'
import {
  TrackingEventLeadsForm,
  TrackingEventName,
  TrackingEventPLPFilterShow,
  TrackingEventPLPSortShow,
  TrackingEventSearchWidgetExpand,
  TrackingEventWebFooterNavigation,
  TrackingEventWebNavigation,
  TrackingEventWebPDPGalleryVideo,
  TrackingEventWebPDPPhoto,
  TrackingExpandFAQ,
  TrackingExpandSEOFooter,
} from './eventTypes'
import { FunnelTrackingEvent } from './newFunnelEventTracking'
import {
  EventFromType,
  NewHomePageTrackingEvent,
  NewHomePageVersion,
} from './newHomePageEventTracking'

type SearchWidgetParams = CarBrandOnlyParam &
  CarBodyTypeOnlyParam & {
    DP?: string
    Tenure?: string | number | null
    Income?: string | null
    Age?: string | null
    Price_Range?: string | null
    Phone_Number?: 'YES' | 'NO'
  }

type CarBrandOnlyParam = {
  Car_Brand?: string
}

type CarBrandAndModelParam = CarBrandOnlyParam & {
  Car_Model: string
}

type CarBodyTypeOnlyParam = {
  Car_Body_Type?: string
}

type CarBodyTypeDetailParam = CarBrandAndModelParam & CarBodyTypeOnlyParam

type CarBrandModelVariantParam = CarBrandOnlyParam &
  CarBrandAndModelParam & {
    Car_Variant: string
  }

type ArticleCategoryParam = {
  Article_Category: string
}

type ArticleDetailParam = ArticleCategoryParam & {
  Article_Title: string
  Article_URL: string
}

export type UrlOriginationParam = {
  Page_Origination_URL?: string
}

type NumbersOfCardViewedParam = {
  Numbers_of_Card_Viewed: string
}

type OrderParam = {
  Order: string
}

type SubProductParam = {
  Sub_Product: string
}

export type UrlOriginationWithCityParam = UrlOriginationParam & {
  City: string
}

type LandingPageLeadsFormSubmitParam = {
  WA_Chat: boolean
}

type BannerParam = {
  Name: string
  Page_direction_URL: string
  Creative_context: string | null
}

type UrlDirectionParam = {
  Page_Origination_URL?: string
  Page_Direction_URL?: string
}

type UrlAnnouncementBoxParam = {
  title: string
  Page_Origination_URL?: string
  Page_Direction_URL?: string
}

export type WebVariantListPageParam = {
  Car_Brand?: string
  Car_Model?: string
  OTR?: string
  DP: string
  Tenure?: string
  City?: string
}

export interface CarSearchPageMintaPenawaranParam
  extends WebVariantListPageParam {
  Peluang_Kredit: string
  Cicilan: string
}

export interface CarVariantCreditTabParam extends WebVariantListPageParam {
  Car_Variant?: string
  Income: string
  Cicilan?: string
  Pembayaran_Angsuran?: string
  Promo?: string
  Age?: string
  Tipe_Pembayaran?: string
  Peluang_Kredit?: string
}

export type CarResultPageFilterParam = {
  Sort?: string
  Car_Brand?: string | null
  Car_Body_Type?: string | null
  DP?: string | null
  Tenure?: string
  Income?: string | null
  Age?: string | null
  Min_Price?: string
  Max_Price?: string
}

type LoanRankBadgeParam = WebVariantListPageParam & {
  Cicilan?: string
  Age?: string
  Income?: string
}

type SeeAllPromoParam = {
  Car_Brand: string | undefined
  Car_Model: string | undefined
  City?: string
  Page_Origination_URL: string
}

export type CarVariantParam = {
  Car_Brand?: string | undefined
  Car_Model?: string | undefined
  OTR?: string
  City?: string
  Page_Origination_URL?: string
}

export type CarVariantFAQParam = Pick<
  CarVariantParam,
  'Car_Brand' | 'Car_Model' | 'Page_Origination_URL'
> & {
  FAQ_Order: string
}

export type CarVariantSummaryTabPriceSectionParam = CarVariantParam & {
  DP?: string | number | readonly string[] | undefined
  Cicilan?: string
  Tenure?: string
  Car_Variant?: string
  Age_Group?: string
}

export type CarVariantPhotoParam = CarVariantSummaryTabPriceSectionParam & {
  Photo_Type?: string
  Image_URL?: string
}

export type CarVariantHitungKemampuanParam = CarVariantPhotoParam

export enum PageOriginationName {
  PLPFloatingIcon = 'PLP Floating Icon',
  PDPLeadsForm = 'PDP Leads Form',
  LPFloatingIcon = 'LP Floating Icon',
  COTMLeadsForm = 'Car Of The Month',
  LPLeadsForm = 'LP Leads Form',
}

export type LeadsActionParam = CarResultPageFilterParam & {
  Page_Origination?: PageOriginationName
  Car_Model?: string
  City?: string
  Peluang_Kredit?: string
}

type RegularLoanCalculatorParam = {
  Car_Brand: string
  Car_Model: string
  Car_Variant: string
  DP: string
  Income: string
  Age: string
  City: string
}

export type MenuParam = UrlOriginationParam & {
  Menu: string
}

export type LCCarRecommendationParam = {
  Car_Brand: string
  Car_Model: string
  City: string
  Page_Origination: string
  Monthly_Installment: string
}

export type LCArticleParam = {
  Car_Brand: string
  Car_Model: string
  Article: string
  Page_Origination: string
  City: string
}

export type LCAllArticleParam = Omit<LCArticleParam, 'Article'>

export type LCCTACalculateParam = {
  Car_Brand: string
  Car_Model: string
  Car_Variant: string
  City: string
  DP: string
  Age: string
  Angsuran_Type: string
  Page_Origination: string
  Promo: string
}

export type LCCTACreditCualificationParam = LCCTACalculateParam & {
  Tenure: string
  Total_DP: string
  Monthly_Installment: string
  Peluang_Kredit: string
}

type OtpTriggerParam = {
  Page_Origination: string
}

type LoginSuccessTriggerParam = {
  Page_Direction: string
}

type RegisterParam = {
  Teman_SEVA_Code: string
  Promotional_Checkbox: string
  Page_Direction: string
}

export type ReasonParam = {
  Reason: string
}

export type CreditQualificationFlowParam = {
  Car_Brand: string
  Car_Model: string
  Car_Variant: string
  DP: string
  Monthly_Installment: string
  Tenure: string
  Income?: string
  /** sum customer income with his/her spouse income */
  Total_Income?: string
  Promo?: string
  Year_Born: string
  City: string
}

export type CreditQualificationReviewParam = UrlOriginationParam &
  CreditQualificationFlowParam & {
    Teman_SEVA_Ref_Code?: string
    Occupation: string
    Page_Origination?: string // different key with "UrlOriginationParam"
  }

export type Seva20TrackingEvent =
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_REASON_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_SUCCESS_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_PROFILE_PAGE_SAVE_CHANGES
      data: null
    }
  | {
      name: TrackingEventName.WEB_PROFILE_PAGE_LOGOUT_CLICK
      data: null
    }
  | {
      name: TrackingEventName.WEB_PROFILE_PAGE_DELETE_ACCOUNT_ENTRY_POINT_CLICK
      data: null
    }
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_CONSENT_PAGE_CTA_CLICK
      data: null
    }
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_REASON_PAGE_CTA_CLICK
      data: ReasonParam
    }
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_POPUP_CTA_CANCEL_CLICK
      data: ReasonParam
    }
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_POPUP_CTA_YES_CLICK
      data: ReasonParam
    }
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_POPUP_CLOSE
      data: ReasonParam
    }
  | {
      name: TrackingEventName.WEB_DELETE_ACCOUNT_SUCCESS_CTA_CLICK
      data: ReasonParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_CAR_DETAIL_CLICK
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_CAR_DETAIL_CLOSE
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_FORM_PAGE_CTA_CLICK
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_PROFILE_PAGE_SAVE_KTP_CHANGES
      data: null
    }
  | {
      name: TrackingEventName.WEB_LC_CAR_RECOMMENDATION_CLICK
      data: LCCarRecommendationParam
    }
  | {
      name: TrackingEventName.WEB_LC_CAR_RECOMMENDATION_CTA_CLICK
      data: LCCarRecommendationParam
    }
  | {
      name: TrackingEventName.WEB_LC_ARTICLE_CLICK
      data: LCArticleParam
    }
  | {
      name: TrackingEventName.WEB_LC_ALL_ARTICLE_CLICK
      data: LCAllArticleParam
    }
  | {
      name: TrackingEventName.WEB_LC_CTA_HITUNG_KEMAMPUAN_CLICK
      data: LCCTACalculateParam
    }
  | {
      name: TrackingEventName.WEB_LC_CTA_KUALIFIKASI_KREDIT_CLICK
      data: LCCTACreditCualificationParam
    }
  | {
      name: TrackingEventName.WEB_LC_KUALIFIKASI_KREDIT_TOOLTIP_CTA_CLICK
      data: LCCTACreditCualificationParam
    }
  | {
      name: TrackingEventName.WEB_LC_KUALIFIKASI_KREDIT_TOOLTIP_CTA_CLOSE
      data: LCCTACreditCualificationParam
    }
  | {
      name: TrackingEventName.WEB_VARIANT_LIST_PAGE_CODE_SUCCESS_INPUT
      data: { code: string }
    }
  | {
      name: TrackingEventName.WEB_VARIANT_LIST_PAGE_CODE_FAILED_INPUT
      data: { code: string }
    }
  | {
      name: TrackingEventName.WEB_LANDING_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_LANDING_PAGE_VAR_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_CAR_SEARCH_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_CAR_SEARCH_PAGE_VAR_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_VARIANT_LIST_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_VARIANT_LIST_PAGE_VIEW
      data: WebVariantListPageParam
    }
  | {
      name: TrackingEventName.WEB_PDP_CREDIT_TAB_VIEW
      data: WebVariantListPageParam
    }
  | {
      name: TrackingEventName.WEB_PDP_PRICE_TAB_VIEW
      data: WebVariantListPageParam
    }
  | {
      name: TrackingEventName.WEB_PDP_SPECIFICATION_VIEW
      data: WebVariantListPageParam
    }
  | {
      name: TrackingEventName.WEB_PDP_GALLERY_TAB_VIEW
      data: WebVariantListPageParam
    }
  | {
      name: TrackingEventName.WEB_REGULAR_CALCULATOR_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_SPECIAL_RATE_CALCULATOR_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_LOGIN_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_LOGIN_OTP_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_LOGIN_SUCCESS_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_REGISTRATION_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_REGISTRATION_OTP_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_REGISTRATION_SUCCESS_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_GIIAS_CRM_REGISTRATION_FORM_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_GIIAS_CRM_SUCCESS_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_GIIAS_CRM_SHOWQR_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_GIIAS_CRM_OTP_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_LANDING_PAGE_LEADS_FORM_SUBMIT
      data: LandingPageLeadsFormSubmitParam
    }
  | {
      name: TrackingEventName.WEB_CAR_SEARCH_PAGE_MINTA_PENAWARAN_CLICK_WA_CHATBOT
      data: CarSearchPageMintaPenawaranParam
    }
  | {
      name: TrackingEventName.WEB_CAR_VARIANT_LIST_PAGE_CLICK_WA_CHATBOT
      data: CarSearchPageMintaPenawaranParam
    }
  | {
      name: TrackingEventName.WEB_CAR_VARIANT_LIST_CREDIT_TAB_CLICK_WA_CHATBOT
      data: CarVariantCreditTabParam
    }
  | {
      name: TrackingEventName.WEB_CAR_VARIANT_LIST_PAGE_LEADS_FORM_SUBMIT
      data: null
    }
  | {
      name: TrackingEventName.WEB_CAR_VARIANT_LIST_PAGE_LEADS_FORM_SUBMIT
      data: CarSearchPageMintaPenawaranParam
    }
  | {
      name: TrackingEventName.WEB_REGULAR_CALCULATOR_PAGE_CONTACT_US_CLICK_WA_CHATBOT
      data: null
    }
  | {
      name: TrackingEventName.WEB_SPECIAL_RATE_CALCULATOR_PAGE_CONTACT_US_CLICK_WA_CHATBOT
      data: null
    }
  | {
      name: TrackingEventName.WEB_REFINANCING_LANDING_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_REFINANCING_LEADS_FORM_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_REFINANCING_LEADS_BANNER_CLICK
      data: null
    }
  | {
      name: TrackingEventName.WEB_REFINANCING_1ST_LEADS_FORM_SUBMIT
      data: null
    }
  | {
      name: TrackingEventName.WEB_REFINANCING_2ND_LEADS_FORM_SUBMIT
      data: null
    }
  | {
      name: TrackingEventName.WEB_REFINANCING_QUESTION_BANNER_CLICK
      data: null
    }
  | {
      name: TrackingEventName.WEB_REFINANCING_1ST_QUESTION_FORM_SUBMIT
      data: null
    }
  | {
      name: TrackingEventName.WEB_REFINANCING_2ND_QUESTION_FORM_SUBMIT
      data: null
    }
  | {
      name: TrackingEventName.WEB_LP_SEARCHWIDGET_SUBMIT
      data: SearchWidgetParams
    }
  | {
      name: TrackingEventName.WEB_LP_SEARCHWIDGET_ADVANCED_SEARCH_CLICK
      data: null
    }
  | {
      name: TrackingEventName.WEB_LP_CAROFTHEMONTH_BRAND_CLICK
      data: CarBrandOnlyParam
    }
  | {
      name: TrackingEventName.WEB_LP_CAROFTHEMONTH_CAR_CLICK
      data: CarBrandAndModelParam
    }
  | {
      name: TrackingEventName.WEB_CAR_OF_THE_MONTH_LEADS_FORM_SUBMIT
      data: CarBrandAndModelParam
    }
  | {
      name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_SEE_ALL_CLICK
      data: CarBrandOnlyParam
    }
  | {
      name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_LOGO_CLICK
      data: CarBrandOnlyParam
    }
  | {
      name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_CAR_CLICK
      data: CarBrandAndModelParam
    }
  | {
      name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_CTA_HITUNG_KEMAMPUAN_CLICK
      data: CarBrandAndModelParam
    }
  | {
      name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_CAR_SEE_ALL_CLICK
      data: CarBrandOnlyParam
    }
  | {
      name: TrackingEventName.WEB_LP_TYPERECOMMENDATION_SEE_ALL_CLICK
      data: CarBodyTypeOnlyParam
    }
  | {
      name: TrackingEventName.WEB_LP_TYPERECOMMENDATION_LOGO_CLICK
      data: CarBodyTypeOnlyParam
    }
  | {
      name: TrackingEventName.WEB_LP_TYPERECOMMENDATION_CAR_CLICK
      data: CarBodyTypeDetailParam
    }
  | {
      name: TrackingEventName.WEB_LP_TYPERECOMMENDATION_CAR_SEE_ALL_CLICK
      data: CarBodyTypeOnlyParam
    }
  | {
      name: TrackingEventName.WEB_LP_CALCULATORWIDGET_CLICK
      data: CarBrandModelVariantParam
    }
  | {
      name: TrackingEventName.WEB_LP_ARTICLE_SEE_ALL_CLICK
      data: ArticleCategoryParam
    }
  | {
      name: TrackingEventName.WEB_LP_ARTICLE_CATEGORY_CLICK
      data: ArticleCategoryParam
    }
  | {
      name: TrackingEventName.WEB_LP_ARTICLE_CLICK
      data: ArticleDetailParam
    }
  | {
      name: TrackingEventName.WEB_LP_MAIN_ARTICLE_CLICK
      data: ArticleDetailParam
    }
  | {
      name: TrackingEventWebNavigation
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventWebFooterNavigation
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventWebPDPGalleryVideo
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_BUTTON_DOWNLOAD_BROSUR_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_CITYSELECTOR_GANTILOKASI_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_CITYSELECTOR_PILIHKOTA_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_CITY_SELECTOR_POPUP_SUGGESTION_CLICK
      data: UrlOriginationWithCityParam
    }
  | {
      name: TrackingEventName.WEB_TOP_BANNER_CLICK
      data: BannerParam
    }
  | {
      name: TrackingEventName.WEB_TOP_BANNER_VIEW
      data: BannerParam
    }
  | {
      name: TrackingEventName.WEB_TOP_BANNER_NEXT_PREV_CLICK
      data: BannerParam
    }
  | {
      name: TrackingEventName.WEB_SEVALOGO_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_SEARCHBAR_SUGGESTION_CLICK
      data: UrlDirectionParam
    }
  | {
      name: TrackingEventName.WEB_LOGIN_BUTTON_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_PROFILE_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_PROFILE_KELUAR_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_ANNOUNCEMENT_BOX_CLICK_CTA
      data: UrlAnnouncementBoxParam
    }
  | {
      name: TrackingEventName.WEB_ANNOUNCEMENT_BOX_CLICK_CLOSE
      data: UrlAnnouncementBoxParam
    }
  | {
      name: TrackingEventName.WEB_CARAPAKAI_ICON_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_CARAPAKAI_EXPAND_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_LP_TESTIMONY_NEXT_PREV_CLICK
      data: NumbersOfCardViewedParam
    }
  | {
      name: TrackingEventName.WEB_LP_TESTIMONY_CLICK
      data: OrderParam
    }
  | {
      name: TrackingEventName.WEB_LP_TESTIMONY_POP_UP_CLOSE
      data: OrderParam
    }
  | {
      name: TrackingEventName.WEB_LP_SUB_PRODUCT_CLICK
      data: SubProductParam
    }
  | {
      name: TrackingEventName.WEB_PLP_CLEAR_FILTER
      data: CarResultPageFilterParam
    }
  | {
      name: TrackingEventName.WEB_PLP_FILTER_SUBMIT
      data: CarResultPageFilterParam
    }
  | {
      name: TrackingEventName.WEB_PLP_CAR_CLICK
      data: CarSearchPageMintaPenawaranParam
    }
  | {
      name: TrackingEventName.WEB_PLP_CEKPELUANG_BANNER_CLICK
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_PELUANGMUDAH_BANNER_CLICK
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_PELUANGSULIT_BANNER_CLICK
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_CEKPELUANG_POPUP_CLICK_CTA
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_CEKPELUANG_POPUP_CLICK_CLOSE
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_PELUANGMUDAH_POPUP_CLICK_CTA
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_PELUANGMUDAH_POPUP_CLICK_CLOSE
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_PELUANGSULIT_POPUP_CLICK_CTA_1
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_PELUANGSULIT_POPUP_CLICK_CTA_2
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_PELUANGSULIT_POPUP_CLICK_CLOSE
      data: LoanRankBadgeParam
    }
  | {
      name: TrackingEventName.WEB_PLP_FILTER_INCOME_TOOLTIP_CLICK
      data: LoanRankBadgeParam | null
    }
  | {
      name: TrackingEventName.WEB_PLP_FILTER_AGE_TOOLTIP_CLICK
      data: null
    }
  | {
      name: TrackingEventName.WEB_PLP_FILTER_INCOME_TOOLTIP_CLICK_NEXT
      data: null
    }
  | {
      name: TrackingEventName.WEB_PLP_FILTER_INCOME_TOOLTIP_CLICK_CLOSE
      data: null
    }
  | {
      name: TrackingEventName.WEB_PLP_FILTER_AGE_TOOLTIP_CLICK_PREV
      data: null
    }
  | {
      name: TrackingEventName.WEB_PLP_FILTER_AGE_TOOLTIP_CLICK_CLOSE
      data: null
    }
  | {
      name: TrackingEventName.WEB_PDP_BUTTON_SHARE_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_POPUP_SHARE_WA_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_POPUP_SHARE_TWITTER_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_POPUP_SHARE_EMAIL_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_POPUP_SHARE_COPYLINK_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_POPUP_SHARE_CLOSE
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_TEXT_DESCRIPTION_EXPAND_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_TEXT_DESCRIPTION_COLLAPSE_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_LIHAT_DETAIL_SPESIFIKASI_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_VARIANT_PRICELIST_CLICK
      data: CarVariantSummaryTabPriceSectionParam
    }
  | {
      name: TrackingEventName.WEB_PDP_VARIANT_PRICE_CLICK_CTA
      data: CarVariantSummaryTabPriceSectionParam
    }
  | {
      name: TrackingEventName.WEB_PDP_BANNER_PROMO_CLICK
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_BANNER_PROMO_POPUP_CLOSE
      data: CarVariantParam
    }
  | {
      name: TrackingEventName.WEB_PDP_SPESIFIKASI_TAB_VARIANT_CLICK
      data: CarVariantSummaryTabPriceSectionParam
    }
  | {
      name: TrackingEventName.WEB_PDP_CREDIT_TAB_BUTTON_HITUNG_CICILAN_CLICK
      data: CarVariantCreditTabParam
    }
  | {
      name: TrackingEventName.WEB_PDP_PELUANG_MUDAH_LAINNYA_CLICK
      data: CarVariantCreditTabParam
    }
  | {
      name: TrackingEventWebPDPPhoto
      data: CarVariantPhotoParam
    }
  | {
      name: TrackingExpandFAQ
      data: CarVariantFAQParam
    }
  | {
      name: TrackingExpandSEOFooter
      data: { Page_Origination_URL: string }
    }
  | {
      name: TrackingEventName.WEB_PDP_RECENTLY_VIEWED_CLICK
      data: CarVariantSummaryTabPriceSectionParam
    }
  | {
      name: TrackingEventPLPSortShow
      data: null
    }
  | {
      name: TrackingEventPLPFilterShow
      data: null
    }
  | {
      name: TrackingEventName.WEB_PLP_SORT_CLICK
      data: { sort: string }
    }
  | {
      name: TrackingEventName.WEB_PDP_VARIANT_PRICE_CHANGE_LAYOUT
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_PDP_PROMO_LIHAT_SEMUA_CLICK
      data: SeeAllPromoParam
    }
  | {
      name: TrackingEventLeadsForm
      data: LeadsActionParam
    }
  | {
      name: TrackingEventName.WEB_PDP_CTA_HITUNG_KEMAMPUAN_CLICK
      data: CarVariantHitungKemampuanParam
    }
  | {
      name: TrackingEventName.WEB_REGULAR_CALCULATOR_PAGE_VIEW
      data: RegularLoanCalculatorParam
    }
  | {
      name: TrackingEventName.WEB_LC_KUALIFIKASI_KREDIT_POP_UP_CTA_CLICK
      data: LCCTACreditCualificationParam
    }
  | {
      name: TrackingEventName.WEB_LC_KUALIFIKASI_KREDIT_POP_UP_CLOSE
      data: LCCTACreditCualificationParam
    }
  | {
      name: TrackingEventName.WEB_LC_CTA_WA_DIRECT_CLICK
      data: LCCTACreditCualificationParam
    }
  | {
      name: TrackingEventName.WEB_OTP_RESEND_CLICK
      data: OtpTriggerParam
    }
  | {
      name: TrackingEventName.WEB_OTP_CLOSE
      data: OtpTriggerParam
    }
  | {
      name: TrackingEventName.WEB_LOGIN_PAGE_SUCCESS
      data: LoginSuccessTriggerParam
    }
  | {
      name: TrackingEventName.WEB_REGISTRATION_PAGE_CTA_CLICK
      data: RegisterParam
    }
  | {
      name: TrackingEventName.WEB_PROFILE_PAGE_VIEW
      data: null
    }
  | {
      name: TrackingEventName.WEB_LP_KUALIFIKASI_KREDIT_TOP_CTA_CLICK
      data: null
    }
  | {
      name: TrackingEventName.WEB_PROMO_BANNER_CLICK
      data: UrlDirectionParam
    }
  | {
      name: TrackingEventName.WEB_PROMO_BANNER_SEE_ALL_CLICK
      data: null
    }
  | {
      name: TrackingEventSearchWidgetExpand
      data: null
    }
  | {
      name: TrackingEventName.WEB_LP_HOW_TO_USE_SEVA_CLICK
      data: UrlDirectionParam
    }
  | {
      name: TrackingEventName.WEB_PAGE_DIRECTION_WIDGET_CTA_CLICK
      data: UrlDirectionParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_FORM_PAGE_VIEW
      data: CreditQualificationFlowParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_REVIEW_PAGE_VIEW
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_REVIEW_PAGE_CTA_CLICK
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_CARI_MOBIL_CTA_CLICK
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_UPLOAD_KTP_CLICK
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_WAITING_RESULT_PAGE_VIEW
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_SUCCESS_RESULT_PAGE_VIEW
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_REJECT_RESULT_PAGE_VIEW
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_DOWNLOAD_IOS_CLICK
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_DOWNLOAD_ANDROID_CLICK
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_WA_DIRECT_CLICK
      data: CreditQualificationReviewParam
    }
  | {
      name: TrackingEventName.WEB_FOOTER_CLICK
      data: MenuParam
    }
  | {
      name: TrackingEventName.WEB_BURGER_MENU_CLICK
      data: MenuParam
    }
  | {
      name: TrackingEventName.WEB_BURGER_MENU_OPEN
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_CITYSELECTOR_CANCEL
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_CITYSELECTOR_APPLY
      data: UrlOriginationWithCityParam
    }
  | {
      name: TrackingEventName.WEB_PROFILE_AKUN_SAYA_CLICK
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.SEND_WHATSAPP_MESSAGE
      data: {
        from: EventFromType
        carModel: string
        downPayment: string
        monthlyInstallment: string
        pageFrom: PageFrom
        variantName?: string
        version?: NewHomePageVersion
      }
    }
  | {
      name: TrackingEventName.WEB_CITYSELECTOR_OPEN
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_SEARCHBAR_OPEN
      data: UrlOriginationParam
    }
  | {
      name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_WA_DIRECT_CLICK
      data: CreditQualificationReviewParam
    }
  | NewHomePageTrackingEvent
  | FunnelTrackingEvent

export const trackLandingPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LANDING_PAGE_VIEW,
    data: null,
  })
}
export const trackProfilePageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROFILE_PAGE_VIEW,
    data: null,
  })
}
export const trackLandingPageOldDesignView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LANDING_PAGE_VAR_VIEW,
    data: null,
  })
}
export const trackCarSearchPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CAR_SEARCH_PAGE_VIEW,
    data: null,
  })
}
export const trackCarSearchPageOldDesignView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CAR_SEARCH_PAGE_VAR_VIEW,
    data: null,
  })
}
export const trackVariantListPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_VARIANT_LIST_PAGE_VIEW,
    data: null,
  })
}
export const trackNewVariantListPageView = (value: WebVariantListPageParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_VARIANT_LIST_PAGE_VIEW,
    data: value,
  })
}
export const trackWebPDPPriceTab = (value: WebVariantListPageParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_PRICE_TAB_VIEW,
    data: value,
  })
}
export const trackWebPDPCreditTab = (value: WebVariantListPageParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_CREDIT_TAB_VIEW,
    data: value,
  })
}
export const trackWebPDPGalleryTab = (value: WebVariantListPageParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_GALLERY_TAB_VIEW,
    data: value,
  })
}
export const trackWebPDPSpecificationTab = (value: WebVariantListPageParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_SPECIFICATION_VIEW,
    data: value,
  })
}
export const trackRegularCalculatorPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REGULAR_CALCULATOR_PAGE_VIEW,
    data: null,
  })
}
export const trackSpecialRateCalculatorPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_SPECIAL_RATE_CALCULATOR_PAGE_VIEW,
    data: null,
  })
}
export const trackLoginPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LOGIN_PAGE_VIEW,
    data: null,
  })
}
export const trackLoginOtpPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LOGIN_OTP_PAGE_VIEW,
    data: null,
  })
}
export const trackLoginSuccessPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LOGIN_SUCCESS_PAGE_VIEW,
    data: null,
  })
}
export const trackRegistrationPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REGISTRATION_PAGE_VIEW,
    data: null,
  })
}
export const trackRegistrationOtpPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REGISTRATION_OTP_PAGE_VIEW,
    data: null,
  })
}
export const trackRegistrationSuccessPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REGISTRATION_SUCCESS_PAGE_VIEW,
    data: null,
  })
}
export const trackRegistrationGiiasCRMFormView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_GIIAS_CRM_REGISTRATION_FORM_PAGE_VIEW,
    data: null,
  })
}
export const trackCrmRegistrationSuccessPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_GIIAS_CRM_SUCCESS_PAGE_VIEW,
    data: null,
  })
}
export const trackCrmRegistrationShowQrPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_GIIAS_CRM_SHOWQR_PAGE_VIEW,
    data: null,
  })
}
export const trackCrmRegistrationOtpPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_GIIAS_CRM_OTP_PAGE_VIEW,
    data: null,
  })
}
export const trackVariantListPageCodeSuccess = (code: string) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_VARIANT_LIST_PAGE_CODE_SUCCESS_INPUT,
    data: { code },
  })
}
export const trackVariantListPageCodeFailed = (code: string) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_VARIANT_LIST_PAGE_CODE_FAILED_INPUT,
    data: { code },
  })
}
export const trackLandingPageLeadsFormSubmit = (
  value: LandingPageLeadsFormSubmitParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LANDING_PAGE_LEADS_FORM_SUBMIT,
    data: value,
  })
}
export const trackCarOfMonthLeadsFormSubmit = (
  value: CarBrandAndModelParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CAR_OF_THE_MONTH_LEADS_FORM_SUBMIT,
    data: value,
  })
}
export const trackCarResultPageWaChatbot = (
  value: CarSearchPageMintaPenawaranParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CAR_SEARCH_PAGE_MINTA_PENAWARAN_CLICK_WA_CHATBOT,
    data: value,
  })
}
export const trackCarVariantPageWaChatbot = (
  value: CarSearchPageMintaPenawaranParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CAR_VARIANT_LIST_PAGE_CLICK_WA_CHATBOT,
    data: value,
  })
}
export const trackCarVariantCreditPageWaChatbot = (
  value: CarVariantCreditTabParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CAR_VARIANT_LIST_CREDIT_TAB_CLICK_WA_CHATBOT,
    data: value,
  })
}
export const trackCarVariantListPageLeadsFormSumit = (
  value: CarSearchPageMintaPenawaranParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CAR_VARIANT_LIST_PAGE_LEADS_FORM_SUBMIT,
    data: value,
  })
}
export const trackVariantListPageWaChatbot = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CAR_VARIANT_LIST_PAGE_LEADS_FORM_SUBMIT,
    data: null,
  })
}
export const trackRegularCalculatorWaChatbot = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REGULAR_CALCULATOR_PAGE_CONTACT_US_CLICK_WA_CHATBOT,
    data: null,
  })
}
export const trackSpecialRateCalculatorWaChatbot = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_SPECIAL_RATE_CALCULATOR_PAGE_CONTACT_US_CLICK_WA_CHATBOT,
    data: null,
  })
}
export const trackRefinancingPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REFINANCING_LANDING_PAGE_VIEW,
    data: null,
  })
}

export const trackRefinancingFormPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REFINANCING_LEADS_FORM_PAGE_VIEW,
    data: null,
  })
}

export const trackRefinancingLeadsBannerClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REFINANCING_LEADS_BANNER_CLICK,
    data: null,
  })
}

export const trackRefinancingFirstLeadsFormSubmit = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REFINANCING_1ST_LEADS_FORM_SUBMIT,
    data: null,
  })
}
export const trackRefinancingSecondLeadsFormSubmit = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REFINANCING_2ND_LEADS_FORM_SUBMIT,
    data: null,
  })
}
export const trackRefinancingQuestionBannerClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REFINANCING_QUESTION_BANNER_CLICK,
    data: null,
  })
}
export const trackRefinancingFirstQuestionFormSubmit = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REFINANCING_1ST_QUESTION_FORM_SUBMIT,
    data: null,
  })
}
export const trackRefinancingSecondQuestionFormSubmit = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REFINANCING_2ND_QUESTION_FORM_SUBMIT,
    data: null,
  })
}
export const trackLPKualifikasiKreditTopCtaClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_KUALIFIKASI_KREDIT_TOP_CTA_CLICK,
    data: null,
  })
}
export const trackLandingPageSearchWidgetSubmit = (
  value: SearchWidgetParams,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_SEARCHWIDGET_SUBMIT,
    data: value,
  })
}
export const trackLandingPageAdvanceSearchClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_SEARCHWIDGET_ADVANCED_SEARCH_CLICK,
    data: null,
  })
}
export const trackCarOfTheMonthBrandClick = (value: CarBrandOnlyParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_CAROFTHEMONTH_BRAND_CLICK,
    data: value,
  })
}
export const trackCarOfTheMonthItemClick = (value: CarBrandAndModelParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_CAROFTHEMONTH_CAR_CLICK,
    data: value,
  })
}
export const trackCarBrandRecomSeeAllClick = (value: CarBrandOnlyParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_SEE_ALL_CLICK,
    data: value,
  })
}
export const trackCarBrandRecomLogoClick = (value: CarBrandOnlyParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_LOGO_CLICK,
    data: value,
  })
}
export const trackCarBrandRecomItemClick = (value: CarBrandAndModelParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_CAR_CLICK,
    data: value,
  })
}
export const trackCarBrandRecomHitungKemampuanClick = (
  value: CarBrandAndModelParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_CTA_HITUNG_KEMAMPUAN_CLICK,
    data: value,
  })
}
export const trackCarBrandRecomItemSeeAllClick = (value: CarBrandOnlyParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_BRANDRECOMMENDATION_CAR_SEE_ALL_CLICK,
    data: value,
  })
}
export const trackCarBodyTypeRecomSeeAllClick = (
  value: CarBodyTypeOnlyParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_TYPERECOMMENDATION_SEE_ALL_CLICK,
    data: value,
  })
}
export const trackCarBodyTypeRecomLogoClick = (value: CarBodyTypeOnlyParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_TYPERECOMMENDATION_LOGO_CLICK,
    data: value,
  })
}
export const trackCarBodyTypeRecomItemClick = (
  value: CarBodyTypeDetailParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_TYPERECOMMENDATION_CAR_CLICK,
    data: value,
  })
}
export const trackCarBodyTypeRecomItemSeeAllClick = (
  value: CarBodyTypeOnlyParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_TYPERECOMMENDATION_CAR_SEE_ALL_CLICK,
    data: value,
  })
}
export const trackLoanCalcWidgetItemClick = (
  value: CarBrandModelVariantParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_CALCULATORWIDGET_CLICK,
    data: value,
  })
}
export const trackArticleSeeAllClick = (value: ArticleCategoryParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_ARTICLE_SEE_ALL_CLICK,
    data: value,
  })
}
export const trackArticleCategoryItemClick = (value: ArticleCategoryParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_ARTICLE_CATEGORY_CLICK,
    data: value,
  })
}
export const trackArticleSecondaryItemClick = (value: ArticleDetailParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_ARTICLE_CLICK,
    data: value,
  })
}
export const trackArticlMainItemClick = (value: ArticleDetailParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_MAIN_ARTICLE_CLICK,
    data: value,
  })
}
export const trackHeaderNavigationMenuClick = (
  name: TrackingEventWebNavigation,
) => {
  const originationUrl = window.location.href
  return logAmplitudeEvent({
    name,
    data: { Page_Origination_URL: originationUrl.replace('https://www.', '') },
  })
}
export const trackFooterNavigationMenuClick = (
  name: TrackingEventWebFooterNavigation,
) => {
  const originationUrl = window.location.href
  return logAmplitudeEvent({
    name,
    data: { Page_Origination_URL: originationUrl.replace('https://www.', '') },
  })
}
export const trackPDPGalleryVideo = (
  name: TrackingEventWebPDPGalleryVideo,
  value: CarVariantParam,
) => {
  return logAmplitudeEvent({
    name,
    data: value,
  })
}
export const trackDownloadBrosurClick = (value: CarVariantParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_BUTTON_DOWNLOAD_BROSUR_CLICK,
    data: value,
  })
}
export const trackGantiLokasiClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CITYSELECTOR_GANTILOKASI_CLICK,
    data: value,
  })
}
export const trackPilihKotaClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CITYSELECTOR_PILIHKOTA_CLICK,
    data: value,
  })
}
export const trackCityListClick = (value: UrlOriginationWithCityParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CITY_SELECTOR_POPUP_SUGGESTION_CLICK,
    data: value,
  })
}
export const trackHomepageBannerClick = (value: BannerParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_TOP_BANNER_CLICK,
    data: value,
  })
}
export const trackHomepageBannerView = (value: BannerParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_TOP_BANNER_VIEW,
    data: value,
  })
}
export const trackHomepageBannerPrevNextClick = (value: BannerParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_TOP_BANNER_NEXT_PREV_CLICK,
    data: value,
  })
}

export const trackHeaderLogoClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_SEVALOGO_CLICK,
    data: value,
  })
}

export const trackSearchBarSuggestionClick = (value: UrlDirectionParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_SEARCHBAR_SUGGESTION_CLICK,
    data: value,
  })
}

export const trackLoginOrRegisterClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LOGIN_BUTTON_CLICK,
    data: value,
  })
}

export const trackProfileAccountClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROFILE_CLICK,
    data: value,
  })
}

export const trackLogoutClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROFILE_KELUAR_CLICK,
    data: value,
  })
}

export const trackAnnouncementBoxClick = (value: UrlAnnouncementBoxParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_ANNOUNCEMENT_BOX_CLICK_CTA,
    data: value,
  })
}

export const trackAnnouncementBoxClose = (value: UrlAnnouncementBoxParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_ANNOUNCEMENT_BOX_CLICK_CLOSE,
    data: value,
  })
}

export const trackFloatingIconClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CARAPAKAI_ICON_CLICK,
    data: value,
  })
}

export const trackFloatingIconOnExpandClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CARAPAKAI_EXPAND_CLICK,
    data: value,
  })
}
export const trackLPTestimonyNextPrevClick = (
  value: NumbersOfCardViewedParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_TESTIMONY_NEXT_PREV_CLICK,
    data: value,
  })
}
export const trackLPTestimonyClick = (value: OrderParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_TESTIMONY_CLICK,
    data: value,
  })
}
export const trackLPTestimonyPopupClose = (value: OrderParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_TESTIMONY_POP_UP_CLOSE,
    data: value,
  })
}
export const trackLPSubProductClick = (value: SubProductParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_SUB_PRODUCT_CLICK,
    data: value,
  })
}
export const trackPLPClearFilter = (value: CarResultPageFilterParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_CLEAR_FILTER,
    data: value,
  })
}
export const trackPLPSubmitFilter = (value: CarResultPageFilterParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_FILTER_SUBMIT,
    data: value,
  })
}
export const trackPLPCarClick = (value: CarSearchPageMintaPenawaranParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_CAR_CLICK,
    data: value,
  })
}
export const trackCekPeluangBadgeClick = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_CEKPELUANG_BANNER_CLICK,
    data: value,
  })
}
export const trackPeluangMudahBadgeClick = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_PELUANGMUDAH_BANNER_CLICK,
    data: value,
  })
}
export const trackPeluangSulitBadgeClick = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_PELUANGSULIT_BANNER_CLICK,
    data: value,
  })
}
export const trackCekPeluangPopUpCtaClick = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_CEKPELUANG_POPUP_CLICK_CTA,
    data: value,
  })
}
export const trackCekPeluangPopUpCloseClick = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_CEKPELUANG_POPUP_CLICK_CLOSE,
    data: value,
  })
}
export const trackPeluangMudahPopUpCtaClick = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_PELUANGMUDAH_POPUP_CLICK_CTA,
    data: value,
  })
}
export const trackPeluangMudahPopUpCloseClick = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_PELUANGMUDAH_POPUP_CLICK_CLOSE,
    data: value,
  })
}
export const trackPeluangSulitPopUpCta1Click = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_PELUANGSULIT_POPUP_CLICK_CTA_1,
    data: value,
  })
}
export const trackPeluangSulitPopUpCta2Click = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_PELUANGSULIT_POPUP_CLICK_CTA_2,
    data: value,
  })
}
export const trackPeluangSulitPopUpCloseClick = (value: LoanRankBadgeParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_PELUANGSULIT_POPUP_CLICK_CLOSE,
    data: value,
  })
}
export const trackFilterIncomeTooltipClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_FILTER_INCOME_TOOLTIP_CLICK,
    data: null,
  })
}
export const trackFilterAgeTooltipClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_FILTER_AGE_TOOLTIP_CLICK,
    data: null,
  })
}
export const trackIncomeTooltipNextClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_FILTER_INCOME_TOOLTIP_CLICK_NEXT,
    data: null,
  })
}
export const trackIncomeTooltipCloseClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_FILTER_INCOME_TOOLTIP_CLICK_CLOSE,
    data: null,
  })
}
export const trackAgeTooltipPrevClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_FILTER_AGE_TOOLTIP_CLICK_PREV,
    data: null,
  })
}
export const trackAgeTooltipCloseClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_FILTER_AGE_TOOLTIP_CLICK_CLOSE,
    data: null,
  })
}
export const trackCarVariantShareClick = (value: CarVariantParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_BUTTON_SHARE_CLICK,
    data: value,
  })
}
export const trackCarVariantSharePopupWaClick = (value: CarVariantParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_POPUP_SHARE_WA_CLICK,
    data: value,
  })
}
export const trackCarVariantSharePopupTwitterClick = (
  value: CarVariantParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_POPUP_SHARE_TWITTER_CLICK,
    data: value,
  })
}
export const trackCarVariantSharePopupEmailClick = (value: CarVariantParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_POPUP_SHARE_EMAIL_CLICK,
    data: value,
  })
}
export const trackCarVariantSharePopupCopyLinkClick = (
  value: CarVariantParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_POPUP_SHARE_COPYLINK_CLICK,
    data: value,
  })
}
export const trackCarVariantSharePopupClose = (value: CarVariantParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_POPUP_SHARE_CLOSE,
    data: value,
  })
}
export const trackCarVariantDescriptionExpandClick = (
  value: CarVariantParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_TEXT_DESCRIPTION_EXPAND_CLICK,
    data: value,
  })
}
export const trackCarVariantDescriptionCollapseClick = (
  value: CarVariantParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_TEXT_DESCRIPTION_COLLAPSE_CLICK,
    data: value,
  })
}
export const trackCarVariantLihatDetailSpesifikasiClick = (
  value: CarVariantParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_LIHAT_DETAIL_SPESIFIKASI_CLICK,
    data: value,
  })
}
export const trackCarVariantPricelistClick = (
  value: CarVariantSummaryTabPriceSectionParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_VARIANT_PRICELIST_CLICK,
    data: value,
  })
}
export const trackCarVariantPricelistClickCta = (
  value: CarVariantSummaryTabPriceSectionParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_VARIANT_PRICE_CLICK_CTA,
    data: value,
  })
}
export const trackCarVariantBannerPromoClick = (value: CarVariantParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_BANNER_PROMO_CLICK,
    data: value,
  })
}
export const trackCarVariantBannerPromoPopupClose = (
  value: CarVariantParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_BANNER_PROMO_POPUP_CLOSE,
    data: value,
  })
}
export const trackSpesifikaiTabVariantClick = (
  value: CarVariantSummaryTabPriceSectionParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_SPESIFIKASI_TAB_VARIANT_CLICK,
    data: value,
  })
}
export const trackCreditHitungCicilanClick = (
  value: CarVariantCreditTabParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_CREDIT_TAB_BUTTON_HITUNG_CICILAN_CLICK,
    data: value,
  })
}

export const trackCreditPeluangLainnyaClick = (
  value: CarVariantCreditTabParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_PELUANG_MUDAH_LAINNYA_CLICK,
    data: value,
  })
}

export const trackPDPPhotoClick = (
  event: TrackingEventWebPDPPhoto,
  value: CarVariantPhotoParam,
) => {
  logAmplitudeEvent({
    name: event,
    data: value,
  })
}

export const trackRecentlyViewedClick = (
  value: CarVariantSummaryTabPriceSectionParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_RECENTLY_VIEWED_CLICK,
    data: value,
  })
}

export const trackFAQExpandClick = (
  event: TrackingExpandFAQ,
  value: CarVariantFAQParam,
) => {
  logAmplitudeEvent({
    name: event,
    data: value,
  })
}

export const trackSEOFooterExpandClick = (event: TrackingExpandSEOFooter) => {
  const originationUrl = window.location.href
  return logAmplitudeEvent({
    name: event,
    data: { Page_Origination_URL: originationUrl.replace('https://www.', '') },
  })
}

export const trackPLPSortShow = (show: boolean) => {
  const trackEvent = show
    ? TrackingEventName.WEB_PLP_SORT_OPEN
    : TrackingEventName.WEB_PLP_SORT_CLOSE
  return logAmplitudeEvent({
    name: trackEvent,
    data: null,
  })
}

export const trackPLPFilterShow = (show: boolean) => {
  const trackEvent = show
    ? TrackingEventName.WEB_PLP_FILTER_CLICK
    : TrackingEventName.WEB_PLP_FILTER_CLOSE
  return logAmplitudeEvent({
    name: trackEvent,
    data: null,
  })
}

export const trackPLPSortClick = (sort: string) => {
  return logAmplitudeEvent({
    name: TrackingEventName.WEB_PLP_SORT_CLICK,
    data: { sort },
  })
}
export const trackChangeLayoutClick = (value: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_VARIANT_PRICE_CHANGE_LAYOUT,
    data: value,
  })
}

export const trackSeeAllPromoClick = (value: SeeAllPromoParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_PROMO_LIHAT_SEMUA_CLICK,
    data: value,
  })
}

export const trackLeadsFormAction = (
  name: TrackingEventLeadsForm,
  data: LeadsActionParam,
) => {
  logAmplitudeEvent({ name, data })
}

export const trackPDPPhotoSwipe = (
  event: TrackingEventWebPDPPhoto,
  value: CarVariantPhotoParam,
) => {
  logAmplitudeEvent({
    name: event,
    data: value,
  })
}
export const trackPDPHitungKemampuan = (
  data: CarVariantHitungKemampuanParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PDP_CTA_HITUNG_KEMAMPUAN_CLICK,
    data,
  })
}
export const trackRegularCalculatorPage = (
  value: RegularLoanCalculatorParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REGULAR_CALCULATOR_PAGE_VIEW,
    data: value,
  })
}

export const trackOpenBurgerMenu = (data: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_BURGER_MENU_OPEN,
    data,
  })
}

export const trackBurgerMenuClick = (data: MenuParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_BURGER_MENU_CLICK,
    data,
  })
}

export const trackSevaLogoClick = (data: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_SEVALOGO_CLICK,
    data,
  })
}

export const trackSearchbarOpen = (data: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_SEARCHBAR_OPEN,
    data,
  })
}

export const trackSearchbarSuggestionClick = (data: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_SEARCHBAR_SUGGESTION_CLICK,
    data,
  })
}

export const trackLoginButtonClick = (data: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LOGIN_BUTTON_CLICK,
    data,
  })
}

export const trackProfileAkunSayaClick = (data: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROFILE_AKUN_SAYA_CLICK,
    data,
  })
}

export const trackCitySelectorOpen = (data: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CITYSELECTOR_OPEN,
    data,
  })
}

export const trackCitySelectorCancel = (data: UrlOriginationParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CITYSELECTOR_CANCEL,
    data,
  })
}

export const trackCitySelectorApply = (data: UrlOriginationWithCityParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_CITYSELECTOR_APPLY,
    data,
  })
}

export const trackFooterClick = (data: MenuParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_FOOTER_CLICK,
    data,
  })
}

export const trackLCCarRecommendationClick = (
  data: LCCarRecommendationParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_CAR_RECOMMENDATION_CLICK,
    data,
  })
}

export const trackLCCarRecommendationCTAClick = (
  data: LCCarRecommendationParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_CAR_RECOMMENDATION_CTA_CLICK,
    data,
  })
}

export const trackLCArticleClick = (data: LCArticleParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_ARTICLE_CLICK,
    data,
  })
}

export const trackLCAllArticleClick = (data: LCAllArticleParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_ALL_ARTICLE_CLICK,
    data,
  })
}

export const trackLCCTAHitungKemampuanClick = (data: LCCTACalculateParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_CTA_HITUNG_KEMAMPUAN_CLICK,
    data,
  })
}

export const trackLCKualifikasiKreditClick = (
  data: LCCTACreditCualificationParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_CTA_KUALIFIKASI_KREDIT_CLICK,
    data,
  })
}

export const trackLCKualifikasiKreditTooltipCTAClick = (
  data: LCCTACreditCualificationParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_KUALIFIKASI_KREDIT_TOOLTIP_CTA_CLICK,
    data,
  })
}

export const trackLCKualifikasiKreditTooltipCTACloseClick = (
  data: LCCTACreditCualificationParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_KUALIFIKASI_KREDIT_TOOLTIP_CTA_CLOSE,
    data,
  })
}

export const trackLCKualifikasiKreditPopUpCtaClick = (
  data: LCCTACreditCualificationParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_KUALIFIKASI_KREDIT_POP_UP_CTA_CLICK,
    data,
  })
}
export const trackLCKualifikasiKreditPopUpClose = (
  data: LCCTACreditCualificationParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_KUALIFIKASI_KREDIT_POP_UP_CLOSE,
    data,
  })
}
export const trackLCCtaWaDirectClick = (
  data: LCCTACreditCualificationParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LC_CTA_WA_DIRECT_CLICK,
    data,
  })
}

export const trackOtpResendClick = (data: OtpTriggerParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_OTP_RESEND_CLICK,
    data,
  })
}

export const trackOtpClose = (data: OtpTriggerParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_OTP_CLOSE,
    data,
  })
}

export const trackLoginPageSuccess = (data: LoginSuccessTriggerParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LOGIN_PAGE_SUCCESS,
    data,
  })
}

export const trackRegisterPageCtaClick = (data: RegisterParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_REGISTRATION_PAGE_CTA_CLICK,
    data,
  })
}

export const trackPromoBannerSeeAllClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROMO_BANNER_SEE_ALL_CLICK,
    data: null,
  })
}

export const trackPromoBannerClick = (data: UrlDirectionParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROMO_BANNER_CLICK,
    data,
  })
}

export const trackSearchWidgetExpand = (
  name: TrackingEventSearchWidgetExpand,
) => {
  logAmplitudeEvent({
    name,
    data: null,
  })
}

export const trackLPHowToUseSevaClick = (data: UrlDirectionParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_LP_HOW_TO_USE_SEVA_CLICK,
    data,
  })
}

export const trackCTAWidgetDirection = (data: UrlDirectionParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PAGE_DIRECTION_WIDGET_CTA_CLICK,
    data,
  })
}

export const trackKualifikasiKreditFormPageView = (
  data: CreditQualificationFlowParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_FORM_PAGE_VIEW,
    data,
  })
}

export const trackKualifikasiKreditReviewPageView = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_REVIEW_PAGE_VIEW,
    data,
  })
}

export const trackKualifikasiKreditReviewPageCtaClick = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_REVIEW_PAGE_CTA_CLICK,
    data,
  })
}

export const trackKualifikasiKreditCariMobilClick = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_CARI_MOBIL_CTA_CLICK,
    data,
  })
}

export const trackKualifikasiKreditUploadKTP = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_UPLOAD_KTP_CLICK,
    data,
  })
}

export const trackKualifikasiKreditWaitingResultPageView = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_WAITING_RESULT_PAGE_VIEW,
    data,
  })
}

export const trackKualifikasiKreditSuccessResultPageView = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_SUCCESS_RESULT_PAGE_VIEW,
    data,
  })
}

export const trackKualifikasiKreditRejectResultPageView = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_REJECT_RESULT_PAGE_VIEW,
    data,
  })
}

export const trackKualifikasiKreditDownloadIosClick = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_DOWNLOAD_IOS_CLICK,
    data,
  })
}

export const trackKualifikasiKreditDownloadAndroidClick = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_DOWNLOAD_ANDROID_CLICK,
    data,
  })
}

export const trackKualifikasiKreditWaDirectClick = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_WA_DIRECT_CLICK,
    data,
  })
}

export const trackWhatsappButtonClickFromCarResults = (
  from: EventFromType,
  carModel: string,
  downPayment: string,
  monthlyInstallment: string,
  pageFrom: PageFrom,
  variantName?: string,
  version?: NewHomePageVersion,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.SEND_WHATSAPP_MESSAGE,
    data: {
      from,
      carModel,
      downPayment,
      monthlyInstallment,
      pageFrom,
      variantName,
      version,
    },
  })
}

export const trackKualifikasiKreditCarDetailClick = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_CAR_DETAIL_CLICK,
    data,
  })
}

export const trackKualifikasiKreditCarDetailClose = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_CAR_DETAIL_CLOSE,
    data,
  })
}

export const trackKualifikasiKreditFormPageCTAClick = (
  data: CreditQualificationReviewParam,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_KUALIFIKASI_KREDIT_FORM_PAGE_CTA_CLICK,
    data,
  })
}

export const trackProfileSaveKtpChanges = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROFILE_PAGE_SAVE_KTP_CHANGES,
    data: null,
  })
}

export const trackDeleteAccountPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_PAGE_VIEW,
    data: null,
  })
}

export const trackDeleteAccountReasonPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_REASON_PAGE_VIEW,
    data: null,
  })
}

export const trackDeleteAccountSuccessPageView = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_SUCCESS_PAGE_VIEW,
    data: null,
  })
}

export const trackProfilePageSaveChanges = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROFILE_PAGE_SAVE_CHANGES,
    data: null,
  })
}

export const trackProfilePageLogoutClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROFILE_PAGE_LOGOUT_CLICK,
    data: null,
  })
}

export const trackProfilePageDeleteAccountEntryPointClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_PROFILE_PAGE_DELETE_ACCOUNT_ENTRY_POINT_CLICK,
    data: null,
  })
}

export const trackProfileDeleteAccountConsentPageCTAClick = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_CONSENT_PAGE_CTA_CLICK,
    data: null,
  })
}

export const trackDeleteAccountReasonPageCTAClick = (data: ReasonParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_REASON_PAGE_CTA_CLICK,
    data,
  })
}

export const trackDeleteAccountPopupCTACancelClick = (data: ReasonParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_POPUP_CTA_CANCEL_CLICK,
    data,
  })
}

export const trackDeleteAccountPopupCTAYesClick = (data: ReasonParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_POPUP_CTA_YES_CLICK,
    data,
  })
}

export const trackDeleteAccountPopupClose = (data: ReasonParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_POPUP_CLOSE,
    data,
  })
}

export const trackDeleteAccountSucessCTAClick = (data: ReasonParam) => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_DELETE_ACCOUNT_SUCCESS_CTA_CLICK,
    data,
  })
}
