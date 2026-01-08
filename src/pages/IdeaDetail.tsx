import { Link, useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ScoreCard } from '@/components/ScoreCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ValidationMatrix3D } from '@/components/ValidationMatrix3D';
import { exportAnalysisToPDF, exportAnalysisToJSON } from '@/lib/exportPDF';
import { formatDate } from '@/lib/utils';
import {
    ArrowLeft,
    Download,
    FileJson,
    Loader2,
    Trash2,
    Calendar,
    Sparkles,
    Lightbulb,
    CheckCircle2,
    BarChart3
} from 'lucide-react';

export function IdeaDetail() {
    const params = useParams<{ id: string }>();
    const [, setLocation] = useLocation();
    const ideaId = parseInt(params.id || '0', 10);

    const { data: idea, isLoading, error } = trpc.validation.getIdea.useQuery(
        { ideaId },
        { enabled: ideaId > 0 }
    );

    const deleteMutation = trpc.validation.deleteIdea.useMutation({
        onSuccess: () => setLocation('/dashboard'),
    });

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
            await deleteMutation.mutateAsync({ ideaId });
        }
    };

    const handleExportPDF = () => {
        if (idea) {
            exportAnalysisToPDF(idea);
        }
    };

    const handleExportJSON = () => {
        if (idea) {
            exportAnalysisToJSON(idea);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading analysis...</p>
                </div>
            </div>
        );
    }

    if (error || !idea) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Card className="glass-card border-white/10 max-w-md w-full mx-4">
                    <CardContent className="py-12 text-center">
                        <h2 className="text-xl font-semibold mb-2">Idea not found</h2>
                        <p className="text-muted-foreground mb-6">
                            The idea you're looking for doesn't exist or you don't have access to it.
                        </p>
                        <Link href="/dashboard">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back & Actions */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-2">
                        <FileJson className="w-4 h-4" />
                        <span className="hidden sm:inline">JSON</span>
                    </Button>
                    <Button variant="gradient" size="sm" onClick={handleExportPDF} className="gap-2">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Idea Header */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <Card className="glass-card border-white/10 h-full">
                    <CardHeader className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Submitted {formatDate(idea.createdAt)}</span>
                        </div>
                        <h1 className="text-3xl font-bold">{idea.title}</h1>
                        <p className="text-lg text-muted-foreground">{idea.description}</p>
                    </CardHeader>
                </Card>

                <div className="h-[300px] lg:h-auto min-h-[300px] relative">
                    {idea.analysis && (
                        <ValidationMatrix3D
                            ideas={[{
                                id: idea.id,
                                title: idea.title,
                                timeScore: idea.analysis.timeScore,
                                moneyScore: idea.analysis.moneyScore,
                                opportunityScore: idea.analysis.opportunityScore
                            }]}
                            selectedId={idea.id}
                        />
                    )}
                </div>
            </div>

            {idea.analysis ? (
                <>
                    {/* Scores Grid */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <ScoreCard
                            type="time"
                            score={idea.analysis.timeScore}
                            analysis={idea.analysis.timeAnalysis}
                        />
                        <ScoreCard
                            type="money"
                            score={idea.analysis.moneyScore}
                            analysis={idea.analysis.moneyAnalysis}
                        />
                        <ScoreCard
                            type="opportunity"
                            score={idea.analysis.opportunityScore}
                            analysis={idea.analysis.opportunityAnalysis}
                        />
                    </div>

                    {/* Overall Recommendation */}
                    <Card className="glass-card border-white/10 glow-border mb-8">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold">Overall Recommendation</h2>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {idea.analysis.overallRecommendation}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Logical Reasoning & Validations */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <Card className="glass-card border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <Lightbulb className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold">Logical Reasoning</h2>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                                    {idea.analysis.logicalReasoning || "Detailed logical map being generated..."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-white/10">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold">Market Validations</h2>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                                    {idea.analysis.validations || "Searching for market proof points..."}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Summary */}
                    <div className="mt-8 p-6 rounded-xl bg-card/50 border border-white/10">
                        <h3 className="font-semibold mb-4">Quick Summary</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className={`text-2xl font-bold ${idea.analysis.timeScore <= 33 ? 'text-green-400' :
                                    idea.analysis.timeScore <= 66 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {idea.analysis.timeScore <= 33 ? 'Quick' :
                                        idea.analysis.timeScore <= 66 ? 'Moderate' : 'Long'}
                                </div>
                                <div className="text-sm text-muted-foreground">Time to Build</div>
                            </div>
                            <div>
                                <div className={`text-2xl font-bold ${idea.analysis.moneyScore <= 33 ? 'text-green-400' :
                                    idea.analysis.moneyScore <= 66 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {idea.analysis.moneyScore <= 33 ? 'Low' :
                                        idea.analysis.moneyScore <= 66 ? 'Medium' : 'High'}
                                </div>
                                <div className="text-sm text-muted-foreground">Investment</div>
                            </div>
                            <div>
                                <div className={`text-2xl font-bold ${idea.analysis.opportunityScore >= 66 ? 'text-green-400' :
                                    idea.analysis.opportunityScore >= 33 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {idea.analysis.opportunityScore >= 66 ? 'High' :
                                        idea.analysis.opportunityScore >= 33 ? 'Medium' : 'Low'}
                                </div>
                                <div className="text-sm text-muted-foreground">Opportunity</div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <Card className="glass-card border-white/10">
                    <CardContent className="py-12 text-center">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Analysis in progress...</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
