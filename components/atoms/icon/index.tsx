import { IconAccount } from './Account'
import { IconAdd } from './Add'
import { IconAgeRange } from './AgeRange'
import { IconApplication } from './Application'
import { IconBank } from './Bank'
import { IconBrand } from './Brand'
import { IconCSA } from './CSA'
import { IconCalculator } from './Calculator'
import { IconCalendar } from './Calendar'
import { IconCamera } from './Camera'
import { IconCameraFlip } from './CameraFlip'
import { IconCar } from './Car'
import { IconCar2 } from './Car2'
import { IconChecked } from './Checked'
import { IconChecklist } from './Checklist'
import { IconChevronDown } from './ChevronDown'
import { IconChevronLeft } from './ChevronLeft'
import { IconChevronRight } from './ChevronRight'
import { IconChevronUp } from './ChevronUp'
import { IconClose } from './Close'
import { IconCompare } from './Compare'
import { IconDimension } from './Dimension'
import { IconDownPayment } from './DownPayment'
import { IconDownload } from './Download'
import { IconEdit } from './Edit'
import { IconEngine } from './Engine'
import { IconExit } from './Exit'
import { IconExpand } from './Expand'
import { IconFacebook } from './Facebook'
import { IconFast } from './Fast'
import { IconFilter } from './Filter'
import { IconFuel } from './Fuel'
import { IconFuelTank } from './FuelTank'
import { IconGalerry } from './Galerry'
import { IconGrid } from './Grid'
import { IconHamburger } from './Hamburger'
import { IconHatchback } from './Hatchback'
import { IconHistory } from './History'
import { Icon360 } from './Icon360'
import { IconImageRotate } from './ImageRotate'
import { IconIncome } from './Income'
import { IconInfo } from './Info'
import { IconInstagram } from './Instagram'
import { IconJob } from './Job'
import { IconLink } from './Link'
import { IconList } from './List'
import { IconLocationLine } from './Location_Line'
import { IconMPV } from './MPV'
import { IconMoney } from './Money'
import { IconPlay } from './Play'
import { IconPlus } from './Plus'
import { IconPromo } from './Promo'
import { IconQuestion } from './Question'
import { IconRemove } from './Remove'
import { RotateLeft } from './RotateLeft'
import { RotateRight } from './RotateRight'
import { IconSUV } from './SUV'
import { IconSearch } from './Search'
import { IconSeat } from './Seat'
import { IconSecure } from './Secure'
import { IconSedan } from './Sedan'
import { IconShare } from './Share'
import { IconSpeed } from './Speed'
import { IconSport } from './Sport'
import { IconStrawberry } from './Strawberry'
import { IconTenure } from './Tenure'
import { IconThreeSixty } from './ThreeSixty'
import { IconTime } from './Time'
import { IconTorque } from './Torque'
import { IconTransmission } from './Transmission'
import { IconTrash } from './Trash'
import { IconTwitter } from './Twitter'
import { IconUpload } from './Upload'
import { IconVoucher } from './Voucher'
import { IconWallet } from './Wallet'
import { IconWarning } from './Warning'
import { IconWarningCircle } from './WarningCircle'
import { IconWhatsapp } from './Whatsapp'
import { IconToggleGridActive } from './ToggleGridActive'
import { IconToggleGridInactive } from './ToggleGridInactive'
import { IconToggleListInactive } from './ToggleListInactive'
import { IconToggleListActive } from './ToggleListActive'
import { IconTwitterOutlined } from './TwitterOutlined'
import { IconWishlist } from './Wishlist'
import { IconLoading } from './Loading'
import { IconCheckedBox } from './CheckedBox'
import { PropsIcon } from 'utils/types'
import { BackIcon } from './BackIcon'
import { DownOutlined } from './DownOutlined'
import { CloseOutlined2 } from './CloseOutlined2'
import { InfoCircleOutlined } from './InfoCircleOutlined'
import { Contact } from './Contact'
import { IconSquareCheckBox } from './SquareCheckBox'
import { IconSquareCheckedBox } from './SquareCheckedBox'
import { IconYoutubeOutlined } from './YoutubeOutlined'
import { IconLinkedinOutlined } from './LinkedinOutlined'

// const IconChevronUp: React.FC<PropsIcon> = ({
//   width,
//   height,
//   color = '#9EA3AC',
// }): JSX.Element => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 512 512"
//       width={width}
//       height={height}
//     >
//       <path
//         fill={color}
//         d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
//       />
//     </svg>
//   )
// }

// const IconChevronDown: React.FC<PropsIcon> = ({
//   width,
//   height,
//   color = '#9EA3AC',
// }): JSX.Element => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 512 512"
//       width={width}
//       height={height}
//     >
//       <path
//         fill={color}
//         d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
//       />
//     </svg>
//   )
// }

