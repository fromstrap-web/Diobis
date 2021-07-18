import Link from 'next/link'
import { useRouter } from 'next/router'
import { Logo } from '../../assets/icons'
import * as CSS from './TheHeader.styled'

// Icons
import MoreRepos from '../../assets/icons/MoreRepos'
import CloseRepos from '../../assets/icons/CloseRepos'
import About from '../../assets/icons/About'
import External from '../../assets/icons/External'

const links = [
  { title: 'Front-end Br', to: '/frontend' },
  { title: 'Back-end Br', to: '/backend' },
  { title: 'DevOps Br', to: '/devops' },
  { title: 'React Br', to: '/react' },
  { title: 'QA Br', to: '/qa' },
]

const TheHeader = ({ openLinks, renderCloseIcon, openCreds }) => {
  const router = useRouter()
  return (
    <CSS.Header>
      <CSS.Container>
        <a href="/frontend">
          <CSS.LogoContainer>
            <Logo />
          </CSS.LogoContainer>
        </a>
        <CSS.Navbar>
          <CSS.Navigator>
            {links.map((link, idx) => (
              <CSS.Link key={idx} active={router?.pathname.includes(link.to)}>
                {/* Proj Issues nº 1 */}
                {/* <Link href={link.to} children={link.title} /> */}

                <a href={link.to} children={link.title} />
                <div style={{ marginLeft: '10px' }}>
                  <External />
                </div>
              </CSS.Link>
            ))}
          </CSS.Navigator>
        </CSS.Navbar>

        <CSS.NavbarMobile>
          {renderCloseIcon ? (
            <>
              <button onClick={openCreds}>
                <About />
              </button>
              <button onClick={openLinks}>
                <CloseRepos />
              </button>
            </>
          ) : (
            <>
              <button onClick={openCreds}>
                <About />
              </button>
              <button onClick={openLinks}>
                <MoreRepos />
              </button>
            </>
          )}
        </CSS.NavbarMobile>
      </CSS.Container>
    </CSS.Header>
  )
}

export default TheHeader
