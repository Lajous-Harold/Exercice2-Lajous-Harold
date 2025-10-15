# Exercice 2 — API ToDoList (Express, MVC, mémoire)

API **ToDoList** en **Node.js/Express**, architecture **MVC**, stockage **en mémoire** (pas de base de données, pas de fichiers JSON).

> À chaque redémarrage du serveur, la liste repart à zéro.

---

## ⚙️ Installation & Configuration

1. **Cloner** le projet

   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Installer** les dépendances

   ```sh
   npm install
   ```

3. **Lancer**

   - Développement (rechargement auto) :

     ```sh
     npm run dev
     ```

   - Production :

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
└─ src/
   ├─ app.js                # point d'entrée Express
   ├─ models/
   │  └─ task.js            # Modèle Task (classe)
   ├─ controllers/
   │  └─ taskController.js  # Logique métier
   └─ routes/
      └─ tasks.js           # Routes REST /api/v1/tasks
```

---

## 🔌 Endpoints

Base: `http://localhost:3000/api/v1/tasks`

| Méthode | Route            | Description                                | Body JSON (exemple)                                   |
| ------: | ---------------- | ------------------------------------------ | ----------------------------------------------------- |
|     GET | `/`              | Lister toutes les tâches                   | —                                                     |
|    POST | `/`              | Ajouter une tâche                          | `{ "title": "Acheter du lait", "description": "2L" }` |
|  DELETE | `/:idx`          | Supprimer la tâche (index **1-based**)     | —                                                     |
|     PUT | `/:idx/complete` | Marquer la tâche comme complétée (1-based) | —                                                     |

---

## 🧪 Exemples (cURL)

Lister :

```sh
curl http://localhost:3000/api/v1/tasks
```

Ajouter :

```sh
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Réviser Express","description":"MVC et routes"}'
```

Supprimer (1ʳᵉ tâche) :

```sh
curl -X DELETE http://localhost:3000/api/v1/tasks/1
```

---

## 📝 Notes

- **Stockage en mémoire** : aucune persistance disque.
- Pour une persistance (fichier JSON, SQLite, etc.), remplacez la logique du contrôleur par un service de stockage, en conservant les mêmes routes.

---

## 🛠️ Scripts NPM

- `npm run dev` — démarre avec **nodemon**
- `npm start` — démarre avec **node**

---

## 🧩 Dépendances principales

- `express` – serveur HTTP
- `morgan` – logs HTTP en dev
- `cors` – autorisations CORS
- `nodemon` – rechargement auto en dev (devDependency)