const IconTriangleDown: React.FC<PropsIcon> = ({
  width,
  height,
}): JSX.Element => {
  return (
    <svg
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
    >
      <path d="M8 0H0L4 4L8 0Z" fill="#031838" />
    </svg>
  )
}
// const IconSearch: React.FC<PropsIcon> = ({
//   width,
//   height,
//   color = '#9EA3AC',
// }): JSX.Element => {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       width={width}
//       height={height}
//     >
//       <path
//         d="M11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20Z"
//         stroke={color}
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M22 22L18 18"
//         stroke={color}
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   )
// }

const IconDots: React.FC<PropsIcon> = ({ width, height }): JSX.Element => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
    >
      <circle cx="10" cy="10" r="10" fill="#E4E9F1" />
      <circle cx="10" cy="10" r="1" fill="#9EA3AC" />
      <circle cx="14" cy="10" r="1" fill="#9EA3AC" />
      <circle cx="6" cy="10" r="1" fill="#9EA3AC" />
    </svg>
  )
}

const IconCross: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#9EA3AC',
}): JSX.Element => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
    >
      <path
        d="M6 6.00003L18.7742 18.7742"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 18.7742L18.7742 6.00001"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const IconLocation: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#002373',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.9996 7.99978C15.9996 10.9986 11.9457 14.7896 9.89115 16.5184C9.21266 17.0893 8.24099 17.0893 7.56251 16.5184C5.50799 14.7896 1.4541 10.9986 1.4541 7.99978C1.4541 3.98316 4.71021 0.727051 8.72683 0.727051C12.7434 0.727051 15.9996 3.98316 15.9996 7.99978Z"
        stroke={color}
        strokeWidth="2"
      />
      <circle
        cx="8.72772"
        cy="8.00018"
        r="2.18182"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  )
}

const IconNextButton: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_3041_13040)">
        <rect
          x="64"
          y="63"
          width="48"
          height="48"
          rx="8"
          transform="rotate(-180 64 63)"
          fill="white"
        />
      </g>
      <path
        d="M37 32L43.9632 38.9632L37 45.9263"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_3041_13040"
          x="0"
          y="0"
          width="80"
          height="80"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0101215 0 0 0 0 0.0939085 0 0 0 0 0.220833 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3041_13040"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3041_13040"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

const IconBackButton: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2938_15888)">
        <rect x="16" y="15" width="48" height="48" rx="8" fill="white" />
      </g>
      <path
        d="M43 46L36.0368 39.0368L43 32.0737"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_2938_15888"
          x="0"
          y="0"
          width="80"
          height="80"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0101215 0 0 0 0 0.0939085 0 0 0 0 0.220833 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2938_15888"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2938_15888"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

const IconStar: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#FFC107',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.9374 9.20627C23.7803 8.7203 23.3493 8.37514 22.8393 8.32918L15.9123 7.70019L13.1731 1.28896C12.9712 0.8191 12.5112 0.514954 12.0001 0.514954C11.4891 0.514954 11.0291 0.8191 10.8271 1.29006L8.08797 7.70019L1.15982 8.32918C0.65077 8.37624 0.220828 8.7203 0.0628038 9.20627C-0.0952203 9.69225 0.0507185 10.2253 0.435799 10.5613L5.67183 15.1533L4.12785 21.9546C4.01487 22.4547 4.20897 22.9716 4.6239 23.2715C4.84692 23.4326 5.10786 23.5147 5.37098 23.5147C5.59786 23.5147 5.8229 23.4535 6.02487 23.3327L12.0001 19.7615L17.9732 23.3327C18.4103 23.5956 18.9612 23.5716 19.3753 23.2715C19.7904 22.9707 19.9843 22.4536 19.8713 21.9546L18.3273 15.1533L23.5633 10.5622C23.9484 10.2253 24.0955 9.69316 23.9374 9.20627Z"
        fill={color}
      />
    </svg>
  )
}

const IconUser: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#52627A',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.9595 16.6426C17.499 15.5517 16.8306 14.5608 15.9918 13.7251C15.1554 12.887 14.1647 12.2188 13.0743 11.7573C13.0645 11.7524 13.0547 11.75 13.045 11.7451C14.566 10.6465 15.5547 8.85693 15.5547 6.83789C15.5547 3.49316 12.8448 0.783203 9.50006 0.783203C6.15533 0.783203 3.44537 3.49316 3.44537 6.83789C3.44537 8.85693 4.43414 10.6465 5.95514 11.7476C5.94537 11.7524 5.93561 11.7549 5.92584 11.7598C4.83209 12.2212 3.85065 12.8828 3.00836 13.7275C2.17025 14.5639 1.50202 15.5546 1.04059 16.645C0.587273 17.7125 0.34279 18.857 0.320374 20.0166C0.319722 20.0427 0.324292 20.0686 0.333816 20.0928C0.343339 20.1171 0.357622 20.1392 0.375824 20.1579C0.394025 20.1765 0.415777 20.1914 0.439798 20.2015C0.463818 20.2116 0.489621 20.2168 0.515686 20.2168H1.98053C2.08795 20.2168 2.1734 20.1313 2.17584 20.0264C2.22467 18.1416 2.98151 16.3765 4.3194 15.0386C5.70367 13.6543 7.54205 12.8926 9.50006 12.8926C11.4581 12.8926 13.2964 13.6543 14.6807 15.0386C16.0186 16.3765 16.7754 18.1416 16.8243 20.0264C16.8267 20.1338 16.9122 20.2168 17.0196 20.2168H18.4844C18.5105 20.2168 18.5363 20.2116 18.5603 20.2015C18.5843 20.1914 18.6061 20.1765 18.6243 20.1579C18.6425 20.1392 18.6568 20.1171 18.6663 20.0928C18.6758 20.0686 18.6804 20.0427 18.6797 20.0166C18.6553 18.8496 18.4136 17.7144 17.9595 16.6426ZM9.50006 11.0371C8.37945 11.0371 7.32477 10.6001 6.53131 9.80664C5.73785 9.01318 5.30084 7.9585 5.30084 6.83789C5.30084 5.71729 5.73785 4.6626 6.53131 3.86914C7.32477 3.07568 8.37945 2.63867 9.50006 2.63867C10.6207 2.63867 11.6754 3.07568 12.4688 3.86914C13.2623 4.6626 13.6993 5.71729 13.6993 6.83789C13.6993 7.9585 13.2623 9.01318 12.4688 9.80664C11.6754 10.6001 10.6207 11.0371 9.50006 11.0371Z"
        fill={color}
      />
    </svg>
  )
}

