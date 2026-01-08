import { Route, Switch, Redirect } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { SubmitIdea } from '@/pages/SubmitIdea';
import { IdeaDetail } from '@/pages/IdeaDetail';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

/**
 * Protected route wrapper - redirects to login if not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = trpc.auth.me.useQuery();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Redirect to="/login" />;
    }

    return <>{children}</>;
}

/**
 * Public route wrapper - redirects to dashboard if already authenticated
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = trpc.auth.me.useQuery();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (user) {
        return <Redirect to="/dashboard" />;
    }

    return <>{children}</>;
}

export default function App() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-16">
                <Switch>
                    {/* Public routes */}
                    <Route path="/">
                        <Home />
                    </Route>

                    <Route path="/login">
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    </Route>

                    {/* Protected routes */}
                    <Route path="/dashboard">
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    </Route>

                    <Route path="/submit">
                        <ProtectedRoute>
                            <SubmitIdea />
                        </ProtectedRoute>
                    </Route>

                    <Route path="/idea/:id">
                        <ProtectedRoute>
                            <IdeaDetail />
                        </ProtectedRoute>
                    </Route>

                    {/* 404 fallback */}
                    <Route>
                        <div className="min-h-[80vh] flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold mb-4">404</h1>
                                <p className="text-muted-foreground mb-8">Page not found</p>
                                <a href="/" className="text-primary hover:underline">
                                    Go home
                                </a>
                            </div>
                        </div>
                    </Route>
                </Switch>
            </main>
        </div>
    );
}
