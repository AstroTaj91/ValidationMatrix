import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './trpc';
import { ideaInputSchema } from '../shared/types';
import {
    createIdea,
    createAnalysis,
    getIdeaById,
    getUserIdeasWithAnalyses,
    getIdeaWithAnalysis,
    deleteIdea,
    upsertUser,
    getUserByOpenId,
} from './db';
import { analyzeIdeaWithAI } from './ai';

/**
 * Auth router - handles authentication
 */
const authRouter = router({
    /**
     * Get current user
     */
    me: publicProcedure.query(({ ctx }) => {
        return ctx.user;
    }),

    /**
     * Demo login - creates a demo user session
     * In production, replace with proper OAuth flow
     */
    demoLogin: publicProcedure.mutation(async ({ ctx }) => {
        const demoOpenId = 'demo-user-' + Date.now();

        await upsertUser({
            openId: demoOpenId,
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'user',
        });

        const user = await getUserByOpenId(demoOpenId);

        // Set session cookie (simplified for demo)
        ctx.res.cookie('session', demoOpenId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return { success: true, user };
    }),

    /**
     * Logout - clears session
     */
    logout: publicProcedure.mutation(({ ctx }) => {
        ctx.res.clearCookie('session');
        return { success: true };
    }),
});

/**
 * Validation router - handles idea submission and analysis
 */
const validationRouter = router({
    /**
     * Submit a new idea and run AI analysis
     */
    analyzeIdea: protectedProcedure
        .input(ideaInputSchema)
        .mutation(async ({ ctx, input }) => {
            // Create the idea record
            const ideaId = await createIdea({
                userId: ctx.user.id,
                title: input.title,
                description: input.description,
            });

            // Run AI analysis
            const analysisResult = await analyzeIdeaWithAI(input.title, input.description);

            // Save analysis to database
            await createAnalysis({
                ideaId,
                ...analysisResult,
            });

            // Return the complete idea with analysis
            const ideaWithAnalysis = await getIdeaWithAnalysis(ideaId);
            return ideaWithAnalysis;
        }),

    /**
     * Get all ideas for the current user with their analyses
     */
    getMyIdeas: protectedProcedure.query(async ({ ctx }) => {
        return await getUserIdeasWithAnalyses(ctx.user.id);
    }),

    /**
     * Get a specific idea with its analysis
     */
    getIdea: protectedProcedure
        .input(z.object({ ideaId: z.number() }))
        .query(async ({ ctx, input }) => {
            const idea = await getIdeaWithAnalysis(input.ideaId);

            if (!idea) {
                throw new Error('Idea not found');
            }

            // Verify ownership
            if (idea.userId !== ctx.user.id) {
                throw new Error('Unauthorized');
            }

            return idea;
        }),

    /**
     * Delete an idea (cascades to delete analysis)
     */
    deleteIdea: protectedProcedure
        .input(z.object({ ideaId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const idea = await getIdeaById(input.ideaId);

            if (!idea) {
                throw new Error('Idea not found');
            }

            if (idea.userId !== ctx.user.id) {
                throw new Error('Unauthorized');
            }

            await deleteIdea(input.ideaId);
            return { success: true };
        }),
});

/**
 * Main app router combining all sub-routers
 */
export const appRouter = router({
    auth: authRouter,
    validation: validationRouter,
});

export type AppRouter = typeof appRouter;
