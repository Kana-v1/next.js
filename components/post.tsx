import { trpc } from '../utils/trpc'
import Layout from './layout'
import Head from 'next/head'
import Date from '../components/date'
import utilStyles from '../styles/utils.module.css'
import { useEffect, useState } from 'react'

export default function PostData({ postID }: { postID: string }) {
    const [postData, setPostData] = useState<any>("")

    const query = trpc.obtainPostsData.useQuery({ id: postID })

    useEffect(() => {
        query.refetch().then(res => {
            setPostData(res.data)
        })
    }, [])

    query.refetch().then(res => {
        setPostData(res.data)
    })

    if (!postData) {
        return <div>Loading...</div>
    }


    return (
        <Layout>
            <Head>
                <title>{postData.data.id}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.data.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.data.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.data.htmltext }} />
            </article>
        </Layout>
    )
}