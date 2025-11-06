# Exercice 2 — API ToDoList (Express, MVC)

API **ToDoList** en **Node.js/Express**, architecture **MVC**, ESM (`"type": "module"`).

- **Stockage** (sélectionnable) :
  - `DB_CLIENT=mongo` → MongoDB (Mongoose)
  - `DB_CLIENT=postgres` → PostgreSQL (pg)
  - `DB_CLIENT=memory` → mémoire (sans persistance)
  - `USE_MEMORY=true` > prioritaire sur `DB_CLIENT`

- **Endpoints** : `GET /api/v1/tasks`, `POST /api/v1/tasks`, `DELETE /api/v1/tasks/:id` (pas d’endpoint de "completion").

---

## ⚙️ Installation & Démarrage (hors Docker)

1. **Cloner** le projet

   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Installer**

   ```sh
   npm install
   ```

3. **Variables d’environnement**

   ```sh
   cp .env.example .env
   # Édite .env selon le backend voulu (voir ci-dessous)
   ```

4. **Lancer**
   - Dev :

     ```sh
     npm run dev
     ```

   - Prod :

     ```sh
     npm start
     ```

Par défaut, l’API écoute sur **[http://localhost:3000](http://localhost:3000)**.

---

## 🧱 Architecture (MVC)

```
.
├─ package.json
├─ README.md
├─ .gitignore
├─ .env(.example)
├─ docker-compose.yml
└─ src/
   ├─ app.js                # point d'entrée Express
   ├─ models/
   │  └─ taskModel.js       # Modèle Mongoose (Task)
   ├─ controllers/
   │  └─ taskController.js  # Logique métier via repo (mongo/postgres/memory)
   ├─ repos/
   │  ├─ taskRepo.js        # Sélection du backend selon .env
   │  ├─ mongoRepo.js       # Implémentation Mongo
   │  ├─ postgresRepo.js    # Implémentation Postgres
   │  └─ memoryRepo.js      # Implémentation mémoire
   ├─ config/
   │  ├─ db.js              # Connexion Mongo
   │  └─ pg.js              # Connexion/Init Postgres
   ├─ routes/
   │  └─ taskRoutes.js      # Routes REST /api/v1/tasks
   └─ tests/
      └─ tasks.test.js      # Tests (node:test + supertest)
```

---

## 🔌 Endpoints

Base: `http://localhost:3000/api/v1/tasks`

| Méthode | Route  | Description                   | Body JSON (exemple)                                   |
| ------: | ------ | ----------------------------- | ----------------------------------------------------- |
|     GET | `/`    | Lister toutes les tâches      | —                                                     |
|    POST | `/`    | Ajouter une tâche             | `{ "title": "Acheter du lait", "description": "2L" }` |
|  DELETE | `/:id` | Supprimer la tâche par **id** | —                                                     |

> `:id` est un identifiant unique (UUID en mémoire / `id` Postgres / `_id` Mongo).

---

## 🧪 Tests

Runner natif **Node** (`node --test`) + **supertest**. Sous Windows, variables d’env via **cross-env**.

```jsonc
// package.json (extrait)
{
  "type": "module",
  "scripts": {
    "dev": "cross-env NODE_ENV=development nodemon src/app.js",
    "start": "cross-env NODE_ENV=production node src/app.js",
    "test": "cross-env NODE_ENV=test node --test",
  },
}
```

Lancer :

```sh
npm test
```

En test, le backend **mémoire** est utilisé automatiquement (rapide, sans DB).

---

## 🐳 Docker avec **profils** (API + Mongo + Postgres)

Le `docker-compose.yml` permet de lancer l’API avec **Mongo** ou **Postgres** au choix via des **profils**.

### Variables `.env`

```env
# --- Choix du backend ---
# mongo | postgres | memory
DB_CLIENT=mongo
USE_MEMORY=false

# --- API ---
PORT=3000
NODE_ENV=production

# --- Mongo ---
MONGODB_URI=mongodb://mongo:27017/todolist

# --- Postgres ---
POSTGRES_URL=postgresql://app:app@postgres:5432/todolist
POSTGRES_USER=app
POSTGRES_PASSWORD=app
POSTGRES_DB=todolist
```

### Lancer

- **API + Mongo**

  ```sh
  docker compose --profile mongo up --build
  ```

- **API + Postgres**

  ```sh
  docker compose --profile postgres up --build
  ```

- **API en mémoire (aucune DB)**

  ```sh
  # Pas de profil DB + forcer mémoire
  USE_MEMORY=true docker compose up --build
  ```

> L’API lit `DB_CLIENT` (`mongo`/`postgres`/`memory`) et utilise l’URI correspondant.
> `USE_MEMORY=true` est prioritaire sur `DB_CLIENT`.

### Tester une fois lancé

```sh
# Healthcheck
curl http://localhost:${PORT:-3000}/health

# Lister
curl http://localhost:${PORT:-3000}/api/v1/tasks

# Ajouter
curl -X POST http://localhost:${PORT:-3000}/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello Docker","description":"mongo/postgres/memory"}'

# Supprimer (remplacer <ID>)
curl -X DELETE http://localhost:${PORT:-3000}/api/v1/tasks/<ID>
```

---

## 🛠️ Scripts NPM

- `npm run dev` — dev + nodemon
- `npm start` — prod
- `npm test` — tests (mémoire, sans DB)

---

## 📝 Notes

- **Profils Docker** : `mongo` et `postgres` démarrent leurs services respectifs ; l’API démarre toujours.
- **Postgres** : la table `tasks` et l’extension `uuid-ossp` sont créées automatiquement au démarrage.
- **Mongo** : nécessite uniquement `MONGODB_URI` valide si `DB_CLIENT=mongo`.
- Pas d’endpoint de **completion** dans ce projet.
