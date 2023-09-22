import { GetServerSidePropsContext } from 'next'

export const getIsSsrMobile = (context: GetServerSidePropsContext) => {
  return Boolean(
    context.req.headers['user-agent']?.toLowerCase().includes('mobile'),
  )
}
