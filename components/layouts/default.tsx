import MainLayout from './main'
import PrimaryLayout from './primary'

const setLayout = (content: any, type?: string) => {
  content.getLayout = function getLayout(page: any) {
    switch (type) {
      case 'MainLayout':
        return <MainLayout>{page}</MainLayout>
      case 'PrimaryLayout':
        return <PrimaryLayout>{page}</PrimaryLayout>
      default:
        return <MainLayout>{page}</MainLayout>
    }
  }
}
export default setLayout
