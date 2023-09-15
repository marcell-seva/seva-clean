import Image from 'next/image'
import { CarButtonProps } from 'utils/types/context'

const IconTypeSuv = '/revamp/illustration/Car_Type_Icons_SUV.png'
const IconTypeSport = '/revamp/illustration/Car_Type_Icons_Sport.png'
const IconTypeSedan = '/revamp/illustration/Car_Type_Icons_Sedan.png'
const IconTypeMpv = '/revamp/illustration/Car_Type_Icons_MPV.png'
const IconTypeMinivan = '/revamp/illustration/Car_Type_Icons_Minivan.png'
const IconTypeHatchback = '/revamp/illustration/Car_Type_Icons_Hatchback.png'
const IconTypeCrossover = '/revamp/illustration/Car_Type_Icons_Crossover.png'

export const newBodyTypes: CarButtonProps[] = [
  {
    key: 'MPV',
    icon: <Image src={IconTypeMpv} alt="MPV" width="50" height="30" />,
    value: 'MPV',
  },
  {
    key: 'Sedan',
    icon: <Image src={IconTypeSedan} alt="SEDAN" width="50" height="30" />,
    value: 'SEDAN',
  },
  {
    key: 'SUV',
    icon: <Image src={IconTypeSuv} alt="SUV" width="50" height="30" />,
    value: 'SUV',
  },
  {
    key: 'Crossover',
    icon: (
      <Image src={IconTypeCrossover} alt="Crossover" width="30" height="30" />
    ),
    value: 'Crossover',
  },
  {
    key: 'Hatchback',
    icon: (
      <Image src={IconTypeHatchback} alt="Hatchback" width="50" height="30" />
    ),
    value: 'HATCHBACK',
  },
  {
    key: 'Minivan',
    icon: <Image src={IconTypeMinivan} alt="Minivan" width="50" height="30" />,
    value: 'Minivan',
  },
  {
    key: 'Sport',
    icon: <Image src={IconTypeSport} alt="Sport" width="50" height="30" />,
    value: 'SPORT',
  },
]
