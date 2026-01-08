import { z } from 'zod';

/**
 * Zod schema for idea validation input
 */
export const ideaInputSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

export type IdeaInput = z.infer<typeof ideaInputSchema>;

/**
 * Analysis result from the AI
 */
export interface AnalysisResult {
    timeScore: number;
    moneyScore: number;
    opportunityScore: number;
    timeAnalysis: string;
    moneyAnalysis: string;
    opportunityAnalysis: string;
    logicalReasoning: string;
    validations: string;
    overallRecommendation: string;
}

/**
 * Point representation for 3D visualization
 */
export interface IdeaPoint {
    id: number;
    title: string;
    timeScore: number;
    moneyScore: number;
    opportunityScore: number;
}

/**
 * Calculate 3D position from scores
 * - Time (X): Score 1 → X=0 (best), Score 100 → X=100 (worst)
 * - Money (Y): Score 1 → Y=0 (best), Score 100 → Y=100 (worst)
 * - Opportunity (Z): Score 1 → Z=0 (worst), Score 100 → Z=100 (best)
 */
export function calculatePosition(point: IdeaPoint): [number, number, number] {
    return [
        point.timeScore,        // Lower score = closer to origin (good)
        point.moneyScore,       // Lower score = closer to origin (good)
        point.opportunityScore  // Higher score = further from origin (good)
    ];
}

/**
 * App constants
 */
export const APP_NAME = 'Validation Matrix';
export const APP_DESCRIPTION = 'AI-powered business idea analysis with interactive 3D visualization';
