import { cn } from '@/lib/utils';
import { Clock, DollarSign, TrendingUp } from 'lucide-react';

interface ScoreCardProps {
    type: 'time' | 'money' | 'opportunity';
    score: number;
    analysis?: string;
    compact?: boolean;
}

const config = {
    time: {
        label: 'Time',
        icon: Clock,
        description: 'Lower is better',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        barClass: 'score-bar-time',
    },
    money: {
        label: 'Money',
        icon: DollarSign,
        description: 'Lower is better',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        barClass: 'score-bar-money',
    },
    opportunity: {
        label: 'Opportunity',
        icon: TrendingUp,
        description: 'Higher is better',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        barClass: 'score-bar-opportunity',
    },
};

export function ScoreCard({ type, score, analysis, compact = false }: ScoreCardProps) {
    const { label, icon: Icon, description, color, bgColor, barClass } = config[type];

    // For time/money, lower is better. For opportunity, higher is better.
    const normalizedScore = type === 'opportunity' ? score : 100 - score;

    const getGrade = () => {
        if (normalizedScore >= 75) return { text: 'Excellent', class: 'text-green-400' };
        if (normalizedScore >= 50) return { text: 'Good', class: 'text-blue-400' };
        if (normalizedScore >= 25) return { text: 'Fair', class: 'text-yellow-400' };
        return { text: 'Challenging', class: 'text-red-400' };
    };

    const grade = getGrade();

    if (compact) {
        return (
            <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', bgColor)}>
                    <Icon className={cn('w-4 h-4', color)} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className={cn('font-bold', color)}>{score}</span>
                    </div>
                    <div className={cn('score-bar', barClass)}>
                        <div
                            className="score-bar-fill"
                            style={{ width: `${score}%` }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn('p-3 rounded-xl', bgColor)}>
                        <Icon className={cn('w-6 h-6', color)} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{label}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={cn('text-3xl font-bold', color)}>{score}</div>
                    <div className={cn('text-sm font-medium', grade.class)}>{grade.text}</div>
                </div>
            </div>

            <div className={cn('score-bar', barClass)}>
                <div
                    className="score-bar-fill"
                    style={{ width: `${score}%` }}
                />
            </div>

            {analysis && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis}
                </p>
            )}
        </div>
    );
}
