import { useEffect, useState } from "react";
import ChessBoard from "@/components/ChessBoard/ChessBoard";
import LoadingGame from "@/components/LoadingGame";
import {
    Game as GameClass,
    GameStatus,
    Player as PlayerClass,
} from "@/components/ChessBoard/types";
import { useAuth } from "@/context/AuthContext";

export default function Game() {
    const [game, setGame] = useState<GameClass | null>(null);
    const [player, setPlayer] = useState<PlayerClass | null>(null);
    const [opponent, setOpponent] = useState<PlayerClass | null>(null);
    const user = useAuth().user!;

    useEffect(() => {
        if (!game) return;

        const forceQuitGame = () => {
            console.log("Quitting game...");

            navigator.sendBeacon(
                `${import.meta.env.VITE_API_URL}/game/quit`,
                JSON.stringify({
                    token: user.token,
                    gameId: game.id,
                })
            );
        };

        const autoQuitGame = () => {
            const navEntry = performance.getEntriesByType("navigation")[0];
            const navType = navEntry?.type;

            // ⛔ NE PAS quitter sur refresh
            if (navType === "reload") return;

            // ⛔ NE PAS quitter sur back/forward
            if (navType === "back_forward") return;

            // Ancienne API Chrome
            if (performance.navigation?.type === 1) return;

            // ✔️ Quitter quand on QUITTE vraiment la page
            forceQuitGame();
        };

        // Quitter en cas de fermeture / sortie site
        window.addEventListener("beforeunload", autoQuitGame);

        // --- Détection du démontage interne React ---
        let mounted = true;

        return () => {
            window.removeEventListener("beforeunload", autoQuitGame);

            //❗ Ne pas exécuter au premier démontage (montage -> détection navigation précédente)
            if (!mounted) return;

            mounted = false;

            forceQuitGame();
        };
    }, [game]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                        Partie d'Échecs
                    </h1>
                </div>
                {(game === null || game.status === GameStatus.Waiting) && (
                    <LoadingGame
                        user={user}
                        setGame={setGame}
                        setPlayer={setPlayer}
                        setOpponent={setOpponent}
                    />
                )}
                {game && game.status === GameStatus.Ongoing && (
                    <ChessBoard
                        game={game}
                        player={player!}
                        opponent={opponent!}
                    />
                )}
            </div>
        </div>
    );
}
