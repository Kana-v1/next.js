import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { Procedures } from '../server/trpc_procedures/_app';
import superjson from 'superjson';


export const trpc = createTRPCNext<Procedures>({
    config() {
        return {
            links: [
                httpBatchLink({
                    url: `http://localhost:3000/api/trpc`,
                }),
            ],
            transformer: superjson,
        };
    },
    ssr: false,
});