import { useEffect, useRef, useState } from "react";
import { detectBoardChange, caseName } from "./chessUtils";
import type { Piece, Position } from "./types";

function moveSig(from: Position, to: Position) {
  return `${from.row}-${from.col}>${to.row}-${to.col}`;
}

export function useChessBoard(initialBoard: (Piece | null)[][], gameId: number) {
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<{ piece: Piece; from: Position } | null>(null);

  /**
   * Set de signatures de coups envoyés par CE client afin d'ignorer
   * leur écho Mercure (duplication).
   */
  const pendingMovesRef = useRef<Set<string>>(new Set());
  const registerPendingMove = (from: Position, to: Position) => {
    const sig = moveSig(from, to);
    pendingMovesRef.current.add(sig);
    // Nettoyage automatique après 4s (latence réseau / file Mercure)
    setTimeout(() => pendingMovesRef.current.delete(sig), 4000);
  };

  // --- Mercure listener ---
  useEffect(() => {
    const url =
      import.meta.env.VITE_MERCURE_URL +
      import.meta.env.VITE_CHESS_MOVE_TOPIC.replace("{gameId}", gameId.toString());

    const es = new EventSource(url);

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const [fr, fc] = String(data.fromSq).split("-").map(Number);
      const [tr, tc] = String(data.toSq).split("-").map(Number);

      const from: Position = { row: fr, col: fc };
      const to: Position = { row: tr, col: tc };
      const sig = moveSig(from, to);

      // 🛡️ Ignore l’écho d’un coup que ce client vient d’envoyer
      if (pendingMovesRef.current.has(sig)) {
        pendingMovesRef.current.delete(sig);
        return;
      }

      // ✅ Update "fonctionnelle" + garde-fous pour éviter les disparitions
      setBoard((prev) => {
        const next = prev.map((r) => [...r]);
        const piece = next[fr]?.[fc] ?? null;

        // Si la source est déjà vide mais la destination contient déjà une pièce
        // => coup déjà appliqué localement : on ne refait rien.
        if (!piece && next[tr]?.[tc]) return prev;

        // Sinon on applique en sécurité
        next[tr][tc] = piece;
        if (next[fr]) next[fr][fc] = null;
        return next;
      });
    };

    return () => es.close();
  }, [gameId]);

  /**
   * Appelée par le composant après avoir préparé newBoard.
   * Détecte le coup, l’envoie à l’API et l’enregistre comme "pending"
   * pour ignorer l’éventuel écho Mercure.
   */
  const handleChangeBoard = (oldBoard: (Piece | null)[][], newBoard: (Piece | null)[][]) => {
    const moveChange = detectBoardChange(oldBoard, newBoard);
    if (!moveChange) return;

    // Marque ce move comme "pending" pour ignorer l'écho Mercure
    registerPendingMove(moveChange.from, moveChange.to);

    const payload = {
      game: `/api/games/${gameId}`,
      moveNumber: 1,
      fromSq: caseName(moveChange.from.row, moveChange.from.col),
      toSq: caseName(moveChange.to.row, moveChange.to.col),
      color: moveChange.pieceBefore.color,
      piece: moveChange.pieceBefore.type,
    };

    fetch(`${import.meta.env.VITE_API_URL}/moves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      // En cas d'erreur réseau, on laisse Mercure re-synchroniser plus tard
    });
  };

  return {
    board,
    setBoard,
    selectedSquare,
    setSelectedSquare,
    draggedPiece,
    setDraggedPiece,
    handleChangeBoard,
  };
}