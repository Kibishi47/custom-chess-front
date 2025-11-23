import { useEffect, useState } from "react";
import {
    generateBoardFromPieces,
    displayToBoardPosition,
    positionToAlgebraic,
} from "./chessUtils";
import type { Game, Player, Piece, Position } from "./types";
import { useAuth } from "@/context/AuthContext";

interface UseChessBoardResult {
    board: (Piece | null)[][];
    selectedSquare: Position | null; // coords internes
    legalTargets: string[]; // ex: ["a4","a5"]
    isMyTurn: boolean;
    handleSquareClick: (displayRow: number, displayCol: number) => void;
}

export function useChessBoard(game: Game, player: Player): UseChessBoardResult {
    const user = useAuth().user!;
    const [board, setBoard] = useState<(Piece | null)[][]>(() =>
        generateBoardFromPieces(game.pieces)
    );
    const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
    const [legalTargets, setLegalTargets] = useState<string[]>([]);

    const isMyTurn = game.turnColor === player.color;

    // Quand le backend renvoie un nouvel état (via Mercure), on régénère le board
    useEffect(() => {
        setBoard(generateBoardFromPieces(game.pieces));
        setSelectedSquare(null);
        setLegalTargets([]);
    }, [game.pieces]);

    const getLegalMove = (position: Position): string[] => {
        const fromAlgebraic = positionToAlgebraic(position);
        const moves = game.legalMoves[fromAlgebraic] || [];
        return moves;
    };

    const handleSquareClick = (displayRow: number, displayCol: number) => {
        const boardPos: Position = displayToBoardPosition(
            { row: displayRow, col: displayCol },
            player.color
        );
        const piece = board[boardPos.row][boardPos.col];

        // Si une case est déjà sélectionnée, on essaie de jouer un coup
        if (selectedSquare) {
            const targets = getLegalMove(selectedSquare);
            const fromAlgebraic = positionToAlgebraic(selectedSquare);
            const toAlgebraic = positionToAlgebraic(boardPos);

            // Le coup est-il légal ?
            if (targets.includes(toAlgebraic)) {
                const movingPiece =
                    board[selectedSquare.row][selectedSquare.col];
                if (!movingPiece) {
                    // Incohérence locale, on reset juste la sélection
                    setSelectedSquare(null);
                    setLegalTargets([]);
                    return;
                }

                // Envoi du coup au backend
                fetch(`${import.meta.env.VITE_API_URL}/${game.id}/moves`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        fromSq: fromAlgebraic,
                        toSq: toAlgebraic,
                        piece: movingPiece.type,
                        color: movingPiece.color,
                    }),
                }).catch(() => {
                    // En cas d'erreur réseau, Mercure finira par resynchroniser
                });
            } else if (
                piece &&
                (selectedSquare.row !== boardPos.row ||
                    selectedSquare.col !== boardPos.col)
            ) {
                const moves = getLegalMove(boardPos);
                setSelectedSquare(boardPos);
                setLegalTargets(moves);
                return;
            }

            // Dans tous les cas, on clear la sélection
            setSelectedSquare(null);
            setLegalTargets([]);
            return;
        }

        // Pas de case sélectionnée → on essaie de sélectionner une pièce
        if (!piece) return; // pas de pièce

        // On ne peut sélectionner que SES propres pièces
        if (piece.color !== player.color) return;

        // On ne peut jouer que si c'est son tour
        if (!isMyTurn) return;

        const moves = getLegalMove(boardPos);

        setSelectedSquare(boardPos);
        setLegalTargets(moves);
    };

    return {
        board,
        selectedSquare,
        legalTargets,
        isMyTurn,
        handleSquareClick,
    };
}
