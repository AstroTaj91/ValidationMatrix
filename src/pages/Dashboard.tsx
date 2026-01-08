import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ValidationMatrix3D } from '@/components/ValidationMatrix3D';
import { ScoreCard } from '@/components/ScoreCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import {
    Plus,
    Loader2,
    Trash2,
    ExternalLink,
    Clock,
    DollarSign,
    TrendingUp,
    LayoutGrid,
    List,
    Box
} from 'lucide-react';
import type { IdeaPoint } from '@shared/types';

export function Dashboard() {
    const [, setLocation] = useLocation();
    const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const { data: ideas, isLoading, refetch } = trpc.validation.getMyIdeas.useQuery();
    const deleteMutation = trpc.validation.deleteIdea.useMutation({
        onSuccess: () => refetch(),
    });

    const handleDelete = async (ideaId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this idea?')) {
            await deleteMutation.mutateAsync({ ideaId });
        }
    };

    // Transform ideas for 3D visualization
    const ideaPoints: IdeaPoint[] = (ideas || [])
        .filter(idea => idea.analysis)
        .map(idea => ({
            id: idea.id,
            title: idea.title,
            timeScore: idea.analysis!.timeScore,
            moneyScore: idea.analysis!.moneyScore,
            opportunityScore: idea.analysis!.opportunityScore,
        }));

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading your ideas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Your Validation Matrix</h1>
                    <p className="text-muted-foreground">
                        {ideas?.length || 0} idea{ideas?.length !== 1 ? 's' : ''} validated
                    </p>
                </div>
                <Link href="/submit">
                    <Button variant="gradient" className="gap-2">
                        <Plus className="w-5 h-5" />
                        <span>New Idea</span>
                    </Button>
                </Link>
            </div>

            {ideas && ideas.length > 0 ? (
                <>
                    {/* 3D Visualization */}
                    <Card className="glass-card border-white/10 mb-8">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Box className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>3D Visualization</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Click on a point to view details • Drag to rotate • Scroll to zoom
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[500px] relative">
                                <ValidationMatrix3D
                                    ideas={ideaPoints}
                                    onIdeaClick={(id) => setLocation(`/idea/${id}`)}
                                    selectedId={selectedIdea}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ideas List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">All Ideas</h2>
                            <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className={cn(
                            viewMode === 'grid'
                                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'
                                : 'space-y-3'
                        )}>
                            {ideas.map((idea) => (
                                <Card
                                    key={idea.id}
                                    className={cn(
                                        'glass-card border-white/10 cursor-pointer transition-all hover:border-white/20',
                                        selectedIdea === idea.id && 'ring-2 ring-primary'
                                    )}
                                    onClick={() => setLocation(`/idea/${idea.id}`)}
                                    onMouseEnter={() => setSelectedIdea(idea.id)}
                                    onMouseLeave={() => setSelectedIdea(null)}
                                >
                                    <CardContent className={cn(
                                        'p-4',
                                        viewMode === 'list' && 'flex items-center justify-between'
                                    )}>
                                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold line-clamp-1">{idea.title}</h3>
                                                {viewMode === 'grid' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-muted-foreground hover:text-destructive -mt-1 -mr-2"
                                                        onClick={(e) => handleDelete(idea.id, e)}
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {idea.description}
                                            </p>

                                            {idea.analysis && (
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-red-400" />
                                                        <span>{idea.analysis.timeScore}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
                                                        <span>{idea.analysis.moneyScore}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                                                        <span>{idea.analysis.opportunityScore}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-xs text-muted-foreground mt-3">
                                                {formatDate(idea.createdAt)}
                                            </p>
                                        </div>

                                        {viewMode === 'list' && (
                                            <div className="flex items-center gap-2 ml-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={(e) => handleDelete(idea.id, e)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                /* Empty State */
                <Card className="glass-card border-white/10">
                    <CardContent className="py-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <Box className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">No ideas yet</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Submit your first business idea to see it visualized in 3D
                            with AI-powered analysis across Time, Money, and Opportunity dimensions.
                        </p>
                        <Link href="/submit">
                            <Button variant="gradient" size="lg" className="gap-2">
                                <Plus className="w-5 h-5" />
                                <span>Submit Your First Idea</span>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
