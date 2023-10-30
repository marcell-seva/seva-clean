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
import { IconLockFill } from './LockFill'
import { IconThumbsUp } from './ThumbsUp'

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

const IconBookInformation: React.FC<PropsIcon> = ({
  width,
  height,
}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M4 4V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H15.5C15.6326 18 15.7598 17.9473 15.8536 17.8536C15.9473 17.7598 16 17.6326 16 17.5C16 17.3674 15.9473 17.2402 15.8536 17.1464C15.7598 17.0527 15.6326 17 15.5 17H6C5.73478 17 5.48043 16.8946 5.29289 16.7071C5.10536 16.5196 5 16.2652 5 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4ZM14 3C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V15H5V4C5 3.73478 5.10536 3.48043 5.29289 3.29289C5.48043 3.10536 5.73478 3 6 3H14ZM10.75 5.75C10.75 5.55109 10.671 5.36032 10.5303 5.21967C10.3897 5.07902 10.1989 5 10 5C9.80109 5 9.61032 5.07902 9.46967 5.21967C9.32902 5.36032 9.25 5.55109 9.25 5.75C9.25 5.94891 9.32902 6.13968 9.46967 6.28033C9.61032 6.42098 9.80109 6.5 10 6.5C10.1989 6.5 10.3897 6.42098 10.5303 6.28033C10.671 6.13968 10.75 5.94891 10.75 5.75ZM10.5 12.5C10.5 12.6326 10.4473 12.7598 10.3536 12.8536C10.2598 12.9473 10.1326 13 10 13C9.86739 13 9.74021 12.9473 9.64645 12.8536C9.55268 12.7598 9.5 12.6326 9.5 12.5V8.5C9.5 8.36739 9.55268 8.24021 9.64645 8.14645C9.74021 8.05268 9.86739 8 10 8C10.1326 8 10.2598 8.05268 10.3536 8.14645C10.4473 8.24021 10.5 8.36739 10.5 8.5V12.5Z"
        fill="#B4231E"
        stroke="#B4231E"
        stroke-width="0.5"
      />
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

const IconColor: React.FC<PropsIcon> = ({
  width,
  height,
  color,
}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_304_23543)">
        <path
          d="M8 0C8.73438 0 9.44271 0.09375 10.125 0.28125C10.8073 0.46875 11.4453 0.736979 12.0391 1.08594C12.6328 1.4349 13.1719 1.85156 13.6562 2.33594C14.1406 2.82031 14.5573 3.36198 14.9062 3.96094C15.2552 4.5599 15.5234 5.19792 15.7109 5.875C15.8984 6.55208 15.9948 7.26042 16 8C16 8.73438 15.9062 9.44271 15.7188 10.125C15.5312 10.8073 15.263 11.4453 14.9141 12.0391C14.5651 12.6328 14.1484 13.1719 13.6641 13.6562C13.1797 14.1406 12.638 14.5573 12.0391 14.9062C11.4401 15.2552 10.8021 15.5234 10.125 15.7109C9.44792 15.8984 8.73958 15.9948 8 16C7.72396 16 7.46615 15.9479 7.22656 15.8438C6.98698 15.7396 6.77604 15.5964 6.59375 15.4141C6.41146 15.2318 6.26823 15.0208 6.16406 14.7812C6.0599 14.5417 6.00521 14.2812 6 14C6 13.7448 6.02344 13.5234 6.07031 13.3359C6.11719 13.1484 6.17969 12.974 6.25781 12.8125C6.33594 12.651 6.41667 12.5052 6.5 12.375C6.58333 12.2448 6.66406 12.1094 6.74219 11.9688C6.82031 11.8281 6.88021 11.6823 6.92188 11.5312C6.96354 11.3802 6.98958 11.2031 7 11C7 10.7292 6.94792 10.4714 6.84375 10.2266C6.73958 9.98177 6.59635 9.77083 6.41406 9.59375C6.23177 9.41667 6.01823 9.27344 5.77344 9.16406C5.52865 9.05469 5.27083 9 5 9C4.80208 9 4.6276 9.02344 4.47656 9.07031C4.32552 9.11719 4.17969 9.17969 4.03906 9.25781C3.89844 9.33594 3.76042 9.41667 3.625 9.5C3.48958 9.58333 3.34375 9.66406 3.1875 9.74219C3.03125 9.82031 2.85677 9.88021 2.66406 9.92188C2.47135 9.96354 2.25 9.98958 2 10C1.72396 10 1.46615 9.94792 1.22656 9.84375C0.986979 9.73958 0.776042 9.59635 0.59375 9.41406C0.411458 9.23177 0.268229 9.02083 0.164062 8.78125C0.0598958 8.54167 0.00520833 8.28125 0 8C0 7.26562 0.09375 6.55729 0.28125 5.875C0.46875 5.19271 0.736979 4.55469 1.08594 3.96094C1.4349 3.36719 1.85156 2.82812 2.33594 2.34375C2.82031 1.85938 3.36198 1.44271 3.96094 1.09375C4.5599 0.744792 5.19531 0.476562 5.86719 0.289062C6.53906 0.101562 7.25 0.00520833 8 0ZM8 15C8.64062 15 9.25781 14.9167 9.85156 14.75C10.4453 14.5833 11.0026 14.349 11.5234 14.0469C12.0443 13.7448 12.5182 13.3776 12.9453 12.9453C13.3724 12.513 13.737 12.0417 14.0391 11.5312C14.3411 11.0208 14.5781 10.4635 14.75 9.85938C14.9219 9.25521 15.0052 8.63542 15 8C15 7.35938 14.9167 6.74219 14.75 6.14844C14.5833 5.55469 14.349 4.9974 14.0469 4.47656C13.7448 3.95573 13.3776 3.48177 12.9453 3.05469C12.513 2.6276 12.0417 2.26302 11.5312 1.96094C11.0208 1.65885 10.4635 1.42188 9.85938 1.25C9.25521 1.07812 8.63542 0.994792 8 1C7.35938 1 6.74219 1.08333 6.14844 1.25C5.55469 1.41667 4.9974 1.65104 4.47656 1.95312C3.95573 2.25521 3.48177 2.6224 3.05469 3.05469C2.6276 3.48698 2.26302 3.95833 1.96094 4.46875C1.65885 4.97917 1.42188 5.53646 1.25 6.14062C1.07812 6.74479 0.994792 7.36458 1 8C1 8.14062 1.02604 8.27083 1.07812 8.39062C1.13021 8.51042 1.20052 8.61458 1.28906 8.70312C1.3776 8.79167 1.48438 8.86458 1.60938 8.92188C1.73438 8.97917 1.86458 9.00521 2 9C2.19792 9 2.3724 8.97656 2.52344 8.92969C2.67448 8.88281 2.82031 8.82031 2.96094 8.74219C3.10156 8.66406 3.23698 8.58333 3.36719 8.5C3.4974 8.41667 3.64062 8.33594 3.79688 8.25781C3.95312 8.17969 4.1276 8.11979 4.32031 8.07812C4.51302 8.03646 4.73958 8.01042 5 8C5.41667 8 5.80729 8.07812 6.17188 8.23438C6.53646 8.39062 6.85417 8.60417 7.125 8.875C7.39583 9.14583 7.60938 9.46354 7.76562 9.82812C7.92188 10.1927 8 10.5833 8 11C8 11.2552 7.97656 11.4792 7.92969 11.6719C7.88281 11.8646 7.82031 12.0391 7.74219 12.1953C7.66406 12.3516 7.58333 12.4948 7.5 12.625C7.41667 12.7552 7.33594 12.8906 7.25781 13.0312C7.17969 13.1719 7.11979 13.3177 7.07812 13.4688C7.03646 13.6198 7.01042 13.7969 7 14C7 14.1406 7.02604 14.2708 7.07812 14.3906C7.13021 14.5104 7.20052 14.6146 7.28906 14.7031C7.3776 14.7917 7.48438 14.8646 7.60938 14.9219C7.73438 14.9792 7.86458 15.0052 8 15ZM4 5C4.14062 5 4.27083 5.02604 4.39062 5.07812C4.51042 5.13021 4.61458 5.20052 4.70312 5.28906C4.79167 5.3776 4.86458 5.48438 4.92188 5.60938C4.97917 5.73438 5.00521 5.86458 5 6C5 6.14062 4.97396 6.27083 4.92188 6.39062C4.86979 6.51042 4.79948 6.61458 4.71094 6.70312C4.6224 6.79167 4.51562 6.86458 4.39062 6.92188C4.26562 6.97917 4.13542 7.00521 4 7C3.85938 7 3.72917 6.97396 3.60938 6.92188C3.48958 6.86979 3.38542 6.79948 3.29688 6.71094C3.20833 6.6224 3.13542 6.51562 3.07812 6.39062C3.02083 6.26562 2.99479 6.13542 3 6C3 5.85938 3.02604 5.72917 3.07812 5.60938C3.13021 5.48958 3.20052 5.38542 3.28906 5.29688C3.3776 5.20833 3.48438 5.13542 3.60938 5.07812C3.73438 5.02083 3.86458 4.99479 4 5ZM7 3C7.14062 3 7.27083 3.02604 7.39062 3.07812C7.51042 3.13021 7.61458 3.20052 7.70312 3.28906C7.79167 3.3776 7.86458 3.48438 7.92188 3.60938C7.97917 3.73438 8.00521 3.86458 8 4C8 4.14062 7.97396 4.27083 7.92188 4.39062C7.86979 4.51042 7.79948 4.61458 7.71094 4.70312C7.6224 4.79167 7.51562 4.86458 7.39062 4.92188C7.26562 4.97917 7.13542 5.00521 7 5C6.85938 5 6.72917 4.97396 6.60938 4.92188C6.48958 4.86979 6.38542 4.79948 6.29688 4.71094C6.20833 4.6224 6.13542 4.51562 6.07812 4.39062C6.02083 4.26562 5.99479 4.13542 6 4C6 3.85938 6.02604 3.72917 6.07812 3.60938C6.13021 3.48958 6.20052 3.38542 6.28906 3.29688C6.3776 3.20833 6.48438 3.13542 6.60938 3.07812C6.73438 3.02083 6.86458 2.99479 7 3ZM11 6C10.8594 6 10.7292 5.97396 10.6094 5.92188C10.4896 5.86979 10.3854 5.79948 10.2969 5.71094C10.2083 5.6224 10.1354 5.51562 10.0781 5.39062C10.0208 5.26562 9.99479 5.13542 10 5C10 4.85938 10.026 4.72917 10.0781 4.60938C10.1302 4.48958 10.2005 4.38542 10.2891 4.29688C10.3776 4.20833 10.4844 4.13542 10.6094 4.07812C10.7344 4.02083 10.8646 3.99479 11 4C11.1406 4 11.2708 4.02604 11.3906 4.07812C11.5104 4.13021 11.6146 4.20052 11.7031 4.28906C11.7917 4.3776 11.8646 4.48438 11.9219 4.60938C11.9792 4.73438 12.0052 4.86458 12 5C12 5.14062 11.974 5.27083 11.9219 5.39062C11.8698 5.51042 11.7995 5.61458 11.7109 5.70312C11.6224 5.79167 11.5156 5.86458 11.3906 5.92188C11.2656 5.97917 11.1354 6.00521 11 6ZM12 8C12.1406 8 12.2708 8.02604 12.3906 8.07812C12.5104 8.13021 12.6146 8.20052 12.7031 8.28906C12.7917 8.3776 12.8646 8.48438 12.9219 8.60938C12.9792 8.73438 13.0052 8.86458 13 9C13 9.14062 12.974 9.27083 12.9219 9.39062C12.8698 9.51042 12.7995 9.61458 12.7109 9.70312C12.6224 9.79167 12.5156 9.86458 12.3906 9.92188C12.2656 9.97917 12.1354 10.0052 12 10C11.8594 10 11.7292 9.97396 11.6094 9.92188C11.4896 9.86979 11.3854 9.79948 11.2969 9.71094C11.2083 9.6224 11.1354 9.51562 11.0781 9.39062C11.0208 9.26562 10.9948 9.13542 11 9C11 8.85938 11.026 8.72917 11.0781 8.60938C11.1302 8.48958 11.2005 8.38542 11.2891 8.29688C11.3776 8.20833 11.4844 8.13542 11.6094 8.07812C11.7344 8.02083 11.8646 7.99479 12 8ZM10 11C10.1406 11 10.2708 11.026 10.3906 11.0781C10.5104 11.1302 10.6146 11.2005 10.7031 11.2891C10.7917 11.3776 10.8646 11.4844 10.9219 11.6094C10.9792 11.7344 11.0052 11.8646 11 12C11 12.1406 10.974 12.2708 10.9219 12.3906C10.8698 12.5104 10.7995 12.6146 10.7109 12.7031C10.6224 12.7917 10.5156 12.8646 10.3906 12.9219C10.2656 12.9792 10.1354 13.0052 10 13C9.85938 13 9.72917 12.974 9.60938 12.9219C9.48958 12.8698 9.38542 12.7995 9.29688 12.7109C9.20833 12.6224 9.13542 12.5156 9.07812 12.3906C9.02083 12.2656 8.99479 12.1354 9 12C9 11.8594 9.02604 11.7292 9.07812 11.6094C9.13021 11.4896 9.20052 11.3854 9.28906 11.2969C9.3776 11.2083 9.48438 11.1354 9.60938 11.0781C9.73438 11.0208 9.86458 10.9948 10 11Z"
          fill="#878D98"
        />
      </g>
      <defs>
        <clipPath id="clip0_304_23543">
          <rect width={width} height={height} fill={color} />
        </clipPath>
      </defs>
    </svg>
  )
}
const IconNumberField: React.FC<PropsIcon> = ({
  width,
  height,
  color,
}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8 10H5V9.41406C5 9.21615 5.03646 9.02604 5.10938 8.84375C5.16667 8.69792 5.2526 8.55729 5.36719 8.42188C5.48177 8.28646 5.61198 8.14844 5.75781 8.00781C5.90365 7.86719 6.04688 7.73698 6.1875 7.61719C6.32812 7.4974 6.46094 7.36979 6.58594 7.23438C6.71094 7.09896 6.8099 6.97656 6.88281 6.86719C6.95573 6.75781 6.99479 6.63542 7 6.5C7 6.36458 6.95052 6.2474 6.85156 6.14844C6.7526 6.04948 6.63542 6 6.5 6C6.38021 6 6.27604 6.03646 6.1875 6.10938C6.09896 6.18229 6.03906 6.27865 6.00781 6.39844L5.03125 6.19531C5.0625 6.02344 5.1224 5.86458 5.21094 5.71875C5.29948 5.57292 5.41406 5.44792 5.55469 5.34375C5.69531 5.23958 5.84375 5.15625 6 5.09375C6.15625 5.03125 6.32292 5 6.5 5C6.70833 5 6.90365 5.03906 7.08594 5.11719C7.26823 5.19531 7.42708 5.30208 7.5625 5.4375C7.69792 5.57292 7.80469 5.73177 7.88281 5.91406C7.96094 6.09635 8 6.29167 8 6.5C8 6.70312 7.97135 6.88542 7.91406 7.04688C7.85677 7.20833 7.77604 7.35938 7.67188 7.5C7.56771 7.64062 7.45312 7.77344 7.32812 7.89844C7.20312 8.02344 7.07031 8.14323 6.92969 8.25781C6.78906 8.3724 6.65625 8.49219 6.53125 8.61719C6.40625 8.74219 6.28385 8.86979 6.16406 9H8V10ZM16 2V13H0V2H16ZM15 3H1V12H15V3ZM3.10156 6.14844C2.95052 6.23698 2.77344 6.31771 2.57031 6.39062C2.36719 6.46354 2.17708 6.5 2 6.5V5.5C2.05729 5.5 2.13802 5.48438 2.24219 5.45312C2.34635 5.42188 2.45052 5.38281 2.55469 5.33594C2.65885 5.28906 2.7526 5.23438 2.83594 5.17188C2.91927 5.10938 2.97656 5.05208 3.00781 5H4V10H3.10156V6.14844ZM10.3125 10C10.0938 10 9.88281 9.96354 9.67969 9.89062C9.47656 9.81771 9.28125 9.72135 9.09375 9.60156V8.60938C9.19792 8.6875 9.28906 8.75521 9.36719 8.8125C9.44531 8.86979 9.52865 8.91667 9.61719 8.95312C9.70573 8.98958 9.79427 9.01562 9.88281 9.03125C9.97135 9.04688 10.0885 9.05469 10.2344 9.05469C10.349 9.05469 10.4583 9.04427 10.5625 9.02344C10.6667 9.0026 10.7578 8.96354 10.8359 8.90625C10.9141 8.84896 10.9792 8.77604 11.0312 8.6875C11.0833 8.59896 11.1068 8.48958 11.1016 8.35938C11.1016 8.19792 11.0391 8.08333 10.9141 8.01562C10.7891 7.94792 10.6432 7.90104 10.4766 7.875C10.3099 7.84896 10.1406 7.84115 9.96875 7.85156C9.79688 7.86198 9.65885 7.86719 9.55469 7.86719V7.10938H10.0078C10.1693 7.10938 10.3203 7.09115 10.4609 7.05469C10.6016 7.01823 10.7188 6.95052 10.8125 6.85156C10.9062 6.7526 10.9531 6.60417 10.9531 6.40625C10.9531 6.1875 10.888 6.04167 10.7578 5.96875C10.6276 5.89583 10.4609 5.85938 10.2578 5.85938C10.0495 5.85938 9.86979 5.90625 9.71875 6C9.56771 6.09375 9.41667 6.20573 9.26562 6.33594V5.32031C9.44271 5.20052 9.64062 5.11719 9.85938 5.07031C10.0781 5.02344 10.2917 5 10.5 5C10.6875 5 10.8698 5.02604 11.0469 5.07812C11.224 5.13021 11.3802 5.20573 11.5156 5.30469C11.651 5.40365 11.763 5.53125 11.8516 5.6875C11.9401 5.84375 11.9818 6.02344 11.9766 6.22656C11.9766 6.47656 11.9271 6.69792 11.8281 6.89062C11.7292 7.08333 11.5677 7.24219 11.3438 7.36719C11.5729 7.44531 11.7604 7.58333 11.9062 7.78125C12.0521 7.97917 12.125 8.20052 12.125 8.44531C12.125 8.6901 12.0729 8.90885 11.9688 9.10156C11.8646 9.29427 11.7292 9.45573 11.5625 9.58594C11.3958 9.71615 11.2005 9.81771 10.9766 9.89062C10.7526 9.96354 10.5312 10 10.3125 10Z"
        fill={color}
      />
    </svg>
  )
}

