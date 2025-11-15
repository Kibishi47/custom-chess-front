import { User as UserClass } from "@/context/AuthContext";
import { useEffect } from "react";
import {
    Game as GameClass,
    GameStatus,
    Player as PlayerClass,
} from "./ChessBoard/types";

interface Props {
    user: UserClass;
    setGame: React.Dispatch<React.SetStateAction<GameClass | null>>;
    setPlayer: React.Dispatch<React.SetStateAction<PlayerClass | null>>;
    setOpponent: React.Dispatch<React.SetStateAction<PlayerClass | null>>;
}

export default function LoadingGame({
    user,
    setGame,
    setPlayer,
    setOpponent,
}: Props) {
    function parseDataToGame(data: any): GameClass {
        return {
            id: data.id,
            status: data.status,
        };
    }

    function parseDataToPlayers(data: any): PlayerClass[] {
        return data.gamePlayers
            .map((playerGame: any) => {
                return {
                    username: playerGame.player.username,
                    color: playerGame.color,
                };
            })
            .sort((a: PlayerClass, b: PlayerClass) => {
                if (a.username === user.username) return -1;
                if (b.username === user.username) return 1;
                return 0;
            });
    }

    function setupGame(data: any): GameClass {
        const game = parseDataToGame(data);
        setGame(game);
        if (game.status !== GameStatus.Waiting) {
            const players = parseDataToPlayers(data);
            setPlayer(players[0]);
            setOpponent(players[1] || null);
        }

        return game;
    }

    let eventSource: EventSource | null = null;

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/game/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const game = setupGame(data);

                if (game.status === GameStatus.Waiting) {
                    eventSource = new EventSource(
                        `${import.meta.env.VITE_MERCURE_URL}${
                            import.meta.env.VITE_API_URL
                        }/matchmaking`
                    );

                    eventSource.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        const game = setupGame(data);

                        if (game.status !== GameStatus.Waiting) {
                            eventSource!.close();
                        }
                    };
                }
            })
            .catch((err) => {
                console.error("Erreur matchmaking :", err);
            });
    }, [setGame, user.token]);

    return (
        <div className="text-center text-muted-foreground">
            Recherche d’une partie...
        </div>
    );
}
