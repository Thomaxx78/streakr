# 🔥 STREAKR — Track your habits. Level up your life.

Tracker d'habitudes gamifié en style **neo-brutalism**. Crée tes habitudes, coche-les chaque jour, accumule des streaks, monte en niveau et débloque des titres absurdes.

## 🚀 Production

> **[streakr.vercel.app](https://streakr-chi.vercel.app/)** 
---

## 🛠 Stack technique & justifications

| Outil | Rôle | Justification |
|---|---|---|
| **Vite + React** | Bundler / UI | HMR instantané, pas besoin de SSR ni de SEO critique → Next.js non justifié |
| **TypeScript strict** | Typage | `strict: true`, zéro `any`, types inférés depuis Zod |
| **Feature Sliced Design** | Architecture | Hiérarchie unidirectionnelle des imports, scalable, évite les dépendances circulaires |
| **Zustand** | State management | Zéro boilerplate, sélecteurs stricts, middleware `persist` natif pour les préférences |
| **TanStack Query v5** | Data fetching | Cache intelligent, `useSuspenseQuery`, mutations avec invalidation — remplace 100% des `useEffect` de fetch |
| **Zod** | Validation runtime | Source de vérité unique : valide les réponses API ET infère les types TypeScript (`z.infer`) |
| **React Hook Form** | Formulaires | Pas de re-render à chaque frappe, intégration native `zodResolver` |
| **Supabase** | Backend | Auth, PostgreSQL, RLS par ligne, triggers SQL — tout-en-un, gratuit |
| **Recharts** | Graphiques | Librairie React native, typée, personnalisable |
| **Vitest + RTL** | Tests | Compatible Vite nativement, API Jest-compatible, teste le comportement utilisateur |

---

## 📁 Architecture FSD

```
src/
├── app/                        # Bootstrap : providers, router, styles globaux
│   ├── providers/              # QueryProvider (React Query)
│   ├── router/                 # AppRouter, AppLayout, ProtectedRoute, GuestRoute
│   └── styles/                 # globals.css (variables CSS, tokens de design)
│
├── pages/                      # Une page = assemblage de widgets pour une route
│   ├── dashboard/              # Vue d'ensemble : stats, habitudes du jour
│   ├── habits/                 # CRUD habitudes + filtres URL + archives + drag & drop
│   ├── stats/                  # Heatmap, graphiques, breakdown par catégorie
│   ├── profile/                # Infos utilisateur, gamification, préférences
│   ├── focus/                  # Mode focus : habitudes en attente une par une
│   ├── landing/                # Page publique marketing
│   ├── login/                  # Page de connexion (guest only)
│   └── register/               # Page d'inscription (guest only)
│
├── widgets/                    # Blocs UI réutilisables, composés de features/entities
│   ├── header/                 # Barre de navigation top
│   ├── sidebar/                # Menu latéral mobile
│   ├── daily-habits/           # Liste des habitudes du jour avec barre de progression
│   └── stats/                  # HeatmapCalendar, StreakChart, CategoryBreakdown, StatsOverview
│
├── features/                   # Actions utilisateur avec effets de bord (mutations)
│   ├── auth/                   # Login, register, logout + store Zustand + sélecteurs dérivés
│   ├── check-in/               # Toggle check-in quotidien/hebdo + toast feedback
│   ├── create-habit/           # Modal formulaire de création (RHF + Zod)
│   ├── edit-habit/             # Modal formulaire d'édition + archivage + suppression + restauration
│   ├── reorder-habits/         # Drag & drop réordonnancement (dnd-kit)
│   ├── habit-stats/            # Modal statistiques par habitude (streak, taux, check-ins)
│   └── gamification/           # Fonctions pures : calculateLevel, calculateTitle, calculateStreak
│
├── entities/                   # Modèles métier : schémas Zod, API Supabase, hooks React Query
│   ├── habit/                  # HabitSchema, HabitCard, habitApi, useHabits (useSuspenseQuery)
│   ├── check-in/               # CheckInSchema, checkInApi, useCheckInHistory
│   └── user/                   # UserProfileSchema, userApi, useUserProfile, useUpdateProfile
│
└── shared/                     # Utilitaires et composants sans logique métier
    ├── config/                 # Client Supabase singleton
    ├── lib/                    # useUIStore (persist: accentColor), useToastStore, cn()
    └── ui/                     # Button, Input, Card, Badge, ToastContainer
```

### Règles FSD appliquées

- **Imports unidirectionnels** : `pages → widgets → features → entities → shared` uniquement
- **API publique** : chaque slice expose son contenu via un `index.ts`, jamais d'import vers un fichier interne d'un autre slice
- **Segments standardisés** : `ui/` (composants), `model/` (stores/schémas), `api/` (requêtes + hooks)

---

## ⚡ Installation locale

### Prérequis

- **Node.js 18+**
- **Un projet Supabase** — créé gratuitement sur [supabase.com](https://supabase.com) (le projet en production utilise déjà une base configurée)

### 1. Cloner le projet

```bash
git clone https://github.com/Thomaxx78/streakr.git
cd streakr
npm install
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://<votre-projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-anon-key>
```

Les clés se trouvent dans votre projet Supabase → **Settings → API**.

### 3. Initialiser la base de données

Les migrations sont dans `supabase/migrations/` :

- `001_initial_schema.sql` — tables, RLS, triggers
- `002_frequency_position.sql` — colonnes `frequency_type`, `frequency_count`, `position`

**Option A — Supabase CLI (recommandé)**

```bash
# Installer le CLI
brew install supabase/tap/supabase

# Se connecter et lier au projet
supabase login
supabase link --project-ref <votre-project-ref>

# Appliquer toutes les migrations
supabase db push
```

**Option B — SQL Editor (manuel)**

1. Ouvrir [supabase.com](https://supabase.com) → votre projet → **SQL Editor**
2. Exécuter `001_initial_schema.sql` puis `002_frequency_position.sql` dans l'ordre
3. Cliquer sur **Run** pour chacun

`001` crée :
- Les tables `habits`, `check_ins`, `user_profiles`
- Les politiques **Row Level Security** (chaque utilisateur ne voit que ses données)
- Les triggers SQL (création de profil à l'inscription, mise à jour automatique de l'XP)

`002` ajoute sur `habits` :
- `frequency_type` (`daily` / `weekly`)
- `frequency_count` (1–7 fois par semaine)
- `position` (ordre d'affichage pour le drag & drop)

### 4. Lancer le projet

```bash
npm run dev
# → http://localhost:5173
```

### 5. Lancer les tests

```bash
npm run test:run
```

---

## 🧪 Tests

```
src/
├── entities/habit/model/habitSchema.test.ts      # Tests schéma Zod (parse, validation)
├── features/auth/model/authSchemas.test.ts       # Tests schéma Zod RegisterSchema
├── features/gamification/model/gamification.test.ts  # Tests fonctions pures (calculateLevel, calculateTitle)
├── shared/lib/useUIStore.test.ts                 # Tests store Zustand (toggleSidebar, setAccentColor)
├── shared/ui/Button.test.tsx                     # Tests composant + interaction (click, loading)
├── shared/ui/Badge.test.tsx                      # Tests rendu composant
└── entities/habit/ui/HabitCard.test.tsx          # Tests composant + slot actions
```

---
