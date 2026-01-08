import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import superjson from 'superjson';
import type { User } from '../drizzle/schema';

/**
 * Context for tRPC procedures
 */
export interface Context {
    user: User | null;
    req: CreateExpressContextOptions['req'];
    res: CreateExpressContextOptions['res'];
}

/**
 * Create context from Express request
 */
export async function createContext(opts: CreateExpressContextOptions): Promise<Context> {
    // For demo purposes, we'll use a simple session-based auth
    // In production, implement proper JWT or OAuth
    const user = (opts.req as any).user as User | null ?? null;

    return {
        user,
        req: opts.req,
        res: opts.res,
    };
}

/**
 * Initialize tRPC with superjson transformer
 */
const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    });
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
