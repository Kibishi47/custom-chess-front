// src/pages/Game.tsx
import { useEffect, useRef, useState } from "react";
import ChessBoard from "@/components/ChessBoard/ChessBoard";
import LoadingGame from "@/components/LoadingGame";
import {
    Game as GameClass,
    GameStatus,
    Player as PlayerClass,
    PieceColor,
} from "@/components/ChessBoard/types";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Game() {
    const [params] = useSearchParams();
    const boardType = params.get("boardType") ?? "standard";
    const navigate = useNavigate();
    const [game, setGame] = useState<GameClass | null>(null);
    const [player, setPlayer] = useState<PlayerClass | null>(null);
    const [opponent, setOpponent] = useState<PlayerClass | null>(null);
    const user = useAuth().user!;
    const eventSourceRef = useRef<EventSource | null>(null);
    const lastGameIdRef = useRef<number | null>(null);

    const parseDataToGame = (data: any): GameClass => {
        return {
            id: data.id,
            status: data.status,
            turnColor: data.turnColor as PieceColor,
            legalMoves: data.legalMoves ?? {},
            pieces: data.pieces ?? [],
            players: (data.gamePlayers ?? []).map((gp: any) => ({
                username: gp.player.username,
                color: gp.color as PieceColor,
            })),
            check: data.check ?? { white: false, black: false },
        };
    };

    const setupGame = (data: any): void => {
        const parsedGame = parseDataToGame(data);
        setGame(parsedGame);

        const sortedPlayers = parsedGame.players.slice().sort((a, b) => {
            if (a.username === user.username) return -1;
            if (b.username === user.username) return 1;
            return 0;
        });

        setPlayer(sortedPlayers[0] ?? null);
        setOpponent(sortedPlayers[1] ?? null);

        lastGameIdRef.current = parsedGame.id;

        handleGameStatus(parsedGame);
    };

    const handleGameStatus = (game: GameClass): void => {
        if (game.status === GameStatus.Cancelled) {
            navigate("/");
        }
    };

    // Mercure : abonnement au topic de la game
    useEffect(() => {
        if (!game) return;
        if (eventSourceRef.current) return;

        const url = `${import.meta.env.VITE_MERCURE_URL}${
            import.meta.env.VITE_API_URL
        }/game/${game.id}`;
        const es = new EventSource(url);
        eventSourceRef.current = es;

        es.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setupGame(data);
        };

        es.onerror = () => {
            console.error("Erreur Mercure sur game", game.id);
        };

        return () => {
            es.close();
            eventSourceRef.current = null;
        };
    }, [game]);

    const quitGame = () => {
        if (!lastGameIdRef.current) return;

        console.log("Quit game (page change / unmount)");

        navigator.sendBeacon(
            `${import.meta.env.VITE_API_URL}/game/quit`,
            JSON.stringify({
                token: user.token,
                gameId: lastGameIdRef.current,
            })
        );
    };

    // Quitter la game quand on quitte la page Game (navigation / refresh)
    useEffect(() => {
        return () => {
            quitGame();
        };
    }, [user.token]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                        Partie d'Échecs
                    </h1>
                </div>
                {(game === null ||
                    game.status === GameStatus.Waiting ||
                    !player ||
                    !opponent) && (
                    <LoadingGame
                        user={user}
                        setupGame={setupGame}
                        boardType={boardType}
                    />
                )}
                {game &&
                    player &&
                    opponent &&
                    (game.status === GameStatus.Ongoing ||
                        game.status === GameStatus.Finished) && (
                        <ChessBoard
                            game={game}
                            player={player}
                            opponent={opponent}
                        />
                    )}
            </div>
        </div>
    );
}
