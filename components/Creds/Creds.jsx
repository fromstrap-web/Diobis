import * as CSS from './Creds.styled'

// import GitHub from '../../assets/icons/GitHub'

const LinkedIn = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(55, 65, 81)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-linkedin"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  )
}

const GitHub = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="none"
      stroke="rgb(55, 65, 81)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-github"
      viewBox="0 0 24 24"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path>
    </svg>
  )
}

const Cred = ({ noAnimation, visible }) => (
  <CSS.Container noAnimation={noAnimation} visible={visible}>
    <CSS.Cred>
      <CSS.Title>Desenvolvido por</CSS.Title>
      <CSS.Infos>
        <CSS.Name>
          <span>Yago Crispim</span>
        </CSS.Name>
        <div>
          <LinkedIn />
          <GitHub />
        </div>
      </CSS.Infos>

      <CSS.Separator>
        <div></div>
      </CSS.Separator>

      <CSS.Infos>
        <CSS.Name>
          <span>Washington Jr.</span>
        </CSS.Name>
        <div>
          <LinkedIn />
          <GitHub />
        </div>
      </CSS.Infos>
    </CSS.Cred>
  </CSS.Container>
)

export default Cred
