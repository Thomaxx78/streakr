# 🔥 STREAKR — Track your habits. Get weird titles.

## Description

Tracker d'habitudes gamifié avec un style neo-brutalism. Crée tes habitudes, coche-les chaque jour, accumule des streaks, monte en niveau et débloque des titres absurdes.

## 🚀 Démo

[Lien Vercel à ajouter]

## 🛠 Stack technique

| Outil | Rôle | Justification |
|---|---|---|
| **Vite** | Bundler | Plus rapide que CRA/Webpack, HMR instantané. Pas besoin de SSR ni SEO critique → pas de Next.js. |
| **React 18+** | UI Library | Approche déclarative, écosystème mature |
| **TypeScript strict** | Typage | Mode strict, zéro any, sécurité maximale |
| **Feature Sliced Design** | Architecture | Hiérarchie claire des dépendances, scalable, évite les imports circulaires |
| **Zustand** | State management | Zéro boilerplate, sélecteurs performants, middleware persist natif |
| **TanStack Query** | Data fetching | Cache intelligent, background refetch, mutations, remplace les useEffect |
| **Zod** | Validation runtime | Single source of truth pour les types, valide API + formulaires |
| **React Hook Form** | Formulaires | Performant (pas de re-render), intégration native avec Zod via zodResolver |
| **Supabase** | Backend | Auth, base PostgreSQL, RLS, temps réel — tout-en-un, rapide à setup |
| **Recharts** | Graphiques | Bibliothèque React native, typée, personnalisable |
| **Vitest** | Testing | Compatible Vite nativement, API Jest-compatible |
| **React Testing Library** | Tests composants | Teste le comportement utilisateur, pas l'implémentation |

## 📁 Architecture FSD

```
src/
├── app/                    # Configuration globale (router, providers, styles)
├── pages/                  # Assemblage des widgets par route
│   ├── dashboard/
│   ├── habits/
│   ├── stats/
│   ├── profile/
│   ├── landing/
│   ├── login/
│   └── register/
├── widgets/                # Blocs UI réutilisables composés de features/entities
│   ├── header/
│   ├── sidebar/
│   ├── daily-habits/
│   └── stats/              # HeatmapCalendar, StreakChart, CategoryBreakdown, StatsOverview
├── features/               # Actions utilisateur avec effets de bord
│   ├── auth/               # Login, register, logout
│   ├── check-in/           # Toggle check-in quotidien
│   ├── create-habit/       # Formulaire de création
│   ├── edit-habit/         # Formulaire d'édition
│   └── gamification/       # Calculs XP, niveau, streak
├── entities/               # Modèles métier (schémas Zod, API, UI)
│   ├── habit/              # HabitSchema, HabitCard, habitApi, useHabits
│   ├── check-in/           # CheckInSchema, checkInApi, useCheckInHistory
│   └── user/               # UserProfileSchema, userApi, useUserProfile
└── shared/                 # Utilitaires, composants UI génériques, config
    ├── config/             # Client Supabase
    ├── lib/                # useUIStore (Zustand persist), cn()
    └── ui/                 # Button, Input, Card, Badge
```

### Règles FSD respectées

- Imports unidirectionnels (haut vers bas uniquement)
- Chaque slice a un `index.ts` (API publique)
- Segments standardisés : `ui/`, `model/`, `api/`

## ⚡ Installation

### Prérequis

- Node.js 18+
- Un projet Supabase (gratuit sur supabase.com)

### 1. Cloner le projet

```bash
git clone <url>
cd streakr
npm install
```

### 2. Configurer Supabase

Créez un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

### 3. Créer les tables

Allez dans le SQL Editor de votre projet Supabase et exécutez le contenu de `supabase/migrations/001_initial_schema.sql`.

### 4. Lancer le projet

```bash
npm run dev
```

### 5. Lancer les tests

```bash
npx vitest run
```

## 👥 Équipe

[Noms des membres du groupe]
