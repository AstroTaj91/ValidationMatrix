import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ValidationMatrix3D } from '@/components/ValidationMatrix3D';
import {
    Box,
    Sparkles,
    Clock,
    DollarSign,
    TrendingUp,
    ArrowRight,
    Zap,
    BarChart3,
    Download,
    CheckCircle2,
    Search
} from 'lucide-react';

const demoIdeas = [
    { id: 1, title: 'AI SaaS', timeScore: 20, moneyScore: 15, opportunityScore: 85 },
    { id: 2, title: 'BioTech Hardware', timeScore: 80, moneyScore: 90, opportunityScore: 95 },
    { id: 3, title: 'Local Bakery', timeScore: 40, moneyScore: 30, opportunityScore: 45 },
    { id: 4, title: 'E-commerce Plugin', timeScore: 15, moneyScore: 10, opportunityScore: 60 },
];

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Analysis',
        description: 'Claude AI evaluates your idea across Time, Money, and Opportunity dimensions with detailed insights.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
    },
    {
        icon: Box,
        title: '3D Visualization',
        description: 'See your ideas plotted in an interactive 3D space. Compare multiple concepts at a glance.',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
    },
    {
        icon: Download,
        title: 'Export Reports',
        description: 'Download professional PDF reports to share with investors, partners, or your team.',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
    },
];

const dimensions = [
    {
        icon: Clock,
        title: 'Time',
        description: 'How long to build an MVP with current technology and AI tools',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        note: 'Lower is Better',
    },
    {
        icon: DollarSign,
        title: 'Money',
        description: 'Total investment required for development, infrastructure, and launch',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        note: 'Lower is Better',
    },
    {
        icon: TrendingUp,
        title: 'Opportunity',
        description: 'Market size, demand signals, and competitive positioning',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        note: 'Higher is Better',
    },
];

const benefits = [
    'Instant AI analysis in under 30 seconds',
    'Compare multiple ideas side-by-side',
    'Data-driven decision making',
    'Professional export reports',
    'Track idea history over time',
];

export function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden pt-20">
                {/* Background effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Advanced AI Market Intelligence</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
                                Visualize Success <br />
                                <span className="gradient-text">Before the Code</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-xl text-muted-foreground mb-10 max-w-xl">
                                The Validation Matrix uses Claude AI to research and score your business ideas across critical dimensions. Instant analysis, interactive 3D mapping, and investor-ready reports.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link href="/login">
                                    <Button size="xl" variant="gradient" className="gap-2 w-full sm:w-auto">
                                        <span>Analyze Your Idea</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Button size="xl" variant="outline" className="w-full sm:w-auto" onClick={() => {
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}>
                                    How it Works
                                </Button>
                            </div>

                            {/* Research Badge */}
                            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground bg-white/5 w-fit px-4 py-2 rounded-lg border border-white/10">
                                <Search className="w-4 h-4 text-blue-400" />
                                <span>Powered by Claude AI Deep Internal Research</span>
                            </div>
                        </div>

                        <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                <ValidationMatrix3D ideas={demoIdeas} />
                            </div>
                            {/* Floating accents */}
                            <div className="absolute -top-6 -right-6 glass-card p-4 animate-bounce duration-[3000ms]">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <span className="text-sm font-semibold">High Potential</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-card/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to Validate Ideas
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Stop guessing. Start validating with AI-powered analysis and stunning visualizations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {features.map((feature, i) => (
                            <Card key={i} className="glass-card border-white/10 hover:border-white/20 transition-colors">
                                <CardContent className="p-8">
                                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                                        <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dimensions Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Three Dimensions of Validation
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Every idea is analyzed across three critical factors that determine success.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {dimensions.map((dim, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Card className="glass-card border-white/10 relative overflow-hidden">
                                    <CardContent className="p-8">
                                        <div className={`w-16 h-16 rounded-2xl ${dim.bg} flex items-center justify-center mb-6`}>
                                            <dim.icon className={`w-8 h-8 ${dim.color}`} />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{dim.title}</h3>
                                        <p className={`text-sm font-medium ${dim.color} mb-4`}>{dim.note}</p>
                                        <p className="text-muted-foreground">{dim.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-card/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                    Make Better Decisions, Faster
                                </h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Stop wasting time and money on ideas that won't work.
                                    Get instant validation powered by advanced AI analysis.
                                </p>
                                <ul className="space-y-4">
                                    {benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                    <Box className="w-32 h-32 text-primary/30 float-animation" />
                                </div>
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/20 rounded-full blur-2xl" />
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Validate Your Idea?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-10">
                            Join entrepreneurs and innovators using AI to make smarter decisions.
                        </p>
                        <Link href="/login">
                            <Button size="xl" variant="gradient" className="gap-2">
                                <span>Get Started Free</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                                <Box className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold">Validation Matrix</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Validation Matrix. AI-powered idea validation.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
