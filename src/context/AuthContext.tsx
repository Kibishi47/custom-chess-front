import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

export interface User {
  id: number;
  email: string;
  username: string;
  token: string;
}

interface AuthErrors {
  username?: string;
  password?: string;
  email?: string;
  global?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<AuthErrors | null>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<AuthErrors | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Restaure la session au chargement
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed: User = JSON.parse(stored);

      // Vérifie que le token est encore valide via /me
      fetch(`${import.meta.env.VITE_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${parsed.token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.username) {
            setUser({ ...data, token: parsed.token });
          } else {
            localStorage.removeItem("user");
          }
        })
        .catch(() => {
          localStorage.removeItem("user");
        })
        .finally(() => setLoading(false));
    } catch {
      localStorage.removeItem("user");
      setLoading(false);
    }
  }, []);

  // 🔐 LOGIN : username → token → /me
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 401) {
        const err = await response.json();
        return { global: err.message || "Identifiants invalides." };
      }

      if (response.status === 422) {
        const err = await response.json();
        const fieldErrors: AuthErrors = {};
        for (const key of Object.keys(err.errors)) {
          const first = err.errors[key][0]?.message;
          if (first) fieldErrors[key as keyof AuthErrors] = first;
        }
        return fieldErrors;
      }

      if (!response.ok) {
        return { global: "Une erreur est survenue lors de la connexion." };
      }

      const { token } = await response.json();

      const meResponse = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!meResponse.ok)
        return { global: "Impossible de récupérer les données utilisateur." };

      const meUser = await meResponse.json();

      const fullUser: User = { ...meUser, token };
      setUser(fullUser);
      localStorage.setItem("user", JSON.stringify(fullUser));

      return null;
    } catch (error) {
      console.error("Login error:", error);
      return { global: "Erreur réseau ou serveur injoignable." };
    }
  };

  // 🧾 REGISTER : token + user déjà renvoyés
  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.status === 422) {
        const err = await response.json();
        const fieldErrors: AuthErrors = {};
        for (const key of Object.keys(err.errors)) {
          const first = err.errors[key][0]?.message;
          if (first) fieldErrors[key as keyof AuthErrors] = first;
        }
        return fieldErrors;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        return { global: err?.message || "Échec de l’inscription." };
      }

      const data = await response.json();
      const fullUser: User = { ...data.user, token: data.token };
      setUser(fullUser);
      localStorage.setItem("user", JSON.stringify(fullUser));

      return null;
    } catch (error) {
      console.error("Register error:", error);
      return { global: "Erreur réseau ou serveur injoignable." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) return null; // ⏳ Optionnel : éviter un flash de déconnexion

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
