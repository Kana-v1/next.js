import { PrismaClient } from '@prisma/client'
import { remark } from 'remark'
import html from 'remark-html'
import prisma from '../../lib/prisma'
import { Prisma } from "@prisma/client";

const postWithNoArguments = Prisma.validator<Prisma.postsArgs>()({})
type post = Prisma.postsGetPayload<typeof postWithNoArguments>

let postRepository: PostRepository

class PostRepository {
    prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async getSortedPostsData(sortAsc?: boolean): Promise<post[]> {
        const posts = await this.prisma.posts.findMany()

        return posts.sort((a, b) => {
            if (!sortAsc && a.date < b.date) {
                return 1
            } else {
                return -1
            }
        })
    }

    async getAllPostIds(): Promise<number[]> {
        const res = await this.prisma.posts.findMany({
            select: {
                id: true
            }
        })

        return res.map(r => r.id)
    }

    async getPostData(id: string): Promise<post | null> {
        const post = await this.prisma.posts.findFirst({
            where: {
                title: id
            }
        })

        //    const contentHtml = (await remark().use(html).process(post.htmltext)).toString()
        return post
    }

    async createPost(postToCreate: post | { title: string, htmlText: string, date: string }) {
        let contentHtml: string = "id" in postToCreate ? postToCreate.htmltext : postToCreate.htmlText
        try {
            await this.prisma.posts.create({
                data: {
                    date: postToCreate.date,
                    htmltext: contentHtml,
                    title: postToCreate.title,
                }
            })
        } catch (err) {
            console.log('cannot create post; err: ', err)
        }
    }

    async deletePost(id: number) {
        try {
            await this.prisma.posts.delete(
                {
                    where: {
                        id: id
                    }
                }
            )
        } catch (err) {
            console.log(`cannot delete post with id ${id}; err: ${err}`)
        }
    }
}

export default function getPostRepo(prismaClient?: PrismaClient): PostRepository {
    if (prismaClient && !postRepository) {
        postRepository = new PostRepository(prismaClient)
    } else if (!prismaClient && !postRepository) {
        postRepository = new PostRepository(prisma)
    }

    return postRepository
}

export type { post }