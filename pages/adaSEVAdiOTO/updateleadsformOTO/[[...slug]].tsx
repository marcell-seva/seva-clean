import Seo from 'components/atoms/seo'
import { InformationSection } from 'components/organisms'
import { InferGetServerSidePropsType } from 'next'
import { defaultSeoImage } from 'utils/helpers/const'

const UpdateLeadsFormOTO = ({
  message,
  isValid,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!isValid) {
    return <div className="blank"></div>
  }
  return (
    <div>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <InformationSection />
    </div>
  )
}

export default UpdateLeadsFormOTO

export async function getServerSideProps(context: any) {
  const detailId = context.query.slug[0]
  const TokenStatic = context.query.slug[1]
  let valid = true

  // TODO: Check Token
  if (TokenStatic !== 'SEv4Uh4Y') {
    valid = false
  }
  // TODO: getDetail ID

  try {
    return {
      props: {
        message: 'hello',
        isValid: valid,
      },
    }
  } catch (error) {
    throw error
  }
}
