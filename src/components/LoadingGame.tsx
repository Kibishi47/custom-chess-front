import { useAuth } from "@/context/AuthContext";
import type { Game as GameClass } from "../pages/Game";
import type { Player as PlayerClass } from "../pages/Game";
import { useEffect } from "react";

interface Props {
  setGame: React.Dispatch<React.SetStateAction<GameClass | null>>;
}

export default function LoadingGame({ setGame }: Props) {
  const user = useAuth().user!;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/matchmaking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const players: PlayerClass[] = data.gamePlayers.map(
          (playerGame: any) => {
            return {
              username: playerGame.player.username,
              color: playerGame.color,
            };
          }
        );
        const game: GameClass = {
          id: data.id,
          status: data.status,
          players: data.players || [],
        };
        setGame(game);
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
