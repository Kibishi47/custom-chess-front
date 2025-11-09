import { useState } from "react";
import ChessBoard from "../components/ChessBoard/ChessBoard";
import LoadingGame from "@/components/LoadingGame";

export interface Game {
  id: number;
  status: string;
  players: Player[];
}

export interface Player {
  username: string;
  color: "white" | "black";
}

enum GameStatus {
  Waiting = "waiting",
  Ongoing = "ongoing",
  Finished = "finished",
  Cancelled = "cancelled",
}

export default function Game() {
  const [game, setGame] = useState<Game | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Partie d'Échecs
          </h1>
        </div>
        {(game === null || game.status === GameStatus.Waiting) && (
          <LoadingGame setGame={setGame} />
        )}
        {game && game.status === GameStatus.Ongoing && (
          <ChessBoard gameId={game.id} />
        )}
      </div>
    </div>
  );
}
