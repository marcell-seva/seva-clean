import { CarDetailCard } from './carDetailCard'
import FilterMobile from './filterMobile'
import { FooterMobile } from './footerMobile'
import { HeaderMobile } from './headerMobile'
import { LeadsFormPrimary } from './leadsForm/primary'
import { NavigationFilterMobile } from './navigationFilterMobile'
import { PLP } from './PLP'
import { PLPEmpty } from './plpEmpty'
import { PLPSkeleton } from './plpSkeleton'
import { PopupPromo } from './popupPromo'
import { PopupResultInfo } from './popupResultFilter/resultInfo'
import { PopupResultMudah } from './popupResultFilter/resultMudah'
import { PopupResultSulit } from './popupResultFilter/resultSulit'
import SortingMobile from './sortingMobile'
import PdpDesktop from './PdpDesktop/index'
import PdpMobile from './PdpMobile'
import { PdpLowerSection } from './pdpLowerSection'
import { PdpUpperSection } from './pdpUpperSection'
import PDPSkeleton from './pdpSkeleton'
import { ProductDetailEmptyState } from './emptyState/pdp/index'
import { WarnaTab } from './tabContent/upper/warna'
import { ExteriorTab } from './tabContent/upper/exterior'
import { InteriorTab } from './tabContent/upper/interior'

import { Interior360ViewerTab } from './tabContent/upper/interior360Viewer'
import { SummaryTab } from './tabContent/lower/summary'
import { SpecificationTab } from './tabContent/lower/spesification'
import { VideoTab } from './tabContent/upper/video'
import { CarOverview } from './tabContent/upper/carOverview'
import { CreditTab } from './tabContent/lower/credit'
import { PriceTab } from './tabContent/lower/price'
import { LeadsFormSecondary } from './leadsForm/secondary'
import PromoSection from './promoSection/index'
import Articles from './articles/index'
import { CalculationResult } from './calculationResult/index'
import PDPCarOverviewSkeleton from './pdpCarOverviewSkeleton'
import SidebarMobile from './sidebarMobile'
import dynamic from 'next/dynamic'

const Exterior360ViewerTab = dynamic(
  () => import('./tabContent/upper/exterior360Viewer'),
)

// const FilterMobile = dynamic(() => import('./filterMobile'), { ssr: false })
// const SortingMobile = dynamic(() => import('./sortingMobile'), { ssr: false })

export {
  CarDetailCard,
  FooterMobile,
  HeaderMobile,
  LeadsFormPrimary,
  PLPEmpty,
  PLPSkeleton,
  PopupPromo,
  PopupResultSulit,
  PopupResultMudah,
  PopupResultInfo,
  SortingMobile,
  NavigationFilterMobile,
  FilterMobile,
  PLP,
  PdpDesktop,
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
  CreditTab,
  PriceTab,
  LeadsFormSecondary,
  PromoSection,
  Articles,
  CalculationResult,
  PDPCarOverviewSkeleton,
  SidebarMobile,
}
