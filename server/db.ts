import { eq, desc } from 'drizzle-orm';
import {
    users, ideas, analyses,
    type InsertUser, type InsertIdea, type InsertAnalysis,
    type IdeaWithAnalysis
} from '../drizzle/schema';

// Mock store for demonstration mode (when DATABASE_URL is missing)
const mockStore = {
    users: [] as any[],
    ideas: [] as any[],
    analyses: [] as any[],
};

let db: any = null;

/**
 * Initialize database connection pool
 */
export async function getDb(): Promise<any> {
    if (db) return db;

    if (process.env.DATABASE_URL) {
        try {
            console.log('[Database] Connecting to MySQL...');
            const { drizzle } = await import('drizzle-orm/mysql2');
            const mysql = (await import('mysql2/promise')).default;

            const pool = mysql.createPool(process.env.DATABASE_URL);
            db = drizzle(pool);
            console.log('[Database] Connected successfully');
        } catch (error) {
            console.error('[Database] Failed to connect:', error);
            db = null;
        }
    } else {
        console.log('[Database] No DATABASE_URL provided, using mock store');
    }
    return db;
}

/**
 * User operations
 */
export async function upsertUser(user: InsertUser): Promise<void> {
    const database = await getDb();
    if (!database) {
        const existing = mockStore.users.find(u => u.openId === user.openId);
        if (existing) {
            existing.name = user.name ?? existing.name;
            existing.email = user.email ?? existing.email;
        } else {
            mockStore.users.push({ ...user, id: mockStore.users.length + 1 });
        }
        return;
    }

    const values: InsertUser = {
        openId: user.openId,
        name: user.name ?? null,
        email: user.email ?? null,
        role: user.role ?? 'user',
    };

    await database.insert(users).values(values).onDuplicateKeyUpdate({
        set: { name: values.name, email: values.email },
    });
}

export async function getUserByOpenId(openId: string) {
    const database = await getDb();
    if (!database) {
        return mockStore.users.find(u => u.openId === openId);
    }

    const result = await database.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result[0];
}

export async function getUserById(id: number) {
    const database = await getDb();
    if (!database) {
        return mockStore.users.find(u => u.id === id);
    }

    const result = await database.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
}

/**
 * Idea operations
 */
export async function createIdea(idea: InsertIdea): Promise<number> {
    const database = await getDb();
    if (!database) {
        const id = mockStore.ideas.length + 1;
        mockStore.ideas.push({ ...idea, id, createdAt: new Date() });
        return id;
    }

    const [result] = await database.insert(ideas).values(idea);
    return result.insertId;
}

export async function getUserIdeas(userId: number) {
    const database = await getDb();
    if (!database) {
        return mockStore.ideas
            .filter(i => i.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return await database
        .select()
        .from(ideas)
        .where(eq(ideas.userId, userId))
        .orderBy(desc(ideas.createdAt));
}

export async function getIdeaById(ideaId: number) {
    const database = await getDb();
    if (!database) {
        return mockStore.ideas.find(i => i.id === ideaId);
    }

    const result = await database.select().from(ideas).where(eq(ideas.id, ideaId)).limit(1);
    return result[0];
}

export async function deleteIdea(ideaId: number): Promise<void> {
    const database = await getDb();
    if (!database) {
        mockStore.ideas = mockStore.ideas.filter(i => i.id !== ideaId);
        mockStore.analyses = mockStore.analyses.filter(a => a.ideaId !== ideaId);
        return;
    }

    await database.delete(ideas).where(eq(ideas.id, ideaId));
}

/**
 * Analysis operations
 */
export async function createAnalysis(analysis: InsertAnalysis): Promise<number> {
    const database = await getDb();
    if (!database) {
        const id = mockStore.analyses.length + 1;
        mockStore.analyses.push({ ...analysis, id, createdAt: new Date() });
        return id;
    }

    const [result] = await database.insert(analyses).values(analysis);
    return result.insertId;
}

export async function getAnalysisByIdeaId(ideaId: number) {
    const database = await getDb();
    if (!database) {
        return mockStore.analyses.find(a => a.ideaId === ideaId);
    }

    const result = await database
        .select()
        .from(analyses)
        .where(eq(analyses.ideaId, ideaId))
        .limit(1);
    return result[0];
}

/**
 * Combined operations
 */
export async function getUserIdeasWithAnalyses(userId: number): Promise<IdeaWithAnalysis[]> {
    const database = await getDb();
    if (!database) {
        const userIdeas = mockStore.ideas.filter(i => i.userId === userId);
        return userIdeas.map(idea => ({
            ...idea,
            analysis: mockStore.analyses.find(a => a.ideaId === idea.id) ?? null
        }));
    }

    const userIdeas = await database
        .select()
        .from(ideas)
        .where(eq(ideas.userId, userId))
        .orderBy(desc(ideas.createdAt));

    const ideasWithAnalyses = await Promise.all(
        userIdeas.map(async (idea) => {
            const analysis = await getAnalysisByIdeaId(idea.id);
            return { ...idea, analysis: analysis ?? null };
        })
    );

    return ideasWithAnalyses;
}

export async function getIdeaWithAnalysis(ideaId: number): Promise<IdeaWithAnalysis | null> {
    const idea = await getIdeaById(ideaId);
    if (!idea) return null;

    const analysis = await getAnalysisByIdeaId(ideaId);
    return { ...idea as any, analysis: analysis ?? null };
}
