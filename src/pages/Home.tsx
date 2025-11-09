import { Link } from "react-router-dom";
import { Crown, Sparkles, Zap } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <Crown className="w-20 h-20 text-accent animate-pulse" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground">
                        Jeu d'Échecs
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Bienvenue dans votre jeu d'échecs personnalisé. Déplacez
                        les pièces librement et explorez le plateau.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/game"
                        className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Commencer à jouer
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="p-6 bg-card rounded-xl border border-border space-y-3">
                        <Sparkles className="w-8 h-8 text-accent mx-auto" />
                        <h3 className="font-semibold text-lg">
                            Déplacement libre
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Déplacez les pièces sur n'importe quelle case
                            disponible
                        </p>
                    </div>
                    <div className="p-6 bg-card rounded-xl border border-border space-y-3">
                        <Sparkles className="w-8 h-8 text-accent mx-auto" />
                        <h3 className="font-semibold text-lg">
                            Interface intuitive
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Cliquez ou glissez-déposez pour déplacer les pièces
                        </p>
                    </div>
                    <div className="p-6 bg-card rounded-xl border border-border space-y-3">
                        <Sparkles className="w-8 h-8 text-accent mx-auto" />
                        <h3 className="font-semibold text-lg">
                            Design moderne
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Indicateurs visuels élégants pour les mouvements
                            possibles
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
