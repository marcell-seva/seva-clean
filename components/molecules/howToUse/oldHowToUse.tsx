import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'

import { USPAttributes } from 'utils/types/utils'
import { H2MediumBold } from 'utils/typography/H2MediumBold'

const vector6 = '/v3/assets/illustration/vector-6.png'
const vector7 = '/v3/assets/illustration/vector-7.png'

interface HowToUseProps {
  uspData: USPAttributes
}

const apiBanner = 'https://api.sslpots.com'

export const HowToUse = ({ uspData }: HowToUseProps) => {
  return (
    <div className="htu-container">
      <div className="htu-layer-wrapper" />
      <div className="htu-content-wrapper">
        <Title>{uspData.head_title}</Title>
        <div className="htu-step-wrapper">
          <div className="htu-item-wrapper">
            <div className="htu-image-wrapper">
              <img
                src={apiBanner + uspData.icon_1.data.attributes.url}
                alt={uspData.icon_1.data.attributes.formats.thumbnail.name}
              />
            </div>
            <div className="htu-info">
              <div className="htu-item-title">{uspData.title_1}</div>
              <div className="htu-item-desc">{uspData.subtitle_1}</div>
            </div>
          </div>
          <div className="htu-item-wrapper">
            <div className="htu-image-wrapper">
              <img
                src={apiBanner + uspData.icon_2.data.attributes.url}
                alt={uspData.icon_2.data.attributes.formats.thumbnail.name}
              />
            </div>
            <div className="htu-info">
              <div className="htu-item-title">{uspData.title_2}</div>
              <div className="htu-item-desc">{uspData.subtitle_2}</div>
            </div>
          </div>
          <div className="htu-item-wrapper">
            <div className="htu-image-wrapper">
              <img
                src={apiBanner + uspData.icon_3.data.attributes.url}
                alt={uspData.icon_3.data.attributes.formats.thumbnail.name}
              />
            </div>
            <div className="htu-info">
              <div className="htu-item-title">{uspData.title_3}</div>
              <div className="htu-item-desc">{uspData.subtitle_3}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="htu-vector-6">
        <img
          src={vector6}
          alt="seva-vector-banner-1"
          width="136"
          height="140"
        />
      </div>
      <div className="htu-vector-7">
        <img src={vector7} alt="seva-vector-banner-2" width="125" height="86" />
      </div>
    </div>
  )
}

const Title = styled(H2MediumBold)`
  color: ${colors.primaryDarkBlue};
  line-height: 20px;
  margin-bottom: 36px;

  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 20px;
    color: ${colors.greyscale};
    margin-bottom: 15px;
    letter-spacing: 0;
  }
`
