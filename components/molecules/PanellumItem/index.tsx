import { Pannellum } from '@georgedrpg/pannellum-react-next'
import '@georgedrpg/pannellum-react-next/es/css/pannellum.css'
import '@georgedrpg/pannellum-react-next/es/css/style-textInfo.css'
import '@georgedrpg/pannellum-react-next/es/css/video-js.css'

interface PanellumItemProps {
  image: string
}

const PanellumItem: React.FC<PanellumItemProps> = ({ image }) => {
  return (
    <Pannellum
      width="100%"
      height="100%"
      image={image}
      pitch={-20}
      yaw={0}
      hfov={110}
      autoLoad
    ></Pannellum>
  )
}

export default PanellumItem
