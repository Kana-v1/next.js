import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../prisma/repository/post_repository'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { trpc } from '../../utils/trpc';


export default function Post({ postData }: {
  postData: {
    id: string
    date: string
    contentHtml: string
  }
}) {
  return (
    <Layout>
      <Head>
        <title>{postData.id}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.id}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params) {
    return {
      props: {
      }
    }
  }

  const postData = await getPostData(params.id as string)
  return {
    props: {
      postData
    }
  }
};