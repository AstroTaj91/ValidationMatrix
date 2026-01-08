import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../server/routers';
import { getUserByOpenId } from '../server/db';
import type { Context } from '../server/trpc';

// Load environment variables
import 'dotenv/config';

/**
 * Vercel serverless handler for tRPC
 * Converts Vercel req/res to Fetch API format for tRPC
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Parse cookies from request
    const cookies = parseCookies(req.headers.cookie || '');
    const sessionId = cookies['session'];

    // Load user from session
    let user = null;
    if (sessionId) {
        user = await getUserByOpenId(sessionId);
    }

    // Convert Vercel request to Fetch API Request
    const url = new URL(req.url || '/', `https://${req.headers.host}`);
    const fetchRequest = new Request(url, {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Handle the request with tRPC
    const response = await fetchRequestHandler({
        endpoint: '/api/trpc',
        req: fetchRequest,
        router: appRouter,
        createContext: (): Context => ({
            user: user as any,
            req: req as any,
            res: res as any,
        }),
        onError({ error, path }) {
            console.error(`[tRPC Error] ${path}:`, error);
        },
    });

    // Copy headers from fetch response to Vercel response
    response.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });

    // Set status and body
    res.status(response.status);
    const body = await response.text();
    res.send(body);
}

/**
 * Simple cookie parser
 */
function parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split('=');
        if (name) {
            cookies[name] = rest.join('=');
        }
    });
    return cookies;
}
