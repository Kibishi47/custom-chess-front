import { useChessBoard } from "./useChessBoard";
import { ChessSquare } from "./ChessSquare";
import type { Piece } from "./types";
import { useState } from "react";

interface Props {
  gameId: number;
}

const makePawns = (color: "white" | "black") => Array(8).fill(null).map(() => ({ type: "pawn", color }));

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
  makePawns("black"),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  makePawns("white"),
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

export default function ChessBoard(props: Props) {

  const {
    board,
    setBoard,
    selectedSquare,
    setSelectedSquare,
    draggedPiece,
    setDraggedPiece,
    handleChangeBoard,
  } = useChessBoard(initialBoard, props.gameId);

  const isPossibleMove = (row: number, col: number) => {
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
      handleChangeBoard(board, newBoard);
      setBoard(newBoard);
      setSelectedSquare(null);
    } else if (piece) {
      setSelectedSquare({ row, col });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="inline-block p-4 md:p-6 bg-card rounded-xl shadow-2xl border border-border">
        <div className="grid grid-cols-8 gap-0 border-2 border-foreground/20 rounded-lg overflow-hidden">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                row={rowIndex}
                col={colIndex}
                isSelected={
                  selectedSquare?.row === rowIndex &&
                  selectedSquare?.col === colIndex
                }
                isPossibleMove={isPossibleMove(rowIndex, colIndex)}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!draggedPiece) return;
                  const newBoard = board.map((r) => [...r]);
                  newBoard[rowIndex][colIndex] = draggedPiece.piece;
                  newBoard[draggedPiece.from.row][draggedPiece.from.col] = null;
                  handleChangeBoard(board, newBoard);
                  setBoard(newBoard);
                  setDraggedPiece(null);
                  setSelectedSquare(null);
                }}
                onDragStart={(e, p) =>
                  setDraggedPiece({ piece: p, from: { row: rowIndex, col: colIndex } })
                }
                onDragEnd={() => setDraggedPiece(null)}
                onDragOver={(e) => e.preventDefault()}
              />
            ))
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