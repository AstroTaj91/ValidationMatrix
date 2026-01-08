import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Get score color based on value and direction
 */
export function getScoreColor(score: number, higherIsBetter: boolean): string {
    const normalized = higherIsBetter ? score : 100 - score;

    if (normalized >= 70) return 'text-green-400';
    if (normalized >= 40) return 'text-yellow-400';
    return 'text-red-400';
}

/**
 * Get score label based on value and type
 */
export function getScoreLabel(score: number, type: 'time' | 'money' | 'opportunity'): string {
    const higherIsBetter = type === 'opportunity';
    const normalized = higherIsBetter ? score : 100 - score;

    if (normalized >= 75) return 'Excellent';
    if (normalized >= 50) return 'Good';
    if (normalized >= 25) return 'Fair';
    return 'Challenging';
}
