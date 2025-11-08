import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function Account() {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const user = authContext?.user

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Accès refusé</h1>
          <p className="text-muted-foreground mb-6">Vous devez d'abord vous connecter</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-primary-foreground font-medium py-2 px-6 rounded-md hover:bg-primary/90 transition-colors"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mon Compte</h1>
          <p className="text-muted-foreground mb-8">Bienvenue {user.username}</p>

          <div className="space-y-6 mb-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Nom d'utilisateur</p>
              <p className="text-lg text-foreground">{user.username}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
              <p className="text-lg text-foreground">{user.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">ID utilisateur</p>
              <p className="text-sm text-foreground font-mono">{user.id}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/game")}
              className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Jouer une partie
            </button>

            <button
              onClick={() => {
                authContext?.logout()
                navigate("/")
              }}
              className="w-full bg-secondary text-secondary-foreground font-medium py-2 rounded-md hover:bg-secondary/80 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
