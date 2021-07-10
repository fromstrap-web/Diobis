import PropTypes from 'prop-types'
import * as CSS from './Links.styled'
import { useRouter } from 'next/router'

const links = [
  { title: 'Front-end Brasil', to: '/frontend' },
  { title: 'Back-end Brasil', to: '/backend' },
  { title: 'DevOps Brasil', to: '/devops' },
  { title: 'React Brasil', to: '/react' },
  { title: 'QA Brasil', to: '/qa' },
]

const Links = ({ noAnimation, visible }) => {
  const router = useRouter()

  return (
    <CSS.Container>
      <CSS.Content noAnimation={noAnimation} visible={visible}>
        <div>
          {links.map((link, index) => (
            <CSS.Button key={index} active={router?.pathname.includes(link.to)}>
              <a href={link.to} children={link.title} />
            </CSS.Button>
          ))}
        </div>
      </CSS.Content>
    </CSS.Container>
  )
}

Links.propTypes = {
  visible: PropTypes.bool,
  allRight: PropTypes.bool,
}

export default Links
