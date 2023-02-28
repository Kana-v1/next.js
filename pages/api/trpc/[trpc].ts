import * as trpcNext from '@trpc/server/adapters/next';
import { procedures } from '../../../server/trpc_procedures/_app';

export default trpcNext.createNextApiHandler({
  router: procedures,
  createContext: () => ({}),
});