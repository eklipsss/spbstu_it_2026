import { GuidePageInfo } from '@/features/guide-page/info/info'
import { Layout } from '@/shared/components'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Guide, getGuideById } from '@/shared/mocks/data'

export const GuidePage = () => {
  const { id } = useParams()
  const [guideData, setGuideData] = useState<Guide>()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setGuideData(getGuideById(id))
    }, 180)

    return () => window.clearTimeout(timer)
  }, [id])

  const currentGuide = guideData ?? getGuideById(id)

  return (
    <>
      <Helmet>
        <title>{currentGuide.name}</title>
        <meta name="description" content={currentGuide.name} />
        <meta property="og:title" content={currentGuide.name} />
        <meta property="og:description" content={currentGuide.name} />
      </Helmet>

      <Layout>
        <GuidePageInfo {...currentGuide} />
      </Layout>
    </>
  )
}
