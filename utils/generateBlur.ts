import { getPlaiceholder } from 'plaiceholder'
import { CarRecommendation, CarRecommendationResponse } from 'utils/types/utils'

export const generateBlurRecommendations = async (
  recommendations: CarRecommendation[],
) => {
  try {
    const gen = Promise.all(
      recommendations.map(async (item) => {
        const buffer = await fetch(item.images[0]).then(async (res) =>
          Buffer.from(await res.arrayBuffer()),
        )
        const { base64 } = await getPlaiceholder(buffer)

        return { ...item, base64 }
      }),
    )

    return gen
  } catch {
    console.error('error generate image')
    return recommendations
  }
}
