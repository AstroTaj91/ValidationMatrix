import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Users table - stores authenticated users
 */
export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Ideas table - business ideas submitted by users
 */
export const ideas = mysqlTable("ideas", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = typeof ideas.$inferInsert;

/**
 * Analyses table - AI-generated analysis results for each idea
 * 
 * Scoring System:
 * - Time Score (1-100): Lower is better - shorter time to market
 * - Money Score (1-100): Lower is better - lower investment required
 * - Opportunity Score (1-100): Higher is better - larger market potential
 */
export const analyses = mysqlTable("analyses", {
    id: int("id").autoincrement().primaryKey(),
    ideaId: int("ideaId").notNull().references(() => ideas.id, { onDelete: "cascade" }),
    timeScore: int("timeScore").notNull(),
    moneyScore: int("moneyScore").notNull(),
    opportunityScore: int("opportunityScore").notNull(),
    timeAnalysis: text("timeAnalysis").notNull(),
    moneyAnalysis: text("moneyAnalysis").notNull(),
    opportunityAnalysis: text("opportunityAnalysis").notNull(),
    logicalReasoning: text("logicalReasoning").notNull(),
    validations: text("validations").notNull(),
    overallRecommendation: text("overallRecommendation").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;

/**
 * Combined type for idea with its analysis
 */
export type IdeaWithAnalysis = Idea & { analysis: Analysis | null };
