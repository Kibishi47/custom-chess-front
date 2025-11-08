import type { Piece, Position, MoveChange } from "./types";

export const samePiece = (a: Piece | null, b: Piece | null) =>
  !!a && !!b && a.type === b.type && a.color === b.color;

export const diffCells = (oldBoard: (Piece | null)[][], newBoard: (Piece | null)[][]) => {
  const diffs: { pos: Position; oldVal: Piece | null; newVal: Piece | null }[] = [];
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

export const detectBoardChange = (
  oldBoard: (Piece | null)[][],
  newBoard: (Piece | null)[][]
): MoveChange | null => {
  const diffs = diffCells(oldBoard, newBoard);
  if (diffs.length === 0) return null;

  if (diffs.length === 2) {
    const [a, b] = diffs;
    const from = [a, b].find(d => d.oldVal && !d.newVal);
    const to = [a, b].find(d => d.newVal && !d.oldVal);
    if (from?.oldVal && to?.newVal) {
      const captured = to.oldVal && to.oldVal.color !== from.oldVal.color ? to.oldVal : null;
      return { from: from.pos, to: to.pos, pieceBefore: from.oldVal, pieceAfter: to.newVal, captured };
    }
  }
  return null;
};

export const caseName = (row: number, col: number) => `${row}-${col}`;