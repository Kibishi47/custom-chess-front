import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Home, Gamepad2, LogIn, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/"
                            className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-accent transition-colors"
                        >
                            <Gamepad2 className="w-6 h-6" />
                            Chess Game
                        </Link>
                        <div className="flex gap-4 items-center">
                            <Link
                                to="/"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    location.pathname === "/"
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                            >
                                <Home className="w-4 h-4" />
                                Accueil
                            </Link>
                            <Link
                                to="/game/select"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    location.pathname.startsWith("/game")
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                            >
                                <Gamepad2 className="w-4 h-4" />
                                Jouer
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/account"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                            location.pathname === "/account"
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                    >
                                        <User className="w-4 h-4" />
                                        {user.username}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                            location.pathname === "/login"
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Connexion
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
