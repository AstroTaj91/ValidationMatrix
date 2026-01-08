import { useLocation } from 'wouter';
import { IdeaForm } from '@/components/IdeaForm';
import { trpc } from '@/lib/trpc';
import type { IdeaInput } from '@shared/types';

export function SubmitIdea() {
    const [, setLocation] = useLocation();
    const analyzeMutation = trpc.validation.analyzeIdea.useMutation();
    const utils = trpc.useUtils();

    const handleSubmit = async (data: IdeaInput) => {
        const result = await analyzeMutation.mutateAsync(data);
        await utils.validation.getMyIdeas.invalidate();
        if (result) {
            setLocation(`/idea/${result.id}`);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                {/* Tips Panel */}
                <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <h3 className="font-medium mb-2">Tips for better analysis</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Be specific about the problem your idea solves</li>
                        <li>• Describe your target audience clearly</li>
                        <li>• Mention any unique features or differentiators</li>
                        <li>• Include information about competitors if known</li>
                    </ul>
                </div>

                {/* Form */}
                <IdeaForm onSubmit={handleSubmit} isLoading={analyzeMutation.isPending} />

                {/* Error Display */}
                {analyzeMutation.error && (
                    <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                        <p className="font-medium">Analysis failed</p>
                        <p className="text-sm mt-1">{analyzeMutation.error.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
