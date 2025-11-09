import type React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{
        username?: string;
        password?: string;
        global?: string;
    }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setErrors({ global: "Veuillez remplir tous les champs" });
            return;
        }

        const serverErrors = await authContext?.login(username, password);
        if (serverErrors) {
            setErrors(serverErrors);
            return;
        }

        navigate("/account");
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Connexion
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Connectez-vous à votre compte
                    </p>

                    {errors.global && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-4">
                            {errors.global}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Nom d'utilisateur
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setErrors({});
                                }}
                                className={`w-full px-4 py-2 rounded-md border ${
                                    errors.username
                                        ? "border-destructive"
                                        : "border-input"
                                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                                placeholder="votrenomdutilisateur"
                            />
                            {errors.username && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors({});
                                }}
                                className={`w-full px-4 py-2 rounded-md border ${
                                    errors.password
                                        ? "border-destructive"
                                        : "border-input"
                                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Se connecter
                        </button>
                    </form>

                    <p className="text-center text-muted-foreground mt-6">
                        Pas encore de compte ?{" "}
                        <a
                            href="/register"
                            className="text-primary hover:underline font-medium"
                        >
                            S'inscrire
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
