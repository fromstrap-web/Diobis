import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import {
  AppLabel,
  AppReader,
  AppAlert,
  TheHeader,
  Links,
  Creds,
} from '../../../../components'
import OthersJobs from './_components/OthersJobs/OthersJobs'
import Service from '../../../../services/Jobs.service'
import * as CSS from './issue.styled'
import { ShareIcon } from '@heroicons/react/outline'
import ClipboardBubble from './_components/ClipboardNotification/ClipboardBubble'
import { OTHER_JOBS } from '../../../../store/ducks/_Jobs/actions'

const Issue = ({ route, repo }) => {
  const { query, pathname } = useRouter()
  const dispatch = useDispatch()
  const Jobs = useSelector(({ Jobs }) => Jobs.data)
  const OtherJobs = useSelector(({ Jobs }) => Jobs.otherJobs)
  const [loading, setLoading] = useState(true)
  const [noAnimation, setNoAnimation] = useState(true)
  const [renderLinks, setRenderLinks] = useState(false)
  const [linksVisibility, setLinksVisibility] = useState(false)
  const [renderCloseIcon, setRenderCloseIcon] = useState(false)
  const [renderCreds, setRenderCreds] = useState(false)
  const [credsVisibility, setCredsVisibility] = useState(false)
  const [error, setError] = useState({
    isActive: false,
    message: '',
    status: '',
  })
  const [JobsInfo, setJobsInfo] = useState([])
  const [bubbleVisibilty, setBubbleVisibilty] = useState(false)

  useEffect(() => {
    // Nao executa caso a query ainda nao tenha sido carregada.
    if (!query.issue) return

    // Executa caso a query tenha sido carrega.
    const Job = Jobs.find(({ job }) => job.id === query.issue)

    if (Job) {
      setLoading(false)
      setJobsInfo(Job)
    } else {
      Service.getByID(query.issue, repo).then(
        success => {
          setJobsInfo(success)
          setLoading(false)
          return success
        },
        ({ message, status }) => {
          setError({ isActive: true, message, status })
          setLoading(false)
        }
      )
    }
  }, [query.issue])

  useEffect(() => {
    if (!query.issue) return

    if (!!JobsInfo.user) {
      return dispatch(OTHER_JOBS(JobsInfo.user.name, repo))
    }
  }, [query.issue, JobsInfo])

  function copyToClipboard() {
    const url = window.location.href

    navigator.clipboard
      .writeText(url)
      .then(() => (bubbleVisibilty ? '' : setBubbleVisibilty(!bubbleVisibilty)))
      .then(() => {
        setTimeout(() => {
          if (!bubbleVisibilty) return setBubbleVisibilty(oldState => !oldState)
        }, 2000)
      })
      .catch(err => console.log(err))
  }

  /**
      Ao final da animação ele remove da DOM o elemento.
      Recebendo apenas 'display:none' não é possível clicar em nada que
    estará abaixo do elemento de links.

    TODO => Refatorar lógica de render do componente links
   */
  function toggleRenderLinks() {
    setRenderCloseIcon(old => !old)

    if (renderLinks) {
      setTimeout(() => {
        setRenderLinks(false)
      }, 300)
    } else {
      setRenderLinks(true)
    }
  }

  function toggleRenderCreds() {
    if (renderCreds) {
      setTimeout(() => {
        setRenderCreds(false)
      }, 300)
    } else {
      setRenderCreds(true)
    }
  }

  return (
    <>
      <TheHeader
        renderCloseIcon={renderCloseIcon}
        openLinks={() => {
          if (noAnimation) setNoAnimation(false)

          // Ao clicar no outro popup o atual aberto fecha
          if (renderCreds) {
            toggleRenderCreds()
            setCredsVisibility(old => !old)
          }

          toggleRenderLinks()
          setLinksVisibility(old => !old)
        }}
        openCreds={() => {
          if (noAnimation) setNoAnimation(false)

          // Ao clicar no outro popup o atual aberto fecha
          if (renderLinks) {
            toggleRenderLinks()
            setLinksVisibility(old => !old)
          }

          toggleRenderCreds()
          setCredsVisibility(old => !old)
        }}
      />
      {renderLinks && (
        <Links noAnimation={noAnimation} visible={linksVisibility} />
      )}

      {/* TODO: Add mensagem de loading */}
      {loading && !error.isActive && (
        <CSS.Loading>
          <span>Carregando a sua vaga 😉</span>
        </CSS.Loading>
      )}

      {!loading && error.isActive && (
        <section>
          <CSS.Container>
            <Head>
              <title>
                {error.status} | {error.message}
              </title>
            </Head>
            <AppAlert type="warning">
              {error.status} | {error.message}
            </AppAlert>
          </CSS.Container>
        </section>
      )}

      {!loading && !error.isActive && !!JobsInfo && (
        <section>
          <Head>
            <title>{JobsInfo.job.title}</title>
          </Head>
          <CSS.Container>
            <CSS.Content>
              {/* Informations Bar */}
              <CSS.InformationsBar hidden={!OtherJobs.slice(1).length}>
                <div>
                  {/* Title and Pic */}
                  <div>
                    <img src={JobsInfo.user.avatar} alt={JobsInfo.user.name} />
                    <h1>{JobsInfo.job.title}</h1>
                  </div>

                  {/* Labels */}
                  <CSS.LabelsContainer>
                    {JobsInfo.job.labels.slice(0, 6).map(label => (
                      <div key={label.id}>
                        <AppLabel
                          key={label.id}
                          color={label.color}
                          value={label.name}
                        />
                      </div>
                    ))}
                  </CSS.LabelsContainer>

                  {/* Actions Bar */}
                  <CSS.Actions>
                    {OtherJobs.length >= 2 && (<h1>
                      Outras vagas de <b>{JobsInfo.user.name}</b>
                    </h1>)}
                    {/* <GlobeAltIcon color="#364250" /> */}
                    <ClipboardBubble
                      text="Link copiado!"
                      visible={bubbleVisibilty}
                    />
                    <ShareIcon
                      color="#364250"
                      onClick={() => copyToClipboard()}
                    />
                  </CSS.Actions>
                </div>
                <CSS.MoreJobs>
                  <OthersJobs
                    route={pathname.split('/')[1]}
                    repo={repo}
                    user={JobsInfo.user.name}
                  />
                </CSS.MoreJobs>
              </CSS.InformationsBar>
              <CSS.Markdown>
                <div>
                  <AppReader>{JobsInfo.job.markdown}</AppReader>
                </div>
              </CSS.Markdown>
            </CSS.Content>
          </CSS.Container>
          {renderCreds && (
            <Creds noAnimation={noAnimation} visible={credsVisibility} />
          )}
        </section>
      )}
    </>
  )
}

export default Issue
