import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

// Redux
import intialState from '../../store/ducks/_Filter/initialState'
import { useDispatch, useSelector } from 'react-redux'
import {
  FETCHING,
  FILTERED_DATA,
  GET_ANOTHER_PAGE,
  UPDATE_CURRENT_PAGE_VALUE,
} from '../../store/ducks/_Jobs/actions'
import {
  FILTERED,
  PERSIST_INITIAL,
  RESET,
  APPLY_OPTIONS,
  RESET_OPTIONS,
} from '../../store/ducks/_Filter/actions'

// Components
import {
  AppCard,
  LayoutGrid,
  LayoutContainer,
  AppAlert,
  Filters,
  Links,
  TheHeader,
  Creds,
} from '../../components'

// Hooks
import useOutsideClick from '../../hooks/useOutsideClick'
import useFuncAtEndOfScroll from '../../hooks/useFuncAtEndOfScroll'

// Style
import * as CSS from './styled'

const Template = ({ route, repo }) => {
  const currentRepo = repo
  const router = useRouter()
  const dispatch = useDispatch()
  const { data, loading, error, filteredData, lastPage } = useSelector(
    ({ Jobs }) => Jobs
  )
  const { cards, selected, applyed } = useSelector(({ Filter }) => Filter)
  const [filterVisibility, setFilterVisibility] = useState(false)
  const [windowsWidth, setWindowsWidth] = useState(0)
  const [linksVisibility, setLinksVisibility] = useState(false)
  const [renderLinks, setRenderLinks] = useState(false)
  const [renderCreds, setRenderCreds] = useState(false)
  const [credsVisibility, setCredsVisibility] = useState(false)
  const [renderCloseIcon, setRenderCloseIcon] = useState(false)
  const [renderLoadMoreBtn, setRenderLoadMoreBtn] = useState(false)
  const [noAnimation, setNoAnimation] = useState(true)
  const [loadButtonText, setLoadButtonText] = useState('Mais vagas')
  const filterRef = useRef(null)
  filterRef && useOutsideClick(filterRef.current, handleOutsideClick)

  useFuncAtEndOfScroll(() => {
    if (!applyed.length && windowsWidth > 700) {
      loadAnotherPage()
    }
  }, [])

  useEffect(() => {
    if (data.length === 0) dispatch(FETCHING(currentRepo))
    dispatch(PERSIST_INITIAL(intialState.cards))
  }, [])

  useEffect(() => {
    selected.length < 1 ? dispatch(FILTERED_DATA(data)) : cardsFilter()
  }, [data, applyed])

  useEffect(() => {
    setWindowsWidth(window.innerWidth)
  }, [])

  /* -------------------------- */
  // FIX => Effects gambiarra
  useEffect(() => {
    setLoadButtonText('Mais vagas')
  }, [filteredData.length])

  useEffect(() => {
    setTimeout(() => {
      setRenderLoadMoreBtn(true)
    }, 1500)
  }, [loading])

  /* --------------------------- */

  async function loadAnotherPage() {
    const nextPage = lastPage + 1

    setLoadButtonText('Carregando...')
    dispatch(GET_ANOTHER_PAGE(nextPage, currentRepo))
    dispatch(UPDATE_CURRENT_PAGE_VALUE(nextPage))
  }

  function handleActive(index, optionKey, optionText) {
    dispatch(FILTERED(index, optionKey, optionText))
  }

  function handleFilterReset() {
    dispatch(RESET()) // blue balls
    dispatch(RESET_OPTIONS()) // reset options
  }

  function applyOptions() {
    dispatch(APPLY_OPTIONS([...selected]))
  }

  function cardsFilter() {
    let arr = []
    data.forEach(el => {
      el.job.labels.forEach(label => {
        const ver = applyed.includes(label.name)

        if (ver) {
          return arr.push(el)
        }
      })
    })

    dispatch(FILTERED_DATA(arr))
  }

  function openJob(jobId) {
    const jobsInfo = data.find(({ job }) => job.id === jobId)
    router.push(`/${route}/${repo}/${jobsInfo.job.id}`)
  }

  function handleOutsideClick() {
    setFilterVisibility(false)
    applyOptions()
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
      <Head>
        <title>Diobis | {repo}</title>
      </Head>
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
      <CSS.Section>
        <Filters
          noAnimation={noAnimation}
          ref={filterRef}
          visible={filterVisibility}
          cards={cards}
          onReset={handleFilterReset}
          onApply={applyOptions}
          handleSelected={handleActive}
          handleVisibility={() => {
            if (noAnimation) setNoAnimation(false)

            setFilterVisibility(oldState => !oldState)
          }}
        />
        <LayoutContainer>
          {/* if error */}
          {!loading && error.active && (
            <CSS.Error>
              <AppAlert type="warning">
                <p>
                  <b>{error.code}</b> | {error.message}
                </p>
              </AppAlert>
            </CSS.Error>
          )}

          {/* If Data not loading */}
          {loading && (
            <LayoutGrid>
              {Array.apply(null, Array(12)).map((n, index) => (
                <AppCard loading key={index} />
              ))}
            </LayoutGrid>
          )}

          {/* If data loaded */}
          {!loading && !error.active && typeof filteredData !== 'undefined' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <LayoutGrid>
                {filteredData.map(job => {
                  return (
                    <AppCard
                      data={job}
                      key={job.job.id}
                      onSave={() => {}}
                      onSelect={() => openJob(job.job.id)}
                    />
                  )
                })}
              </LayoutGrid>
              {windowsWidth < 700 && renderLoadMoreBtn && (
                <button
                  onClick={() => loadAnotherPage()}
                  style={{
                    width: '50%',
                    maxWidth: '200px',
                    fontSize: '0.9rem',
                    fontWeight: '400',
                    color: '#ffffff',
                    backgroundColor: '#3B82F6',
                    padding: '10px',
                    borderRadius: '10px',
                  }}
                >
                  {loadButtonText}
                </button>
              )}
            </div>
          )}
          {windowsWidth > 700 ? (
            <Creds noAnimation={noAnimation} visible={credsVisibility} />
          ) : (
            renderCreds && (
              <Creds noAnimation={noAnimation} visible={credsVisibility} />
            )
          )}
        </LayoutContainer>
      </CSS.Section>
    </>
  )
}

export default Template
