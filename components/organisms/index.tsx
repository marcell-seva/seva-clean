import { CarDetailCard } from './carDetailCard'
import FilterMobile from './filterMobile'
import FilterMobileUsedCar from './filterMobileUsedCar'
import { FooterMobile } from './footerMobile'
import { HeaderMobile } from './headerMobile'
import { LeadsFormPrimary } from './leadsForm/primary'
import { NavigationFilterMobile } from './navigationFilterMobile'
import { NavigationFilterMobileUsedCar } from './navigationFilterMobileUsedCar'
import { PLP } from './PLP'
import { PLPEmpty } from './plpEmpty'
import { PLPEmptyUsedCar } from './plpEmptyUsedCar'
import { PLPSkeleton } from './plpSkeleton'
import { PopupPromo } from './popupPromo'
import { PopupResultInfo } from './popupResultFilter/resultInfo'
import { PopupResultMudah } from './popupResultFilter/resultMudah'
import { PopupResultSulit } from './popupResultFilter/resultSulit'
import SortingMobile from './sortingMobile'
import SortingMobileUsedCar from './sortingMobileUsedCar'
import PdpMobile from './PdpMobile'
import { PdpLowerSection } from './pdpLowerSection'
import { PdpUsedCarLowerSection } from './pdpUsedCarLowerSection'
import { PdpUpperSection } from './pdpUpperSection'
import PDPSkeleton from './pdpSkeleton'
import { ProductDetailEmptyState } from './emptyState/pdp/index'
import { WarnaTab } from './tabContent/upper/warna'
import { ExteriorTab } from './tabContent/upper/exterior'
import { InteriorTab } from './tabContent/upper/interior'
import { Interior360ViewerTab } from './tabContent/upper/interior360Viewer'
import { SummaryTab } from './tabContent/lower/summary'
import { DescriptionTab } from './tabContent/lower/description'
import { CreditUsedCarTab } from './tabContent/lower/creditUsedCar'
import { SpecificationTab } from './tabContent/lower/spesification'
import { VideoTab } from './tabContent/upper/video'
import { CarOverview } from './tabContent/upper/carOverview'
import { CreditTabV1 } from './tabContent/lower/credit/v1'
import { CreditTabV2 } from './tabContent/lower/credit/v2'
import { PriceTab } from './tabContent/lower/price'
import { LeadsFormSecondary } from './leadsForm/secondary'
import PromoSection from './promoSection/index'
import Articles from './articles/index'
import { CalculationResult } from './calculationResult/index'
import { CalculationUsedCarResult } from './calculationUsedCarResult/index'
import PDPCarOverviewSkeleton from './pdpCarOverviewSkeleton'
import SidebarMobile from './sidebarMobile'
import HomepageMobile from './homepageMobile'
import LeadsFormTertiary from './leadsForm/tertiary'
import ArticleWidget from './articleWidget'
import SearchWidget from './searchWidget'
import UsedCarSearchWidget from './searchWidget/usedCarSearchWidget'
import { WebAnnouncementBox } from './webAnnouncementBox'
import LpSkeleton from './lpSkeleton'
import MainHeroLP from './mainHeroLP'
import SubProduct from './subProduct'
import TestimonyWidget from './testimonyWidget'
import LpCarRecommendations from './lpCarRecommendations'
import CarOfTheMonth from './carOfTheMonth'
import dynamic from 'next/dynamic'
import HomepageAdaSEVAdiOTO from './homepageAdaSEVAdiOTO'
import { InsuranceTooltip } from './insuranceTooltip'
import InformationSection from './InformationSection'
import LeadsFormAdaOTOdiSEVA from './leadsForm/adaOTOdiSEVA'
import { AdaOTOdiSEVALeadsForm } from './leadsForm/adaOTOdiSEVA/popUp'
import { LoginModalMultiKK } from './loginModalMultiKK'
import { UsedCarDetailCard } from './usedCarDetailCard'
import { Login } from './login'
import { Register } from './register'
import UsedPdpMobile from './UsedPdpMobile'
import { LeadsFormUsedCar } from './leadsForm/usedCar'
import Profile from './profile'
import { SearchWidgetSection } from './searchWidgetSection'
import UsedCarRecommendations from './UsedCarRecommendations'
import { AlternativeUsedCarRecomendationCard } from './alternativeUsedCarRecomendationCard'
import { PopupResultRecommended } from './popupResultFilter/resultRecommended'
import { CarGallery } from './tabContent/upper/CarGallery'
import PdpUsedCarUpperSection from './PdpUsedCarUpperSection'
import { RefinancingLandingPageContent } from './refinancingLandingPageContent'
import { TemanSevaPageHeader } from './temanSevaPageHeader'
import { InternalServerErrorPageContent } from './internalServerErrorPageContent'
import { NotFoundErrorPageContent } from './notFoundErrorPageContent'

const Exterior360ViewerTab = dynamic(
  () => import('./tabContent/upper/exterior360Viewer'),
)

export {
  LoginModalMultiKK,
  CarDetailCard,
  FooterMobile,
  HeaderMobile,
  LeadsFormPrimary,
  PLPEmpty,
  PLPEmptyUsedCar,
  PLPSkeleton,
  PopupPromo,
  PopupResultSulit,
  PopupResultMudah,
  PopupResultInfo,
  SortingMobile,
  SortingMobileUsedCar,
  NavigationFilterMobile,
  NavigationFilterMobileUsedCar,
  FilterMobile,
  FilterMobileUsedCar,
  PLP,
  PdpMobile,
  PdpLowerSection,
  PdpUpperSection,
  PDPSkeleton,
  ProductDetailEmptyState,
  WarnaTab,
  ExteriorTab,
  InteriorTab,
  Exterior360ViewerTab,
  Interior360ViewerTab,
  SummaryTab,
  SpecificationTab,
  VideoTab,
  CarOverview,
  CreditTabV1,
  CreditTabV2,
  PriceTab,
  LeadsFormSecondary,
  PromoSection,
  Articles,
  CalculationResult,
  PDPCarOverviewSkeleton,
  SidebarMobile,
  HomepageMobile,
  LeadsFormTertiary,
  ArticleWidget,
  SearchWidget,
  WebAnnouncementBox,
  LpSkeleton,
  MainHeroLP,
  SubProduct,
  TestimonyWidget,
  LpCarRecommendations,
  CarOfTheMonth,
  InsuranceTooltip,
  HomepageAdaSEVAdiOTO,
  LeadsFormAdaOTOdiSEVA,
  AdaOTOdiSEVALeadsForm,
  UsedCarDetailCard,
  InformationSection,
  Login,
  Register,
  UsedPdpMobile,
  LeadsFormUsedCar,
  DescriptionTab,
  PdpUsedCarLowerSection,
  CreditUsedCarTab,
  Profile,
  SearchWidgetSection,
  UsedCarSearchWidget,
  UsedCarRecommendations,
  AlternativeUsedCarRecomendationCard,
  PopupResultRecommended,
  CarGallery,
  PdpUsedCarUpperSection,
  CalculationUsedCarResult,
  RefinancingLandingPageContent,
  TemanSevaPageHeader,
  InternalServerErrorPageContent,
  NotFoundErrorPageContent,
}
