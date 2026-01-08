import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ideaInputSchema, type IdeaInput } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Lightbulb, Sparkles } from 'lucide-react';

interface IdeaFormProps {
    onSubmit: (data: IdeaInput) => void;
    isLoading?: boolean;
}

export function IdeaForm({ onSubmit, isLoading = false }: IdeaFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IdeaInput>({
        resolver: zodResolver(ideaInputSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const insertExample = () => {
        const examples = [
            { title: "AI-Powered Personal Chef", description: "An app that creates recipes based on what's in your fridge using computer vision and suggests nutrition plans." },
            { title: "Solar Powered Water Purifier", description: "Portable hardware device for developing regions that uses UV light and heat to purify pond water." },
            { title: "Peer-to-Peer Tool Rental", description: "A marketplace where neighbors can rent drills, ladders, and lawnmowers to each other locally for a small fee." }
        ];
        const random = examples[Math.floor(Math.random() * examples.length)];
        setValue('title', random.title);
        setValue('description', random.description);
    };

    return (
        <Card className="glass-card border-white/10">
            <CardHeader className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Quick Validation</CardTitle>
                        <CardDescription>
                            Type your idea below. Our AI will conduct deep internal research.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="title">Idea Title</Label>
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs text-primary"
                                onClick={insertExample}
                                disabled={isLoading}
                            >
                                Try an example
                            </Button>
                        </div>
                        <Input
                            id="title"
                            placeholder="e.g., AI-Powered Task Manager for Remote Teams"
                            {...register('title')}
                            disabled={isLoading}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your idea in a few sentences..."
                            className="min-h-[160px]"
                            {...register('description')}
                            disabled={isLoading}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        variant="gradient"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>AI Conducting Deep Research...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span>Validate This Idea</span>
                            </>
                        )}
                    </Button>

                    {isLoading && (
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Claude is scanning market trends and resource requirements...
                            </p>
                            <div className="flex justify-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
