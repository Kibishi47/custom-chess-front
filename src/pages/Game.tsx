import ChessBoard from "../components/ChessBoard";


export default function Game() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Partie d'Échecs</h1>
          <p className="text-muted-foreground">Sélectionnez une pièce pour voir les mouvements possibles</p>
        </div>
        <ChessBoard />
      </div>
    </div>
  )
}