const IconBurgerMenu: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#52627A',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 6H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 18H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// const IconChevronRight: React.FC<PropsIcon> = ({
//   width,
//   height,
//   color = '#14142B',
// }): JSX.Element => {
//   return (
//     <svg
//       width={width}
//       height={height}
//       viewBox="0 0 9 16"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{ width: width, height: height }}
//     >
//       <path
//         d="M1 1L7.96317 7.96317L1 14.9263"
//         stroke={color}
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   )
// }

// const IconChevronLeft: React.FC<PropsIcon> = ({
//   width,
//   height,
//   color = '#52627A',
// }): JSX.Element => {
//   return (
//     <svg
//       width={width}
//       height={height}
//       fill={color}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 384 512"
//     >
//       <path
//         stroke={color}
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
//       />
//     </svg>
//   )
// }

const IconArrowRight: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#52627A',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.2827 5L20.9998 12L14.2827 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="19.7329"
        y1="12.0317"
        x2="3.99985"
        y2="12.0317"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const IconForwardRight: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#FFFFFF',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M190.06,414,353.18,274.22a24,24,0,0,0,0-36.44L190.06,98c-15.57-13.34-39.62-2.28-39.62,18.22V395.82C150.44,416.32,174.49,427.38,190.06,414Z"
      />
    </svg>
  )
}

const IconLogout: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#52627A',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 15L19 10L14 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 10H7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export {
  IconBackButton,
  IconNextButton,
  IconTriangleDown,
  IconLocation,
  IconStar,
  IconCross,
  IconArrowRight,
  IconForwardRight,
  IconBurgerMenu,
  IconUser,
  IconLogout,
  IconDots,
  IconAccount,
  IconAdd,
  IconAgeRange,
  IconApplication,
  IconBank,
  IconBrand,
  IconCalculator,
  IconCalendar,
  IconCamera,
  IconCameraFlip,
  IconCar,
  IconCar2,
  IconChecked,
  IconChecklist,
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconChevronUp,
  IconClose,
  IconCompare,
  IconCSA,
  IconDimension,
  IconDownload,
  IconDownPayment,
  IconEdit,
  IconEngine,
  IconExit,
  IconExpand,
  IconFacebook,
  IconFast,
  IconFilter,
  IconFuelTank,
  IconFuel,
  IconGalerry,
  IconGrid,
  IconHamburger,
  IconHatchback,
  IconHistory,
  IconImageRotate,
  IconIncome,
  IconInfo,
  IconInstagram,
  IconJob,
  IconLink,
  IconList,
  IconLocationLine,
  IconMoney,
  IconMPV,
  IconPlay,
  IconPlus,
  IconPromo,
  IconQuestion,
  IconRemove,
  IconSearch,
  IconSeat,
  IconSecure,
  IconSedan,
  IconStrawberry,
  IconSpeed,
  IconSport,
  IconSUV,
  IconTenure,
  IconThreeSixty,
  IconTime,
  IconTorque,
  IconTransmission,
  IconTrash,
  IconTwitter,
  IconTwitterOutlined,
  IconUpload,
  IconVoucher,
  IconWallet,
  IconWarning,
  IconWarningCircle,
  IconWhatsapp,
  IconShare,
  RotateLeft,
  RotateRight,
  Icon360,
  IconToggleGridActive,
  IconToggleGridInactive,
  IconToggleListInactive,
  IconToggleListActive,
  IconWishlist,
  IconLoading,
  IconCheckedBox,
  BackIcon,
  DownOutlined,
  CloseOutlined2,
  InfoCircleOutlined,
  Contact,
  IconSquareCheckBox,
  IconSquareCheckedBox,
  IconYoutubeOutlined,
  IconLinkedinOutlined,
}
