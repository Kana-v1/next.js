import { remark } from 'remark'
import html from 'remark-html'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getSortedPostsData() {
  const posts = await prisma.posts.findMany()
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getAllPostIds() {
  const res = await prisma.posts.findMany({
    select: {
      title: true
    }
  })

  return res.map(row => {
    return {
      params: {
        id: row.title
      }
    }
  })
}

export async function getPostData(id: string) {
  const post = await prisma.posts.findFirst({
    where: {
      title: id
    }
  })

  if (post === null) {
    return null
  }

  const contentHtml = (await remark().use(html).process(post.htmltext)).toString()

  return {
    id: post.title,
    contentHtml: contentHtml,
    date: post.date
  }
}