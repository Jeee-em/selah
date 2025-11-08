"use client"

import { usePuterStore } from "@/lib/puter"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, LogIn, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const Auth = () => {
    const { isLoading, auth } = usePuterStore()
    const router = useRouter()
    const searchParams = useSearchParams()

    // read `next` from query params for redirect after auth, default to root
    const nextPath = (searchParams?.get("next") as string) || "/"

    useEffect(() => {
        if (auth?.isAuthenticated) {
            // navigate to requested next path
            router.push(nextPath)
        }
    }, [auth?.isAuthenticated, nextPath, router])

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Logo and Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold text-primary">Selah</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Find peace and comfort in God's word
                    </p>
                </motion.div>

                {/* Auth Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl"
                >
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-foreground">
                                {auth.isAuthenticated ? "You're signed in" : "Welcome"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {auth.isAuthenticated
                                    ? "Continue your journey of faith"
                                    : "Sign in to save your favorite verses"}
                            </p>
                        </div>

                        {/* Auth Button */}
                        <div className="pt-4">
                            {isLoading ? (
                                <Button
                                    size="lg"
                                    disabled
                                    className="w-full rounded-2xl py-6 text-base"
                                >
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing you in...
                                </Button>
                            ) : (
                                <>
                                    {auth.isAuthenticated ? (
                                        <Button
                                            size="lg"
                                            onClick={auth.signOut}
                                            variant="outline"
                                            className="w-full rounded-2xl py-6 text-base border-2 hover:bg-muted/50"
                                        >
                                            <LogOut className="mr-2 h-5 w-5" />
                                            Sign Out
                                        </Button>
                                    ) : (
                                        <Button
                                            size="lg"
                                            onClick={auth.signIn}
                                            className="w-full rounded-2xl py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <LogIn className="mr-2 h-5 w-5" />
                                            Sign In with Puter
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Decorative Element */}
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
                            <Sparkles className="h-4 w-4 text-muted-foreground/50" />
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
                        </div>
                    </div>
                </motion.div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 text-xs text-muted-foreground"
                >
                    Powered by Puter.js
                </motion.p>
            </motion.div>
        </main>
    )
}

export default Auth