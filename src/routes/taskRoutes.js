import { Router } from "express";
import { listTasks, addTask, removeTask } from "../controllers/taskController.js";

const router = Router();

// GET /api/v1/tasks  -> afficher toutes les tâches
router.get("/", listTasks);

// POST /api/v1/tasks -> ajouter une tâche
router.post("/", addTask);

// DELETE /api/v1/tasks/:id -> supprimer (idx = 1-based)
router.delete("/:id", removeTask);

export default router;
