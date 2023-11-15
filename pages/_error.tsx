import { InternalServerErrorPageContent } from 'components/organisms'
import { NextPageContext } from 'next'

interface Props {
  statusCode?: number
}

function Error({ statusCode }: Props) {
  return statusCode === 404 ? <>404</> : <InternalServerErrorPageContent />
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
