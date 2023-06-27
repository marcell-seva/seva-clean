import dynamic from 'next/dynamic'
import { CarDetailCard } from './carDetailCard'
import FilterMobile from './filterMobile'
import { FooterMobile } from './footerMobile'
import { HeaderMobile } from './headerMobile'
// import LeadsFormPrimary  from './leadsForm/primary'
import { NavigationFilterMobile } from './navigationFilterMobile'
import { PLP } from './PLP'
import { PLPEmpty } from './plpEmpty'
import { PLPSkeleton } from './plpSkeleton'
import { PopupPromo } from './popupPromo'
import { PopupResultInfo } from './popupResultFilter/resultInfo'
import { PopupResultMudah } from './popupResultFilter/resultMudah'
import { PopupResultSulit } from './popupResultFilter/resultSulit'
import SortingMobile from './sortingMobile'

// const FilterMobile = dynamic(() => import('./filterMobile'), { ssr: false })
// const SortingMobile = dynamic(() => import('./sortingMobile'), { ssr: false })

export {
  CarDetailCard,
  FooterMobile,
  HeaderMobile,
  // LeadsFormPrimary,
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
}
