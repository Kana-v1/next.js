import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import HomeStyles from '../styles/Home.module.css'
import { post } from '../prisma/repository/post_repository'
import Link from 'next/link'
import DateEl from '../components/date'
import { GetServerSideProps, GetStaticProps } from 'next'
import { trpc } from '../utils/trpc';
import { useEffect, useRef, useState, useCallback } from "react";
import Image from 'next/image'

export default function Home() {

  const [posts, setPosts] = useState<post[]>([])
  const [postAction, setPostAction] = useState(new PostAction(Action.none))

  let pdBuf = trpc.obtainSortedPostData.useQuery()
  const deleteMutation = trpc.deletePost.useMutation()
  const createMutation = trpc.createNewPost.useMutation()

  useEffect(() => {
    switch (postAction.action) {
      case Action.delete: {
        deleteMutation.mutateAsync({ id: postAction.id })
        break
      }

      case Action.copy: {
        createMutation.mutateAsync({
          title: postAction.title,
          date: postAction.date,
          htmlText: postAction.htmlText
        })

        break
      }
    }

    pdBuf.refetch().then(d => {
      setPosts(d.data ? d.data.data : new Array<post>)
      console.log('posts have been set')
    })
  }, [postAction])



  const handlePostEvent = (id: number, htmlText: string, title: string, action: Action) => {
    const date = new Date()
    const month = date.getMonth() > 10 ? date.getMonth().toString() : `0${date.getMonth()}`
    const day = date.getDay() > 10 ? date.getDay().toString() : `0${date.getDay()}`
    const dateStr = `${date.getFullYear()}-${month}-${day}`

    setPostAction(new PostAction(action, id, title, htmlText, dateStr))
  }

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
          {posts.map(({ id, title, date, htmltext }) => (
            <li className={utilStyles.listItem} key={id}>
              <span className={HomeStyles.listSpan}>

                <Link className={HomeStyles.link} href={`/posts/${title}`}>{title}</Link>
                <Image src="/images/trash.png"
                  className={HomeStyles.icon}
                  width={20}
                  height={20}
                  alt="image should be here"
                  onClick={() => {
                    handlePostEvent(id, htmltext, title, Action.delete)
                  }}
                />
                <Image src="/images/copy.png"
                  className={HomeStyles.icon}
                  width={20}
                  height={20}
                  alt="image should be here"
                  onClick={() => {
                    handlePostEvent(id, htmltext, title, Action.copy)
                  }}
                />
              </span>
              <br />
              <small className={utilStyles.lightText}>
                <DateEl dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

enum Action {
  none = "none",
  delete = "delete",
  copy = "copy"
}

class PostAction {
  id: number
  title: string
  htmlText: string
  date: string
  action: Action

  constructor(action: Action, id?: number, title?: string, htmlText?: string, date?: string) {
    this.id = id ? id : 0
    this.title = title ? title : ""
    this.htmlText = htmlText ? htmlText : ""
    this.date = date ? date : ""
    this.action = action
  }
}


