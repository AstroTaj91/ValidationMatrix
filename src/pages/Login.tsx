import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Box, Loader2, Sparkles } from 'lucide-react';

export function Login() {
    const [, setLocation] = useLocation();
    const demoLoginMutation = trpc.auth.demoLogin.useMutation();
    const utils = trpc.useUtils();

    const handleDemoLogin = async () => {
        await demoLoginMutation.mutateAsync();
        await utils.auth.me.invalidate();
        setLocation('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 hero-bg">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="absolute top-1/3 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />

            <Card className="w-full max-w-md glass-card border-white/10 relative z-10">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 w-fit">
                        <Box className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Welcome to Validation Matrix</CardTitle>
                        <CardDescription className="mt-2">
                            AI-powered business idea validation with 3D visualization
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="gradient"
                        size="lg"
                        className="w-full gap-2"
                        onClick={handleDemoLogin}
                        disabled={demoLoginMutation.isPending}
                    >
                        {demoLoginMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span>Continue with Demo Account</span>
                            </>
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Demo Mode
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-center text-muted-foreground">
                        Click above to start with a demo account. Your ideas and analyses will be saved.
                    </p>

                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                        <h4 className="font-medium text-sm mb-2">What you can do:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Submit business ideas for AI analysis</li>
                            <li>• View interactive 3D visualization</li>
                            <li>• Download PDF analysis reports</li>
                            <li>• Track your idea history</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
