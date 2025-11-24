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
    const {
        board,
        selectedSquare,
        legalTargets,
        isMyTurn,
        kingInCheck,
        endResult,
        showModal,
        setShowModal,
        handleSquareClick,
    } = useChessBoard(game, player, opponent);

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

                const isInCheck =
                    kingInCheck &&
                    kingInCheck.row === boardPos.row &&
                    kingInCheck.col === boardPos.col;

                squares.push(
                    <ChessSquare
                        key={`${displayRow}-${displayCol}`}
                        piece={piece}
                        row={displayRow}
                        col={displayCol}
                        isSelected={!!isSelected}
                        isLegalTarget={isLegalTarget}
                        isInCheck={!!isInCheck}
                        onClick={() =>
                            handleSquareClick(displayRow, displayCol)
                        }
                    />
                );
            }
        }

        return squares;
    };

    // -------------------------
    // MODAL FIN DE PARTIE
    // -------------------------
    const EndGameModal = () => {
        if (!endResult || !showModal) return null;

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={() => setShowModal(false)}
            >
                <div className="absolute inset-0"></div>

                <div
                    className="relative bg-card border border-border rounded-xl p-8 shadow-2xl text-center max-w-md w-full mx-4 animate-in fade-in zoom-in z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        {endResult.title}
                    </h2>

                    <p className="text-muted-foreground mb-8 text-lg">
                        {endResult.message}
                    </p>

                    <button
                        onClick={() => (window.location.href = "/")}
                        className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Retour à l’accueil
                    </button>
                </div>
            </div>
        );
    };

    // ----------------------------------
    // RENDER PRINCIPAL
    // ----------------------------------
    return (
        <div className="flex flex-col items-center gap-6 relative">
            {/* Modal fin */}
            <EndGameModal />

            {/* Plateau */}
            <div className="inline-block p-4 md:p-6 bg-card rounded-xl shadow-2xl border border-border">
                <div className="grid grid-cols-8 gap-0 border-2 border-foreground/20 rounded-lg overflow-hidden">
                    {renderSquares()}
                </div>
            </div>

            {/* Messages sous l'échiquier */}
            <div className="flex flex-col gap-2 items-center mt-4">
                {!endResult && (
                    <>
                        <div className="text-sm text-muted-foreground">
                            {isMyTurn
                                ? "À votre tour de jouer"
                                : `En attente du coup de ${opponent.username}`}
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Vous êtes les pièces{" "}
                            {player.color === "white" ? "blanches" : "noires"}
                        </div>
                    </>
                )}

                {endResult && (
                    <div className="text-center mt-4">
                        <p className="text-xl font-bold text-foreground">
                            {endResult.title}
                        </p>
                        <p className="text-muted-foreground">
                            {endResult.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
