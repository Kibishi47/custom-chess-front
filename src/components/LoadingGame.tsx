import { useAuth } from "@/context/AuthContext";
import { GameStatus, type Game as GameClass } from "../pages/Game";
import type { Player as PlayerClass } from "../pages/Game";
import { useEffect } from "react";

interface Props {
    game: GameClass | null;
    setGame: React.Dispatch<React.SetStateAction<GameClass | null>>;
}

export default function LoadingGame({ setGame }: Props) {
    function parseDataToGame(data: any): GameClass {
        const players: PlayerClass[] = data.gamePlayers.map(
            (playerGame: any) => {
                return {
                    username: playerGame.player.username,
                    color: playerGame.color,
                };
            }
        );
        return {
            id: data.id,
            status: data.status,
            players: players,
        };
    }

    const user = useAuth().user!;
    const endpoint = "/matchmaking";

    let eventSource: EventSource | null = null;

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const game = parseDataToGame(data);
                setGame(game);

                if (game.status === GameStatus.Waiting) {
                    eventSource = new EventSource(
                        `${import.meta.env.VITE_MERCURE_URL}${
                            import.meta.env.VITE_API_URL
                        }${endpoint}`
                    );

                    eventSource.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        const game = parseDataToGame(data);
                        setGame(game);

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
