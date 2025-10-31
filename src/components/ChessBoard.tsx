import type React from "react";

import { useState } from "react";
import { cn } from "../lib/utils";

type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
type PieceColor = "white" | "black";

type MoveChange = {
  from: Position;
  to: Position;
  pieceBefore: Piece;
  pieceAfter: Piece;
  captured?: Piece | null;
};

interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface Position {
  row: number;
  col: number;
}

const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
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

const initialBoard: (Piece | null)[][] = [
  [
    { type: "rook", color: "black" },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black" },
  ],
  Array(8).fill({ type: "pawn", color: "black" }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: "pawn", color: "white" }),
  [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ],
];

const gameId = 1;

export default function ChessBoard() {
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<{
    piece: Piece;
    from: Position;
  } | null>(null);

  const isPossibleMove = (row: number, col: number): boolean => {
    if (!selectedSquare) return false;
    return !(selectedSquare.row === row && selectedSquare.col === col);
  };

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];

    if (selectedSquare) {
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = board[selectedSquare.row][selectedSquare.col];
      newBoard[selectedSquare.row][selectedSquare.col] = null;
      setBoard(newBoard);
      handleChangeBoard(board, newBoard);
      setSelectedSquare(null);
    } else if (piece) {
      setSelectedSquare({ row, col });
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    row: number,
    col: number,
    piece: Piece
  ) => {
    setSelectedSquare({ row, col });
    setDraggedPiece({ piece, from: { row, col } });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (!draggedPiece) return;

    if (draggedPiece.from.row === row && draggedPiece.from.col === col) {
      setDraggedPiece(null);
      setSelectedSquare(null);
      return;
    }

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = draggedPiece.piece;
    newBoard[draggedPiece.from.row][draggedPiece.from.col] = null;
    setBoard(newBoard);
    setDraggedPiece(null);
    setSelectedSquare(null);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  const handleChangeBoard = (
    oldBoard: (Piece | null)[][],
    newBoard: (Piece | null)[][]
  ) => {
    const moveChange = detectBoardChange(oldBoard, newBoard);

    if (moveChange) {
      //   onMoveChange(gameId, moveChange);
    }
  };

  const samePiece = (a: Piece | null, b: Piece | null) =>
    !!a && !!b && a.type === b.type && a.color === b.color;

  const posEq = (a: Position, b: Position) =>
    a.row === b.row && a.col === b.col;

  const diffCells = (
    oldBoard: (Piece | null)[][],
    newBoard: (Piece | null)[][]
  ) => {
    const diffs: {
      pos: Position;
      oldVal: Piece | null;
      newVal: Piece | null;
    }[] = [];
    for (let row = 0; row < oldBoard.length; row++) {
      for (let col = 0; col < oldBoard[row].length; col++) {
        const o = oldBoard[row][col];
        const n = newBoard[row][col];
        if ((o === null) !== (n === null) || (o && n && !samePiece(o, n))) {
          diffs.push({ pos: { row, col }, oldVal: o, newVal: n });
        }
      }
    }
    return diffs;
  };

  const detectBoardChange = (
    oldBoard: (Piece | null)[][],
    newBoard: (Piece | null)[][]
  ): MoveChange | null => {
    const diffs = diffCells(oldBoard, newBoard);
    if (diffs.length === 0) return null;

    // Cas courant : exactement 2 cases changent (from -> to)
    if (diffs.length === 2) {
      const [a, b] = diffs;

      // Heuristiques:
      // - "from" est passé de piece -> null (ou remplacée par autre couleur)
      // - "to"   est passé de null/ennemi -> piece
      const fromCand =
        [a, b].find((d) => d.oldVal && !d.newVal) ??
        [a, b].find(
          (d) => d.oldVal && d.newVal && d.oldVal.color !== d.newVal.color
        ); // remplacée

      const toCand =
        [a, b].find((d) => d.newVal && !d.oldVal) ??
        [a, b].find(
          (d) => d.oldVal && d.newVal && d.oldVal.color !== d.newVal.color
        );

      if (fromCand?.oldVal && toCand?.newVal) {
        const captured =
          toCand.oldVal && toCand.oldVal.color !== fromCand.oldVal.color
            ? toCand.oldVal
            : null;

        return {
          from: fromCand.pos,
          to: toCand.pos,
          pieceBefore: fromCand.oldVal,
          pieceAfter: toCand.newVal, // peut être une promotion (type différent)
          captured,
        };
      }
    }

    // Cas plus complexe (>=3 diffs) : on tente un appariement par couleur (ex: promotion + capture)
    const froms = diffs.filter(
      (d) =>
        d.oldVal &&
        (!d.newVal || (d.newVal && d.newVal.color !== d.oldVal.color))
    );
    const tos = diffs.filter(
      (d) =>
        d.newVal &&
        (!d.oldVal || (d.oldVal && d.oldVal.color !== d.newVal.color))
    );

    for (const f of froms) {
      for (const t of tos) {
        if (!f.oldVal || !t.newVal) continue;
        if (posEq(f.pos, t.pos)) continue;
        if (f.oldVal.color === t.newVal.color) {
          const captured =
            t.oldVal && t.oldVal.color !== f.oldVal.color ? t.oldVal : null;
          return {
            from: f.pos,
            to: t.pos,
            pieceBefore: f.oldVal,
            pieceAfter: t.newVal,
            captured,
          };
        }
      }
    }

    // Non-déterminable proprement avec les infos actuelles
    return null;
  };

  const isLightSquare = (row: number, col: number) => (row + col) % 2 === 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="inline-block p-4 md:p-6 bg-card rounded-xl shadow-2xl border border-border">
        <div className="grid grid-cols-8 gap-0 border-2 border-foreground/20 rounded-lg overflow-hidden">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isSelected =
                selectedSquare?.row === rowIndex &&
                selectedSquare?.col === colIndex;
              const isLight = isLightSquare(rowIndex, colIndex);
              const canMoveTo = isPossibleMove(rowIndex, colIndex);

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 relative",
                    "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20",
                    isLight
                      ? "bg-[oklch(0.92_0.02_85)]"
                      : "bg-[oklch(0.45_0.08_280)]",
                    "hover:brightness-95"
                  )}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  {isSelected && (
                    <div className="absolute inset-0 border-[3px] border-accent pointer-events-none z-40 rounded-sm shadow-lg shadow-accent/50" />
                  )}

                  {canMoveTo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                      {piece ? (
                        <div className="relative animate-in fade-in zoom-in duration-300">
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

                  {piece && (
                    <div
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, rowIndex, colIndex, piece)
                      }
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl cursor-move select-none transition-transform hover:scale-110 relative z-20",
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
            })
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center flex-wrap justify-center">
        <button
          onClick={() => setBoard(initialBoard)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
        >
          Réinitialiser
        </button>
        <div className="text-sm text-muted-foreground px-4 py-2 bg-muted rounded-lg">
          {selectedSquare
            ? "Cliquez sur une case pour déplacer"
            : "Sélectionnez une pièce"}
        </div>
      </div>
    </div>
  );
}
