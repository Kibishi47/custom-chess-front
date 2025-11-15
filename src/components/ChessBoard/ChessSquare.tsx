import { cn } from "../../lib/utils";
import type { Piece } from "./types";

interface Props {
    piece: Piece | null;
    row: number; // coordonnées d'affichage (0..7)
    col: number;
    isSelected: boolean;
    isLegalTarget: boolean;
    onClick: () => void;
}

const pieceSymbols: Record<"white" | "black", Record<string, string>> = {
    white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙",
    },
    black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟",
    },
};

export function ChessSquare({
    piece,
    row,
    col,
    isSelected,
    isLegalTarget,
    onClick,
}: Props) {
    const isLightSquare = (row + col) % 2 === 0;

    return (
        <div
            className={cn(
                "aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 relative",
                "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20",
                isLightSquare
                    ? "bg-[oklch(0.92_0.02_85)]"
                    : "bg-[oklch(0.45_0.08_280)]",
                "hover:brightness-95"
            )}
            onClick={onClick}
        >
            {/* Sélection de la pièce */}
            {isSelected && (
                <div className="absolute inset-0 border-[3px] border-accent pointer-events-none z-40 rounded-sm shadow-lg shadow-accent/50" />
            )}

            {/* Coup légal */}
            {isLegalTarget && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    {piece ? (
                        <div className="relative">
                            <div className="w-11 h-11 md:w-[3.25rem] md:h-[3.25rem] lg:w-14 lg:h-14 rounded-full border-[3.5px] border-accent shadow-xl shadow-accent/30 animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 md:w-[1.125rem] md:h-[1.125rem] rounded-full bg-accent shadow-lg shadow-accent/50" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-4 h-4 md:w-[1.125rem] md:h-[1.125rem] lg:w-5 lg:h-5 rounded-full bg-accent shadow-xl shadow-accent/40 animate-in fade-in zoom-in duration-300 hover:scale-125 transition-transform" />
                    )}
                </div>
            )}

            {/* Pièce */}
            {piece && (
                <div
                    className={cn(
                        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl cursor-pointer select-none transition-transform hover:scale-110 relative z-20",
                        piece.color === "white"
                            ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            : "text-[oklch(0.15_0_0)] drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]"
                    )}
                >
                    {pieceSymbols[piece.color][piece.type]}
                </div>
            )}
        </div>
    );
}
