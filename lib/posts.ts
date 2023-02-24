import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { Client, ClientConfig } from 'pg'

const postsDirectory = path.join(process.cwd(), 'posts')

const dbConfig: ClientConfig = {
  database: "nextjsdb",
  host: "localhost",
  password: "password",
  user: "postgres",
  port: 5432,
}

const dbClient = new Client(dbConfig)
dbClient.connect()

export async function getSortedPostsData() {
  let posts: any = null
  
  try {
    let res = await dbClient.query("SELECT title, date, htmlText FROM posts")
    posts = await Promise.all(res.rows.map(async row => await new Post(row).getData()))
  } catch(err) {
    console.log('cannot get all posts; err: ', err)
  }

  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getAllPostIds() {
  let ids: any = null

  try {
    let res = await dbClient.query("SELECT title FROM posts")
    ids = res.rows.map(row => row.title)
  } catch (err) {
    console.log('cannot run query, err: ', err)
  }

  return ids.map((id: any) => {
    return {
      params: {
        id: id
      }
    }
  })
}

export async function getPostData(id: string) {
  let post: Post

  try {
    let res = await dbClient.query('SELECT title, date, htmlText FROM posts WHERE title = $1', [id])
    post = new Post(res.rows.shift())
  } catch(err) {
    console.log("cannot get post data; err: ", err)
  }

  const postData = await post.getData()

  return {
    id: postData.id,
    contentHtml: postData.contentHtml,
    date: postData.date,
  }
}


class Post {
  title: string
  date: string
  htmlText: string

  constructor(row: any) {
    this.title = row.title as string
    this.htmlText = row.htmltext as string 
    this.date = row.date as string
  }

  async getData(): Promise<{id: string, date: string, contentHtml: string}> {
    const processedContent = await remark()
    .use(html)
    .process(this.htmlText)
  const contentHtml = processedContent.toString()

    return {
      id: this.title,
      date: this.date,
      contentHtml: contentHtml,
    }
  }  
}
