import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { Box, LogOut, Plus, LayoutDashboard, User } from 'lucide-react';

export function Navbar() {
    const [location] = useLocation();
    const { data: user } = trpc.auth.me.useQuery();
    const logoutMutation = trpc.auth.logout.useMutation();
    const utils = trpc.useUtils();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        utils.auth.me.invalidate();
        window.location.href = '/';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/">
                        <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                                <Box className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg hidden sm:block">Validation Matrix</span>
                        </a>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button
                                        variant={location === '/dashboard' ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span className="hidden sm:inline">Dashboard</span>
                                    </Button>
                                </Link>
                                <Link href="/submit">
                                    <Button
                                        variant={location === '/submit' ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="hidden sm:inline">New Idea</span>
                                    </Button>
                                </Link>
                                <div className="w-px h-6 bg-border mx-2" />
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:inline">{user.name || 'User'}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button variant="gradient" size="sm">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
