import { z } from 'zod';
import { procedure, router } from '../trpc';
import { getPostData, getAllPostIds, getSortedPostsData } from '../../lib/posts'
import superjson from 'superjson';
import { initTRPC } from '@trpc/server';

const transformer = initTRPC.create({transformer: superjson})

export const appRouter = transformer.router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
  postData: procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const data = await getPostData(input.id)


      return {
        data: data,
      };
    }),
  postIds: procedure
    .query(async () => {
      const ids = await getAllPostIds()
      return {
        ids: ids
      }
    }),
  sortedPostData: procedure
    .query(async ({ input }) => {
      let data = await getSortedPostsData()
      return {
        data: data
      }
    })
});

export type AppRouter = typeof appRouter; 