export type PieceType =
    | "king"
    | "queen"
    | "rook"
    | "bishop"
    | "knight"
    | "pawn";
export type PieceColor = "white" | "black";

export interface Piece {
    type: PieceType;
    color: PieceColor;
}

export interface Position {
    row: number;
    col: number;
}

export enum GameStatus {
    Waiting = "waiting",
    Ongoing = "ongoing",
    Finished = "finished",
    Cancelled = "cancelled",
}

export interface Player {
    username: string;
    color: PieceColor;
}

export interface GamePieceFromApi {
    key: PieceType;
    color: PieceColor;
    square: string;
}

export interface Game {
    id: number;
    status: GameStatus | string;
    turnColor: PieceColor;
    legalMoves: Record<string, string[]>;
    pieces: GamePieceFromApi[];
    players: Player[];
}
