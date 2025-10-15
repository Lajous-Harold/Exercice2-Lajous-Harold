const express = require("express");
const { listTasks, addTask, removeTask } = require("../controllers/taskController");

const router = express.Router();

// GET /api/v1/tasks  -> afficher toutes les tâches
router.get("/", listTasks);

// POST /api/v1/tasks -> ajouter une tâche
router.post("/", addTask);

// DELETE /api/v1/tasks/:idx -> supprimer (idx = 1-based)
router.delete("/:idx", removeTask);

module.exports = router;
