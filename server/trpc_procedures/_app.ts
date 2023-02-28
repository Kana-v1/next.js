import { z } from 'zod';
import { procedure, router } from '../trpc';
import getPostRepo, { post } from '../../prisma/repository/post_repository'

const postRepo = getPostRepo()

export const procedures = router({
  obtainPostsData: procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const data = await postRepo.getPostData(input.id)

      return {
        data: data,
      };
    }),

  obtainPostIds: procedure
    .query(async () => {
      const ids = await postRepo.getAllPostIds()
      return {
        ids: ids
      }
    }),

  obtainSortedPostData: procedure
    .input(
      z.boolean().optional()
    )
    .query(async ({ input }) => {
      let data = await postRepo.getSortedPostsData(input)
      return {
        data: data
      }
    }),

  createNewPost: procedure
    .input(
      z.object({
        title: z.string(),
        htmlText: z.string(),
        date: z.string()
      }),
    )
    .mutation(async ({ input }) => {
      await postRepo.createPost({
        id: 0,
        title: input.title,
        htmltext: input.htmlText,
        date: input.date
      })
    }),

  deletePost: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      await postRepo.deletePost(input.id)
    })
});

export type Procedures = typeof procedures; 