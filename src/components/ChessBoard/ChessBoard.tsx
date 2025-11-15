import { useChessBoard } from "./useChessBoard";
import { ChessSquare } from "./ChessSquare";
import type {
    Game as GameClass,
    Player as PlayerClass,
    Position,
} from "./types";
import {
    boardToDisplayPosition,
    positionToAlgebraic,
    displayToBoardPosition,
} from "./chessUtils";

interface Props {
    game: GameClass;
    player: PlayerClass;
    opponent: PlayerClass;
}

export default function ChessBoard({ game, player, opponent }: Props) {
    const { board, selectedSquare, legalTargets, isMyTurn, handleSquareClick } =
        useChessBoard(game, player);

    // Pour chaque case d'affichage, on doit savoir :
    // - la pièce (en tenant compte de la rotation)
    // - si elle est sélectionnée
    // - si elle fait partie des coups légaux
    const renderSquares = () => {
        const squares: JSX.Element[] = [];

        for (let displayRow = 0; displayRow < 8; displayRow++) {
            for (let displayCol = 0; displayCol < 8; displayCol++) {
                const boardPos = displayToBoardPosition(
                    { row: displayRow, col: displayCol },
                    player.color
                );

                const piece = board[boardPos.row][boardPos.col];

                const isSelected =
                    selectedSquare &&
                    selectedSquare.row === boardPos.row &&
                    selectedSquare.col === boardPos.col;

                const algebraic = positionToAlgebraic(boardPos);
                const isLegalTarget = legalTargets.includes(algebraic);

                squares.push(
                    <ChessSquare
                        key={`${displayRow}-${displayCol}`}
                        piece={piece}
                        row={displayRow}
                        col={displayCol}
                        isSelected={!!isSelected}
                        isLegalTarget={isLegalTarget}
                        onClick={() =>
                            handleSquareClick(displayRow, displayCol)
                        }
                    />
                );
            }
        }

        return squares;
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="inline-block p-4 md:p-6 bg-card rounded-xl shadow-2xl border border-border">
                <div className="grid grid-cols-8 gap-0 border-2 border-foreground/20 rounded-lg overflow-hidden">
                    {renderSquares()}
                </div>
            </div>

            <div className="flex flex-col gap-2 items-center">
                <div className="text-sm text-muted-foreground">
                    {isMyTurn
                        ? "À votre tour de jouer"
                        : `En attente du coup de ${opponent.username}`}
                </div>
                <div className="text-xs text-muted-foreground">
                    Vous êtes les pièces{" "}
                    {player.color === "white" ? "blanches" : "noires"}
                </div>
            </div>
        </div>
    );
}
