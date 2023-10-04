import { InformationSection } from 'components/organisms'
import { InferGetServerSidePropsType } from 'next'

const UpdateLeadsFormCM = ({
  message,
  isValid,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!isValid) {
    return <div className="blank"></div>
  }

  return (
    <div>
      <InformationSection />
    </div>
  )
}

export default UpdateLeadsFormCM

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
