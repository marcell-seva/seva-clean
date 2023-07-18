import { CarButtonProps } from 'utils/types/context'

const IconTypeSuv = '/assets/illustration/Car_Type_Icons_SUV.png'
const IconTypeSport = '/assets/illustration/Car_Type_Icons_Sport.png'
const IconTypeSedan = '/assets/illustration/Car_Type_Icons_Sedan.png'
const IconTypeMpv = '/assets/illustration/Car_Type_Icons_MPV.png'
const IconTypeMinivan = '/assets/illustration/Car_Type_Icons_Minivan.png'
const IconTypeHatchback = '/assets/illustration/Car_Type_Icons_Hatchback.png'
const IconTypeCrossover = '/assets/illustration/Car_Type_Icons_Crossover.png'

export const newBodyTypes: CarButtonProps[] = [
  {
    key: 'MPV',
    icon: <img src={IconTypeMpv} alt="MPV" width="50" height="30" />,
    value: 'MPV',
  },
  {
    key: 'Sedan',
    icon: <img src={IconTypeSedan} alt="SEDAN" width="50" height="30" />,
    value: 'SEDAN',
  },
  {
    key: 'SUV',
    icon: <img src={IconTypeSuv} alt="SUV" width="50" height="30" />,
    value: 'SUV',
  },
  {
    key: 'Crossover',
    icon: <img src={IconTypeCrossover} alt="Crossover" width="" height="30" />,
    value: 'Crossover',
  },
  {
    key: 'Hatchback',
    icon: (
      <img src={IconTypeHatchback} alt="Hatchback" width="50" height="30" />
    ),
    value: 'HATCHBACK',
  },
  {
    key: 'Minivan',
    icon: <img src={IconTypeMinivan} alt="Minivan" width="50" height="30" />,
    value: 'Minivan',
  },
  {
    key: 'Sport',
    icon: <img src={IconTypeSport} alt="Sport" width="50" height="30" />,
    value: 'SPORT',
  },
]
