# Exercice 2 — API ToDoList (Express, MVC)

API **ToDoList** en **Node.js/Express**, architecture **MVC**, ESM (`"type": "module"`).

- **Stockage** :
  - **Dev/Prod** : support MongoDB (via `MONGODB_URI`).
  - **Test** : fallback **mémoire** automatique (`NODE_ENV=test`) — pas besoin de DB.

- **Endpoints** : `GET /api/v1/tasks`, `POST /api/v1/tasks`, `DELETE /api/v1/tasks/:id`.

---

## ⚙️ Installation & Démarrage (sans Docker)

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
   # .env
   # PORT=3000
   # MONGODB_URI=mongodb://localhost:27017/todolist
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
└─ src/
   ├─ app.js                # point d'entrée Express
   ├─ models/
   │  └─ taskModel.js       # Modèle Mongoose (Task)
   ├─ controllers/
   │  └─ taskController.js  # Logique métier (Mongo en dev/prod, mémoire en test)
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

> `:id` est un identifiant unique (UUID en mémoire, `_id` Mongo en DB).

---

## 🧪 Tests

Le projet utilise le **runner natif** de Node (`node --test`) + **supertest**. Sous Windows, les variables d’env sont gérées avec **cross-env**.

```jsonc
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

### Docker

`docker-compose.yml` :

```yaml
services:
  api:
    build: .
    container_name: todolist-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      MONGODB_URI: mongodb://mongo:27017/todolist
      USE_MEMORY: "false"
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    container_name: todolist-mongo
    restart: unless-stopped
    volumes:
      - mongo_data:/data/db
    # ports: ["27017:27017"] # optionnel

volumes:
  mongo_data:
```

Lancer :

```sh
docker compose up --build
```

### Tester une fois Docker lancé

```sh
# Healthcheck
curl http://localhost:3000/health

# Lister
curl http://localhost:3000/api/v1/tasks

# Ajouter
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Réviser Express","description":"routes + tests"}'

# Supprimer (remplacer <ID> par l'id retourné à la création)
curl -X DELETE http://localhost:3000/api/v1/tasks/<ID>
```

---

## 🛠️ Scripts NPM

- `npm run dev` — dev + nodemon
- `npm start` — prod
- `npm test` — tests (mémoire, sans DB)

---

## 📝 Notes

- En **test**, le contrôleur utilise un **stockage en mémoire** (pas de connexion Mongo), ce qui rend la suite de tests rapide et indépendante.
- En **dev/prod**, configure `MONGODB_URI` (local ou Docker) pour activer la persistance Mongo.
- Pas d’endpoint de **completion** dans ce projet.
