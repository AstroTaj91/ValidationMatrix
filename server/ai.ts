import OpenAI from 'openai';
import type { AnalysisResult } from '../shared/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

const ANALYSIS_SYSTEM_PROMPT = `You are a world-class market research expert and business validator. Your task is to perform a deep "Internal Research" scan of your knowledge base to analyze business ideas across three critical dimensions.

When providing analysis, draw upon historical trends, current market patterns, technological trajectories, and competitive dynamics. Be objective, critical, and insightful.

## Scoring Dimensions

### Time Score (1-100, LOWER is better)
Represents the estimated time to bring the idea to MVP using modern AI-accelerated dev workflows.
Score guide:
- 1-25: Quick to build (weeks to 1 month). Standard stack, clear requirements.
- 26-50: Moderate complexity (2-4 months). Requires custom integrations or specific expertise.
- 51-75: Significant effort (5-9 months). Complex logic, many integrations, or heavy regulation.
- 76-100: Extreme R&D (10+ months). New algorithms, hardware, or deep legal hurdles.

### Money Score (1-100, LOWER is better)
Represents the total investment required for dev, infrastructure, and early growth.
Score guide:
- 1-25: Bootstrap-friendly (<$15k). Mostly digital, low initial overhead.
- 26-50: Small seed-level ($20k-$150k). Marketing focus, basic team costs.
- 51-75: Series A level ($150k-$750k). Hiring specialized talent, inventory, or heavy cloud costs.
- 76-100: Capital intensive ($1M+). R&D, physical space, large-scale hardware, or complex data needs.

### Opportunity Score (1-100, HIGHER is better)
Represents market potential, demand signals, and competitive moats.
Score guide:
- 1-25: Niche, saturated, or declining market with low demand.
- 26-50: Solid market but high competition or low differentiation.
- 51-75: High growth potential, clear USP, strong market tailwinds.
- 76-100: Foundational disruption, massive TAM, or clear blue ocean opportunity.

## Output Requirements
Provide your analysis as a JSON object with exactly these fields:
- timeScore: integer 1-100
- moneyScore: integer 1-100
- opportunityScore: integer 1-100
- timeAnalysis: detailed paragraph explaining the time score including tech stack assumptions
- moneyAnalysis: detailed paragraph explaining the money score including capital allocation breakdown
- opportunityAnalysis: detailed paragraph explaining the opportunity score including competitive landscape and demand signals
- logicalReasoning: A detailed section (2-3 paragraphs) explaining the "Why" behind the specific scores. Break down the logic used to arrive at the feasibility vs potential balance.
- validations: A bulleted list of 3-5 specific validations or market proof points that justify the analysis (e.g., similar successful pivots, consumer spending trends, or technological benchmarks).
- overallRecommendation: summary paragraph with go/no-go recommendation and key strategic next steps

IMPORTANT: Return ONLY the raw JSON object. No Markdown blocks, no commentary.`;

/**
 * Analyze a business idea using OpenAI or Mock
 */
export async function analyzeIdeaWithAI(
    title: string,
    description: string
): Promise<AnalysisResult> {
    if (!process.env.OPENAI_API_KEY) {
        console.log('[AI] Running in Mock Mode (OpenAI Key Missing)');
        // Simulate research delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const timeScore = Math.floor(Math.random() * 80) + 10;
        const moneyScore = Math.floor(Math.random() * 80) + 10;
        const opportunityScore = Math.floor(Math.random() * 80) + 20;

        return {
            timeScore,
            moneyScore,
            opportunityScore,
            timeAnalysis: `Based on an internal GPT-scan of existing MVPs for "${title}", the development effort is estimated at ${timeScore}/100. This assumes a modern stack (Next.js/Node.js) and the use of specialized libraries. The main bottleneck will be the custom ${description.length > 50 ? 'complex logic' : 'integration layer'}.`,
            moneyAnalysis: `Capital requirements are estimated at ${moneyScore}/100. This reflects the ${moneyScore > 50 ? 'high' : 'low'} infrastructure costs and the need for ${moneyScore > 50 ? 'significant marketing spend' : 'organic growth'}. Estimated initial burn: $${moneyScore * 500}/month.`,
            opportunityAnalysis: `Market opportunity for "${title}" is scored at ${opportunityScore}/100. We identified strong demand signals in this niche. Competitive moats can be built through ${description.includes('AI') ? 'proprietary data sets' : 'superior user experience'}.`,
            logicalReasoning: `The core reasoning for these scores stems from the transition in the ${title.split(' ')[0]} sector toward ${description.includes('AI') ? 'automation' : 'decentralization'}. We've weighted the ease of development against the high cost of user acquisition in this saturated market. The Time score is particularly low because existing frameworks can handle 70% of the proposed functional logic. However, the Money score reflects the substantial 'cold start' problem typical for platform-based ideas.`,
            validations: `- Benchmark: Similar MVPs in the ${title} space have launched within 12-16 weeks.\n- Market Signal: Recent 24% increase in search volume for ${title.split(' ')[0]} related solutions.\n- Capital Check: Seed rounds for comparable startups averaged $1.2M in the last 18 months.\n- FEA (Feasibility): Open-source APIs now exist that reduce custom development needs by roughly 40%.`,
            overallRecommendation: `GO RECOMMENDATION: This idea shows a favorable balance between feasibility and potential. Focus on building the core ${title.split(' ')[0]} feature first to validate the ${opportunityScore > 50 ? 'high' : 'moderate'} market interest.`,
        };
    }

    const userPrompt = `Analyze this business idea:

**Title:** ${title}

**Description:** ${description}

Provide your analysis as a JSON object following the specified schema.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: ANALYSIS_SYSTEM_PROMPT,
            },
            {
                role: 'user',
                content: userPrompt,
            },
        ],
        response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(content) as AnalysisResult;
    return analysis;
}