const IconDocumentSigned: React.FC<PropsIcon> = ({
  width,
  height,
  color,
}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M9.707 15H7.5V12.793L10.017 10.276C10.0058 10.1844 10.0001 10.0923 10 10C9.99965 9.4937 10.153 8.99922 10.4399 8.58199C10.7267 8.16477 11.1335 7.84447 11.6063 7.66348C12.0792 7.48249 12.5958 7.44934 13.088 7.56841C13.5801 7.68749 14.0244 7.95317 14.3622 8.33032C14.7 8.70746 14.9154 9.17829 14.9797 9.68049C15.0441 10.1827 14.9544 10.6926 14.7227 11.1427C14.4909 11.5929 14.1279 11.962 13.6817 12.2014C13.2355 12.4407 12.7272 12.5389 12.224 12.483L9.707 15ZM8.5 14H9.293L11.896 11.397L12.166 11.459C12.4874 11.5355 12.825 11.505 13.1275 11.3721C13.43 11.2393 13.6809 11.0113 13.842 10.7229C14.0032 10.4344 14.0658 10.1013 14.0204 9.77406C13.9749 9.4468 13.8239 9.14332 13.5903 8.90969C13.3567 8.67607 13.0532 8.52508 12.726 8.47964C12.3987 8.43421 12.0656 8.49682 11.7771 8.65797C11.4887 8.81912 11.2607 9.06999 11.1279 9.37249C10.995 9.67499 10.9645 10.0126 11.041 10.334L11.103 10.604L8.5 13.207V14Z"
        fill={color}
      />
      <path
        d="M12.5 10.5C12.7761 10.5 13 10.2761 13 10C13 9.72386 12.7761 9.5 12.5 9.5C12.2239 9.5 12 9.72386 12 10C12 10.2761 12.2239 10.5 12.5 10.5Z"
        fill={color}
      />
      <path
        d="M4 3H10V4H4V3ZM4 5H10V6H4V5ZM4 7H7V8H4V7ZM4 12H6V13H4V12Z"
        fill={color}
      />
      <path
        d="M6 15H3C2.73486 14.9997 2.48066 14.8943 2.29319 14.7068C2.10571 14.5193 2.00026 14.2651 2 14V2C2.00026 1.73486 2.10571 1.48066 2.29319 1.29319C2.48066 1.10571 2.73486 1.00026 3 1H11C11.2651 1.00026 11.5193 1.10571 11.7068 1.29319C11.8943 1.48066 11.9997 1.73486 12 2V6.5H11V2H3V14H6V15Z"
        fill={color}
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
  IconThumbsUp,
  IconBookInformation,
  IconColor,
  IconNumberField,
  IconDocumentSigned,
}
