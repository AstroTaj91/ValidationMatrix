import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../server/routers';
import { getUserByOpenId } from '../server/db';
import type { Context } from '../server/trpc';

// Load environment variables
import 'dotenv/config';

// Store pending cookies to be set after tRPC handles the request
let pendingCookies: string[] = [];

/**
 * Helper to set a cookie via Set-Cookie header (works in Vercel serverless)
 */
export function setCookieHeader(name: string, value: string, options: { httpOnly?: boolean; secure?: boolean; sameSite?: string; maxAge?: number; path?: string } = {}) {
    const parts = [`${name}=${value}`];
    if (options.path) parts.push(`Path=${options.path}`);
    if (options.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
    if (options.httpOnly) parts.push('HttpOnly');
    if (options.secure) parts.push('Secure');
    if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
    pendingCookies.push(parts.join('; '));
}

/**
 * Helper to clear a cookie
 */
export function clearCookieHeader(name: string) {
    pendingCookies.push(`${name}=; Path=/; Max-Age=0`);
}

/**
 * Vercel serverless handler for tRPC
 * Converts Vercel req/res to Fetch API format for tRPC
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Reset pending cookies for each request
    pendingCookies = [];

    try {
        // Parse cookies from request
        const cookies = parseCookies(req.headers.cookie || '');
        const sessionId = cookies['session'];

        // Load user from session
        let user = null;
        if (sessionId) {
            try {
                user = await getUserByOpenId(sessionId);
            } catch (err) {
                console.error('[Auth] Failed to load user:', err);
            }
        }

        // Convert Vercel request to Fetch API Request
        const url = new URL(req.url || '/', `https://${req.headers.host}`);
        const fetchRequest = new Request(url, {
            method: req.method,
            headers: req.headers as HeadersInit,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });

        // Create a mock response object that works with both Express and Vercel
        const mockRes = {
            cookie: (name: string, value: string, options: any = {}) => {
                setCookieHeader(name, value, {
                    httpOnly: options.httpOnly,
                    secure: options.secure,
                    sameSite: options.sameSite,
                    maxAge: options.maxAge,
                    path: options.path || '/',
                });
            },
            clearCookie: (name: string) => {
                clearCookieHeader(name);
            },
            setHeader: res.setHeader.bind(res),
        };

        // Handle the request with tRPC
        const response = await fetchRequestHandler({
            endpoint: '/api/trpc',
            req: fetchRequest,
            router: appRouter,
            createContext: (): Context => ({
                user: user as any,
                req: req as any,
                res: mockRes as any,
            }),
            onError({ error, path }) {
                console.error(`[tRPC Error] ${path}:`, error);
            },
        });

        // Copy headers from fetch response to Vercel response
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        // Apply any pending cookies
        if (pendingCookies.length > 0) {
            res.setHeader('Set-Cookie', pendingCookies);
        }

        // Set status and body
        res.status(response.status);
        const body = await response.text();
        res.send(body);
    } catch (error) {
        console.error('[API Handler Error]:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
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
