export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
export type PieceColor = "white" | "black";

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Position {
  row: number;
  col: number;
}

export interface MoveChange {
  from: Position;
  to: Position;
  pieceBefore: Piece;
  pieceAfter: Piece;
  captured?: Piece | null;
}