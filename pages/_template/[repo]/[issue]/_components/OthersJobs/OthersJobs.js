import { useState, useEffect } from 'react'
import { Container, Slider, Card, Button } from './OthersJobs.styled'
import { AppLabel } from '../../../../../../components'
import { useRouter } from 'next/router'
import GitHub from '../../../../../../services/Jobs.service'

const OthersJobs = ({ route, repo, user }) => {
  const [data, setData] = useState([])
  const { pathname, query } = useRouter()

  useEffect(() => {
    async function getOtherJobs() {
      await GitHub.getByUser(user, repo).then(data => {
        const othersJobs = data.filter(
          job => parseInt(query.issue, 10) !== job.job.id
        )
        setData(othersJobs)
      })
    }

    getOtherJobs()
  }, [])

  return (
    <>
      {data.lenght !== 0 && (
        <Container>
          <Slider>
            {data.length >= 2 && (
              <h1>
                Outras vagas de <b>{user}</b>
              </h1>
            )}
            {data.map(({ job }) => {      
              return (
              <Card key={job.id}>
                <p>{job.title}</p>
                <div tw="mb-4" className="labels">
                  {job.labels.map(label => (
                    <AppLabel
                      key={label.name}
                      value={label.name}
                      color={label.color}
                    />
                  ))}
                </div>

                <Button>
                  <a
                    href={`/${route}/${repo}/${job.id}`}
                  >
                    Abrir a vaga
                  </a>
                </Button>
              </Card>
            )})}
          </Slider>
        </Container>
      )}

      {data.length === 0 && <h1></h1>}
    </>
  )
}

export default OthersJobs
