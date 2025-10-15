const Task = require("../models/taskModel");

const _tasks = [];

/**
 * Liste toutes les tâches (array de Task)
 */
function listTasks(_req, res) {
  return res.json(_tasks);
}

/**
 * Ajoute une tâche
 * Body JSON attendu: { "title": "...", "description": "..." }
 */
function addTask(req, res) {
  const { title, description = "" } = req.body || {};
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Le champ 'title' est requis." });
  }
  const task = new Task(title.trim(), String(description || ""));
  _tasks.push(task);
  return res.status(201).json({ message: "Tâche ajoutée !", task });
}

/**
 * Supprime une tâche par index (1-based dans l’URL)
 * Param: :idx
 */
function removeTask(req, res) {
  const idx1 = Number(req.params.idx);
  if (!Number.isInteger(idx1) || idx1 < 1 || idx1 > _tasks.length) {
    return res.status(400).json({ error: "Index de tâche invalide." });
  }
  const removed = _tasks.splice(idx1 - 1, 1)[0];
  return res.json({ message: "Tâche supprimée !", removed });
}

module.exports = {
  listTasks,
  addTask,
  removeTask,
};
