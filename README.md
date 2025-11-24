# ♟️ Jeu d'Échecs Multijoueur – Frontend React

Ce projet est l’interface front-end d’un **jeu d’échecs multijoueur en temps réel**, basé sur :

- Une **API Symfony** pour la logique du jeu  
- **Mercure** pour la synchronisation instantanée entre joueurs  
- Un frontend moderne en **React + TypeScript**

Backend disponible ici :  
👉 https://github.com/Kibishi47/custom-chess

---

# 🚀 Installation

## 1. Installer les dépendances

```bash
npm install
```

## 2. Configurer les variables d’environnement

Copier le fichier exemple :

```bash
cp .env.example .env
```

Puis éditer `.env` et remplir :

```
VITE_API_URL=...
VITE_MERCURE_URL=...
```

## 3. Lancer le projet

```bash
npm run dev
```

Le site démarre sur :

```
http://localhost:5173
```

---

# 🖥️ Fonctionnement du site

### 🔐 Authentification
- Inscription (`/register`)
- Connexion (`/login`)
- Page profil utilisateur (`/account`)

### ♟️ Jeu d’échecs
- Sélection du type de plateau (`/game/select`)
- Recherche automatique de partie (`POST /api/game/join`)
- Affichage interactif du plateau
- Détection et highlight du roi en échec
- Mise à jour en temps réel via **Mercure**
- Détection automatique :
  - Victoire
  - Défaite
  - Pat
- Modal de fin de partie + résumé sous le plateau

---

# 🔌 API Symfony & Mercure

### Endpoints utilisés

```
POST /api/game/join         → rejoindre une partie
POST /api/{gameId}/moves    → jouer un coup
POST /api/game/quit         → quitter une partie
GET  /api/game/types        → liste des plateaux disponibles
```

### Flux Mercure

Un flux Mercure est ouvert pour chaque partie :

```
/game/{id}
```

Le front reçoit en direct :
- l’état du plateau
- le joueur dont c’est le tour
- les coups légaux
- les mises en échec
- les fins de partie

---

# 📄 Notes

Ce dépôt ne contient **que le front-end**.  
Le backend Symfony + Mercure doit être installé séparément (voir lien en haut du document).
