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
    selectedSquare: Position | null;
    legalTargets: string[];
    isMyTurn: boolean;
    kingInCheck: Position | null;
    endResult: { title: string; message: string } | null;
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    handleSquareClick: (displayRow: number, displayCol: number) => void;
}

export function useChessBoard(
    game: Game,
    player: Player,
    opponent: Player
): UseChessBoardResult {
    const user = useAuth().user!;
    const [board, setBoard] = useState<(Piece | null)[][]>(() =>
        generateBoardFromPieces(game.pieces)
    );
    const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
    const [legalTargets, setLegalTargets] = useState<string[]>([]);
    const [kingInCheck, setKingInCheck] = useState<Position | null>(null);

    const [endResult, setEndResult] = useState<{
        title: string;
        message: string;
    } | null>(null);

    const [showModal, setShowModal] = useState(true);

    const isMyTurn = game.turnColor === player.color;

    // ------------------------------------
    // 1. Mise à jour du board
    // ------------------------------------
    useEffect(() => {
        setBoard(generateBoardFromPieces(game.pieces));
        setSelectedSquare(null);
        setLegalTargets([]);
    }, [game.pieces]);

    // ------------------------------------
    // 2. Détection du roi en échec
    // ------------------------------------
    useEffect(() => {
        const checkWhite = game.check?.white === true;
        const checkBlack = game.check?.black === true;

        if (!checkWhite && !checkBlack) {
            setKingInCheck(null);
            return;
        }

        const colorInCheck = checkWhite ? "white" : "black";

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (
                    piece &&
                    piece.type === "king" &&
                    piece.color === colorInCheck
                ) {
                    setKingInCheck({ row, col });
                    return;
                }
            }
        }
    }, [game.check, board]);

    // ------------------------------------
    // 3. Détection fin de partie
    // ------------------------------------
    useEffect(() => {
        const hasAnyLegalMove = Object.values(game.legalMoves).some(
            (moves) => moves.length > 0
        );
        if (hasAnyLegalMove) return;

        const checkWhite = game.check?.white === true;
        const checkBlack = game.check?.black === true;

        const myColor = player.color;
        const oppColor = myColor === "white" ? "black" : "white";

        const myKingInCheck = myColor === "white" ? checkWhite : checkBlack;
        const oppKingInCheck = oppColor === "white" ? checkWhite : checkBlack;

        if (myKingInCheck) {
            setEndResult({
                title: "Vous avez perdu",
                message: `${opponent.username} remporte la partie.`,
            });
        } else if (oppKingInCheck) {
            setEndResult({
                title: "Vous avez gagné",
                message: `Vous avez battu ${opponent.username} !`,
            });
        } else {
            setEndResult({
                title: "Match nul",
                message: "La partie se termine en pat.",
            });
        }
    }, [game, player.color, opponent.username]);

    // ------------------------------------
    // 4. Gestion clique sur les cases
    // ------------------------------------
    const getLegalMove = (position: Position): string[] => {
        const fromAlgebraic = positionToAlgebraic(position);
        return game.legalMoves[fromAlgebraic] || [];
    };

    const handleSquareClick = (displayRow: number, displayCol: number) => {
        if (endResult) return; // empêcher de jouer une fois terminé

        const boardPos: Position = displayToBoardPosition(
            { row: displayRow, col: displayCol },
            player.color
        );

        const piece = board[boardPos.row][boardPos.col];

        if (selectedSquare) {
            const targets = getLegalMove(selectedSquare);
            const fromAlgebraic = positionToAlgebraic(selectedSquare);
            const toAlgebraic = positionToAlgebraic(boardPos);

            if (targets.includes(toAlgebraic)) {
                const movingPiece =
                    board[selectedSquare.row][selectedSquare.col];
                if (!movingPiece) {
                    setSelectedSquare(null);
                    setLegalTargets([]);
                    return;
                }

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
                });
            } else if (piece) {
                const moves = getLegalMove(boardPos);
                setSelectedSquare(boardPos);
                setLegalTargets(moves);
                return;
            }

            setSelectedSquare(null);
            setLegalTargets([]);
            return;
        }

        if (!piece) return;
        if (piece.color !== player.color) return;
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
        kingInCheck,
        endResult,
        showModal,
        setShowModal,
        handleSquareClick,
    };
}
