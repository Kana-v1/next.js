import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import { GetStaticProps } from 'next'
import { trpc } from '../utils/trpc';
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";



export default function Home() {

  const postWithNoArguments = Prisma.validator<Prisma.postsArgs>()({})
  type postType = Prisma.postsGetPayload<typeof postWithNoArguments>

  const [posts, setPosts] = useState<postType[]>([])
  let pdBuf = trpc.sortedPostData.useQuery()

  useEffect(() => {
    pdBuf.refetch().then(d => {
      setPosts(d.data.data)
    })
  }, [])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {posts.map(({ title, date, htmltext }) => (
            <li className={utilStyles.listItem} key={title}>
              <Link href={`/posts/${title}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}