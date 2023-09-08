import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconSeat: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.4341 13.5075C27.848 11.45 26.1025 10.3062 23.6785 9.73631C22.2456 9.40006 20.7887 9.30505 19.581 9.33756C19.4659 9.34131 19.4659 9.34131 19.4304 9.34256C18.2064 9.30506 16.7495 9.40006 15.3181 9.73632C12.8928 10.3051 11.1474 11.4501 10.5829 13.4227L8.87414 21.3138C8.67794 22.2251 8.6425 23.1576 8.77541 24.0676C9.33362 27.9175 10.7259 30.6663 13.7866 30.6663C13.9588 30.6663 14.1297 30.6338 14.2892 30.5713C14.3474 30.5475 14.4778 30.5 14.6727 30.435C15.0081 30.325 15.3917 30.2125 15.8119 30.1075C17.0131 29.8088 18.2662 29.63 19.4978 29.63C20.7294 29.63 21.9838 29.8088 23.1837 30.1075C23.6052 30.2125 23.9875 30.325 24.3229 30.435C24.5178 30.5 24.6482 30.5475 24.7064 30.5713C24.8659 30.6338 25.0368 30.6663 25.2089 30.6663C28.2696 30.6663 29.6619 27.9175 30.2202 24.0676C30.3531 23.1576 30.3176 22.2251 30.1214 21.3138L28.4341 13.5075ZM27.548 23.6885C27.1961 26.1148 26.4012 27.7874 25.4038 27.981C25.0203 27.846 24.4912 27.6835 23.8431 27.5222C22.4419 27.1735 20.9736 26.9635 19.4978 26.9635C18.0231 26.9635 16.5549 27.1735 15.1524 27.5222C14.5044 27.6835 13.9753 27.846 13.5917 27.981C12.5943 27.7872 11.7994 26.1148 11.4475 23.6885C11.3614 23.0923 11.3842 22.476 11.5159 21.8698L13.2031 14.0635C13.4171 13.3235 14.3689 12.6997 15.9423 12.331C16.5992 12.176 17.3131 12.0797 18.0434 12.0322C18.5485 11.9997 18.994 11.9935 19.3421 12.0035C19.4244 12.006 19.4244 12.006 19.4307 12.006C19.5712 12.006 19.5712 12.006 19.6535 12.0035C20.0016 11.9935 20.4471 11.9997 20.9522 12.0322C21.6825 12.0797 22.3977 12.1772 23.0546 12.331C24.6267 12.6997 25.5786 13.3235 25.8153 14.1472L27.4797 21.8697C27.6114 22.4772 27.6341 23.0923 27.548 23.6885Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.819 9.33379H13.8689C14.0182 9.33379 14.1195 9.45879 14.098 9.58379L14.8903 6.66631H24.0748L24.5331 9.37631L24.5888 9.58255C24.5685 9.45881 24.6684 9.33379 24.819 9.33379ZM26.6734 5.8375L26.6076 5.59375C26.2481 4.6375 25.3266 4 24.295 4H14.7055C13.6751 4 12.7549 4.63625 12.3942 5.59001L11.517 8.81366C10.9563 10.2912 12.1436 11.9999 13.8688 11.9999H24.819C26.4936 11.9999 27.6594 10.3899 27.1797 8.83616L26.6734 5.8375Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.8431 27.5222C22.4419 27.1735 20.9738 26.9637 19.4993 26.9637C18.0234 26.9637 16.5549 27.1735 15.1524 27.5222C14.5081 27.6822 13.9805 27.8449 13.5982 27.9787C12.7919 27.8749 12.0743 28.4949 12.0743 29.3012V34.6662C12.0743 35.4025 12.678 36 13.4249 36H25.5763C26.3218 36 26.9256 35.4025 26.9256 34.6662V29.3012C26.9256 28.4937 26.2066 27.8737 25.3991 27.9799C25.0168 27.8449 24.4887 27.6822 23.8431 27.5222ZM24.2256 33.3336H14.774V30.4023C15.0854 30.3023 15.4321 30.2013 15.8119 30.1075C17.0118 29.8088 18.2663 29.6311 19.4992 29.6311C20.7308 29.6311 21.9838 29.8088 23.1837 30.1075C23.5647 30.2013 23.9142 30.3036 24.2255 30.4036L24.2256 33.3336Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.2686 26.11C26.9737 26.7425 26.6345 27.1937 26.2788 27.4387L26.0889 27.5962C25.8636 27.8237 25.6358 27.945 25.3813 27.9812C24.7181 28.0762 24.2257 28.6387 24.2257 29.3012V34.6663C24.2257 35.4026 24.8307 36 25.5763 36C28.5989 36 30.7165 34.7976 31.9481 32.8126C32.6798 31.6351 32.9582 30.4726 33 29.6314C33.0025 27.7014 32.1038 26.4163 30.6773 25.7965C30.0621 25.529 29.4546 25.4178 28.9179 25.4003C28.2786 25.1915 27.561 25.4813 27.2686 26.11ZM29.5888 28.2362C30.0609 28.4412 30.3014 28.7863 30.3014 29.5662C30.2989 29.5837 30.2735 29.7825 30.2077 30.0549C30.0951 30.5237 29.9115 30.9912 29.6457 31.4199C29.0787 32.3349 28.2179 32.9649 26.9269 33.2137V30.2599C27.2889 30.0799 27.623 29.8412 27.9268 29.5525C28.4331 29.1812 28.8647 28.6987 29.2331 28.1212C29.352 28.1487 29.4736 28.1862 29.5888 28.2362Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.32396 25.7961C6.89745 26.4161 6 27.7011 6 29.566C6.04304 30.4722 6.32151 31.6335 7.05186 32.8124C8.28346 34.7973 10.4022 36 13.4249 36C14.1704 36 14.7756 35.4023 14.7756 34.6661V29.3023C14.7756 28.6398 14.2832 28.0773 13.6187 27.9823C13.3579 27.9448 13.1263 27.8198 12.8947 27.5848L12.7124 27.4298C12.3593 27.1798 12.0226 26.731 11.734 26.1098C11.4416 25.4811 10.7226 25.191 10.0847 25.3985C9.54672 25.4173 8.93911 25.5273 8.32396 25.7961ZM11.0428 29.5273C11.3555 29.8298 11.701 30.0773 12.0757 30.2623V33.2135C10.7833 32.9648 9.92263 32.3348 9.35557 31.4198C9.08976 30.991 8.90622 30.5235 8.79356 30.056C8.72774 29.7823 8.70242 29.5835 8.69862 29.501C8.69989 28.786 8.94165 28.441 9.41251 28.236C9.52769 28.186 9.64921 28.1485 9.7682 28.121C10.129 28.6848 10.5517 29.1585 11.0428 29.5273Z"
        fill={color}
      />
    </svg>
  )
}