import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
import { useSelector } from 'react-redux'
import ClipboardBubble from './_components/ClipboardNotification/ClipboardBubble'

const Issue = ({ route, repo }) => {
  const { query } = useRouter()
  const Jobs = useSelector(({ Jobs }) => Jobs.data)
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
  const [JobsInfo, setJobsInfo] = useState({})
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
        },
        ({ message, status }) => {
          setError({ isActive: true, message, status })
          setLoading(false)
        }
      )
    }
  }, [query.issue])

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
              <CSS.InformationsBar>
                <div>
                  {/* Title and Pic */}
                  <div>
                    <img src={JobsInfo.user.avatar} alt={JobsInfo.user.name} />
                    <h1>{JobsInfo.job.title}</h1>
                  </div>

                  {/* Labels */}
                  <CSS.LabelsContainer>
                    {JobsInfo.job.labels.map(label => (
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
                    route={route}
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
