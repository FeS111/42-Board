import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = ({ req }: trpcExpress.CreateExpressContextOptions) => {
  return {
    user: req.user as {
      id: number;
      username: string;
      intraId: string;
      displayName: string;
      familyName: string;
      givenName: string;
      profileUrl: string;
      email: string;
      phoneNumber: string;
      photoUrl: string;
    },
    req
  };
};
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

import { commentRouter } from './comments.handler';
import { postRouter } from './post.handler';
import { reactionRouter } from './reaction.handler';
import { voteRouter } from './vote.handler';

export const appRouter = router({
  post: postRouter,
  vote: voteRouter,
  reaction: reactionRouter,
  comment: commentRouter,
  auth: router({
    logout: publicProcedure.query(async req => {
      return new Promise<boolean>(resolve => {
        req.ctx.req.logOut(
          {
            keepSessionInfo: false
          },
          () => {
            req.ctx.req.session.destroy(() => resolve(true));
          }
        );
      });
    })
  })
});

export type AppRouter = typeof appRouter;
