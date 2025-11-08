"use client"

import { LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePuterStore } from "@/lib/puter"

export function Nav() {
    const { auth } = usePuterStore()

    const handleAuth = async () => {
        if (auth.isAuthenticated) {
            await auth.signOut()
        } else {
            await auth.signIn()
        }
    }

    return (
        <nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-primary">Selah.</h1>
                    </div>

                    {/* Auth Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleAuth}
                        className="text-muted-foreground hover:text-foreground"
                        title={auth.isAuthenticated ? "Sign Out" : "Sign In"}
                    >
                        {auth.isAuthenticated ? (
                            <LogOut className="h-5 w-5" />
                        ) : (
                            <LogIn className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>
        </nav>
    )
}
