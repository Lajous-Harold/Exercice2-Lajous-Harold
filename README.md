# Exercice 2 — API ToDoList (Express, MVC)

API **ToDoList** en **Node.js/Express**, architecture **MVC**, ESM (`"type": "module"`).

- **Backends de stockage** (au choix, via commande) : **Mongo**, **Postgres** ou **Mémoire**.
- **Sélection par commande uniquement** : pas de `DB_CLIENT` dans `.env`. Si rien n’est spécifié, **défaut = Mongo**.
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
   # Édite .env uniquement pour les URI (pas de DB_CLIENT ici)
   ```

4. **Lancer en dev** (hot-reload via nodemon)

   ```sh
   npm run dev:mongo     # Mongo
   npm run dev:postgres  # Postgres
   npm run dev:memory    # Mémoire (sans DB)
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
   ├─ controllers/
   │  └─ taskController.js  # Logique métier via repository (agnostique DB)
   ├─ repos/
   │  ├─ taskRepo.js        # Sélecteur: mongo | postgres | memory
   │  ├─ mongoRepo.js       # Implémentation Mongo
   │  ├─ postgresRepo.js    # Implémentation Postgres
   │  └─ memoryRepo.js      # Implémentation mémoire
   ├─ models/
   │  └─ mongo/
   │     └─ taskModel.js    # Modèle Mongoose (Mongo UNIQUEMENT)
   ├─ config/
   │  ├─ mongo.js           # Connexion Mongo
   │  └─ pg.js              # Pool/init Postgres
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

> `:id` = UUID (mémoire), `_id` (Mongo), `id` (Postgres).

---

## 🧪 Tests

- Runner natif **Node** (`node --test`) + **supertest**.
- En **test**, le backend **mémoire** est **forcé automatiquement** (`NODE_ENV=test`).

```jsonc
// package.json (extrait)
{
  "type": "module",
  "scripts": {
    "dev:mongo": "cross-env DB_CLIENT=mongo NODE_ENV=development nodemon src/app.js",
    "dev:postgres": "cross-env DB_CLIENT=postgres NODE_ENV=development nodemon src/app.js",
    "dev:memory": "cross-env DB_CLIENT=memory NODE_ENV=development nodemon src/app.js",
    "start": "cross-env NODE_ENV=production node src/app.js",
    "test": "cross-env NODE_ENV=test node --test",
  },
}
```

Lancer :

```sh
npm test
```

---

## 🐳 Docker avec **profils** (API + Mongo + Postgres)

Le `docker-compose.yml` définit 3 services : `api`, `mongo` (profil `mongo`) et `postgres` (profil `postgres`).

### Variables `.env.example`

```env
# API
PORT=3000

# Mongo (utilisé si DB sélectionnée = mongo)
MONGODB_URI=mongodb://mongo:27017/todolist

# Postgres (utilisé si DB sélectionnée = postgres)
POSTGRES_URL=postgresql://app:app@postgres:5432/todolist
POSTGRES_USER=app
POSTGRES_PASSWORD=app
POSTGRES_DB=todolist
```

> Ne mets **pas** `DB_CLIENT` dans `.env`. Le choix se fait **à la commande**.

### Commandes Docker **simplifiées** (scripts NPM)

```jsonc
{
  "scripts": {
    "docker:mongo": "docker compose --profile mongo up --build",
    "docker:pg": "cross-env DB_CLIENT=postgres docker compose --profile postgres up --build",
    "docker:mem": "cross-env DB_CLIENT=memory docker compose up --build",
    "docker:down": "docker compose down -v",
  },
}
```

#### Utilisation

```sh
npm run docker:mongo   # API + Mongo (défaut mongo)
npm run docker:pg      # API + Postgres (DB_CLIENT injecté)
npm run docker:mem     # API en mémoire (sans DB)
npm run docker:down    # stop + prune volumes du projet
```

### Tester une fois lancé

```sh
# Healthcheck
curl http://localhost:${PORT:-3000}/health

# Lister
curl http://localhost:${PORT:-3000}/api/v1/tasks

# Ajouter
curl -X POST http://localhost:${PORT:-3000}/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","description":"from docker"}'

# Supprimer (remplacer <ID>)
curl -X DELETE http://localhost:${PORT:-3000}/api/v1/tasks/<ID>
```

---

## 🛠️ Notes & bonnes pratiques

- **Jamais `localhost` entre services Docker** → utilise `mongo` / `postgres` (noms de service).
- `docker compose config` montre la configuration effective (après interpolation des env).
- `.dockerignore` doit contenir `.env` pour éviter de baker des valeurs locales.
- Le contrôleur est **DB-agnostique** : seule la couche **repo** connaît Mongo/PG.
- Pas d’endpoint de **completion** dans ce projet.
