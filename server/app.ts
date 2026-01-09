import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './trpc';
import { getUserByOpenId } from './db';

const app = express();

// Request logger
app.use((req, res, next) => {
    console.log(`[Express] ${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://validation-matrix.vercel.app'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Session middleware - loads user from cookie
app.use(async (req, _res, next) => {
    const sessionId = req.cookies?.session;
    if (sessionId) {
        try {
            const user = await getUserByOpenId(sessionId);
            (req as any).user = user ?? null;
        } catch (err) {
            console.error('[Error loading user]', err);
            (req as any).user = null;
        }
    } else {
        (req as any).user = null;
    }
    next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC API handler
app.use(
    '/api/trpc',
    createExpressMiddleware({
        router: appRouter,
        createContext,
        onError({ error, path }) {
            console.error(`[tRPC Error] ${path}:`, error);
        },
    })
);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Express Error]', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message, stack: err.stack });
});

export { app };
