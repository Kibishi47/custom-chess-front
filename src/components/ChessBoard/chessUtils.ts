import type { Piece, PieceColor, Position, GamePieceFromApi } from "./types";

/**
 * Convertit une case d'API ("a3") -> Position {row, col} en référentiel "blanc en bas".
 */
export function algebraicToPosition(square: string): Position {
    const file = square[0].toLowerCase(); // a..h
    const rank = parseInt(square[1], 10); // 1..8

    const col = file.charCodeAt(0) - "a".charCodeAt(0); // a => 0
    const row = 8 - rank; // 8 => 0, 1 => 7

    return { row, col };
}

/**
 * Convertit une Position {row, col} -> "a3" en référentiel "blanc en bas".
 */
export function positionToAlgebraic(pos: Position): string {
    const file = String.fromCharCode("a".charCodeAt(0) + pos.col);
    const rank = 8 - pos.row;
    return `${file}${rank}`;
}

/**
 * Génère le board interne (référentiel "blanc en bas") à partir des pièces de l'API.
 */
export function generateBoardFromPieces(
    pieces: GamePieceFromApi[]
): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array.from({ length: 8 }, () =>
        Array<Piece | null>(8).fill(null)
    );

    for (const p of pieces) {
        const { row, col } = algebraicToPosition(p.square);
        board[row][col] = { type: p.key, color: p.color };
    }

    return board;
}

/**
 * Mapping coordonnées "affichage" -> "board interne" selon la perspective du joueur.
 *
 * - Pour les blancs : (row, col) identiques.
 * - Pour les noirs : plateau tourné à 180°.
 */
export function displayToBoardPosition(
    displayPos: Position,
    perspective: PieceColor
): Position {
    if (perspective === "white") return displayPos;
    return {
        row: 7 - displayPos.row,
        col: 7 - displayPos.col,
    };
}

/**
 * Inverse : board interne -> coordonnées d'affichage.
 */
export function boardToDisplayPosition(
    boardPos: Position,
    perspective: PieceColor
): Position {
    if (perspective === "white") return boardPos;
    return {
        row: 7 - boardPos.row,
        col: 7 - boardPos.col,
    };
}
