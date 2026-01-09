import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initTRPC, TRPCError } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';
import { z } from 'zod';

// ============================================
// INLINE DEMO MODE - No database required
// ============================================

// In-memory store for demo mode
const mockStore = {
    users: [] as any[],
    ideas: [] as any[],
    analyses: [] as any[],
};

// Simple ID generators
let userIdCounter = 1;
let ideaIdCounter = 1;
let analysisIdCounter = 1;

// Type definitions
interface User {
    id: number;
    openId: string;
    name: string | null;
    email: string | null;
    role: string;
}

interface Context {
    user: User | null;
    setCookie: (name: string, value: string, options?: any) => void;
    clearCookie: (name: string) => void;
}

// Cookie helpers
let pendingCookies: string[] = [];

function setCookieHeader(name: string, value: string, options: any = {}) {
    const parts = [`${name}=${value}`];
    parts.push('Path=/');
    if (options.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
    if (options.httpOnly) parts.push('HttpOnly');
    if (options.secure) parts.push('Secure');
    if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
    pendingCookies.push(parts.join('; '));
}

function clearCookieHeader(name: string) {
    pendingCookies.push(`${name}=; Path=/; Max-Age=0`);
}

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

// Mock database functions
function upsertUser(user: { openId: string; name?: string | null; email?: string | null; role?: string }): User {
    const existing = mockStore.users.find(u => u.openId === user.openId);
    if (existing) {
        existing.name = user.name ?? existing.name;
        existing.email = user.email ?? existing.email;
        return existing;
    }
    const newUser: User = {
        id: userIdCounter++,
        openId: user.openId,
        name: user.name ?? null,
        email: user.email ?? null,
        role: user.role ?? 'user',
    };
    mockStore.users.push(newUser);
    return newUser;
}

function getUserByOpenId(openId: string): User | undefined {
    return mockStore.users.find(u => u.openId === openId);
}

// Initialize tRPC
const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

// Auth router
const authRouter = t.router({
    me: t.procedure.query(({ ctx }) => {
        return ctx.user;
    }),

    demoLogin: t.procedure.mutation(({ ctx }) => {
        const demoOpenId = 'demo-user-' + Date.now();

        const user = upsertUser({
            openId: demoOpenId,
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'user',
        });

        ctx.setCookie('session', demoOpenId, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { success: true, user };
    }),

    logout: t.procedure.mutation(({ ctx }) => {
        ctx.clearCookie('session');
        return { success: true };
    }),
});

// Protected procedure middleware
const isAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
});

const protectedProcedure = t.procedure.use(isAuthenticated);

// Idea input schema
const ideaInputSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

// Generate mock AI analysis
function generateMockAnalysis() {
    const dimensions = [
        { name: 'marketSize', score: Math.floor(Math.random() * 40) + 60 },
        { name: 'competition', score: Math.floor(Math.random() * 40) + 60 },
        { name: 'feasibility', score: Math.floor(Math.random() * 40) + 60 },
        { name: 'innovation', score: Math.floor(Math.random() * 40) + 60 },
        { name: 'scalability', score: Math.floor(Math.random() * 40) + 60 },
        { name: 'profitability', score: Math.floor(Math.random() * 40) + 60 },
    ];

    const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);

    return {
        overallScore,
        dimensionScores: JSON.stringify(dimensions),
        strengths: JSON.stringify(['Strong market potential', 'Innovative approach', 'Scalable solution']),
        weaknesses: JSON.stringify(['Competitive market', 'Requires initial investment']),
        recommendations: JSON.stringify(['Focus on MVP', 'Validate with early users', 'Build strategic partnerships']),
        marketAnalysis: 'This idea targets a growing market with significant potential for disruption.',
        competitorAnalysis: 'Several competitors exist, but differentiation opportunities are available.',
        riskAssessment: 'Moderate risk with manageable challenges through proper execution.',
    };
}

// Validation router
const validationRouter = t.router({
    analyzeIdea: protectedProcedure
        .input(ideaInputSchema)
        .mutation(async ({ ctx, input }) => {
            const ideaId = ideaIdCounter++;
            const idea = {
                id: ideaId,
                userId: ctx.user.id,
                title: input.title,
                description: input.description,
                createdAt: new Date(),
            };
            mockStore.ideas.push(idea);

            const analysisResult = generateMockAnalysis();
            const analysis = {
                id: analysisIdCounter++,
                ideaId,
                ...analysisResult,
                createdAt: new Date(),
            };
            mockStore.analyses.push(analysis);

            return { ...idea, analysis };
        }),

    getMyIdeas: protectedProcedure.query(({ ctx }) => {
        const userIdeas = mockStore.ideas.filter(i => i.userId === ctx.user.id);
        return userIdeas.map(idea => ({
            ...idea,
            analysis: mockStore.analyses.find(a => a.ideaId === idea.id) ?? null,
        }));
    }),

    getIdea: protectedProcedure
        .input(z.object({ ideaId: z.number() }))
        .query(({ ctx, input }) => {
            const idea = mockStore.ideas.find(i => i.id === input.ideaId);
            if (!idea) throw new TRPCError({ code: 'NOT_FOUND', message: 'Idea not found' });
            if (idea.userId !== ctx.user.id) throw new TRPCError({ code: 'FORBIDDEN', message: 'Unauthorized' });
            const analysis = mockStore.analyses.find(a => a.ideaId === idea.id);
            return { ...idea, analysis: analysis ?? null };
        }),

    deleteIdea: protectedProcedure
        .input(z.object({ ideaId: z.number() }))
        .mutation(({ ctx, input }) => {
            const idea = mockStore.ideas.find(i => i.id === input.ideaId);
            if (!idea) throw new TRPCError({ code: 'NOT_FOUND', message: 'Idea not found' });
            if (idea.userId !== ctx.user.id) throw new TRPCError({ code: 'FORBIDDEN', message: 'Unauthorized' });

            const ideaIndex = mockStore.ideas.findIndex(i => i.id === input.ideaId);
            if (ideaIndex > -1) mockStore.ideas.splice(ideaIndex, 1);

            const analysisIndex = mockStore.analyses.findIndex(a => a.ideaId === input.ideaId);
            if (analysisIndex > -1) mockStore.analyses.splice(analysisIndex, 1);

            return { success: true };
        }),
});

// Combined app router
const appRouter = t.router({
    auth: authRouter,
    validation: validationRouter,
});

// Vercel handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
    pendingCookies = [];

    try {
        // Parse session from cookies
        const cookies = parseCookies(req.headers.cookie || '');
        const sessionId = cookies['session'];
        const user = sessionId ? getUserByOpenId(sessionId) ?? null : null;

        // Build fetch request
        const url = new URL(req.url || '/', `https://${req.headers.host}`);
        const fetchRequest = new Request(url, {
            method: req.method,
            headers: req.headers as HeadersInit,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });

        // Handle with tRPC
        const response = await fetchRequestHandler({
            endpoint: '/api/trpc',
            req: fetchRequest,
            router: appRouter,
            createContext: (): Context => ({
                user,
                setCookie: setCookieHeader,
                clearCookie: clearCookieHeader,
            }),
            onError({ error, path }) {
                console.error(`[tRPC Error] ${path}:`, error);
            },
        });

        // Copy headers
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        // Set cookies
        if (pendingCookies.length > 0) {
            res.setHeader('Set-Cookie', pendingCookies);
        }

        // Send response
        res.status(response.status);
        const body = await response.text();
        res.send(body);

    } catch (error) {
        console.error('[API Error]:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
