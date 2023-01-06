import { Headers } from '../molecules'
const MainLayout = ({ children }: any) => {
  return (
    <div>
      <Headers />
      <main>{children}</main>
      <h1>Footer</h1>
    </div>
  )
}
export default MainLayout
