import { getTaskRepo } from "../repos/taskRepo.js";

function bad(res, msg, code = 400) {
  return res.status(code).json({ error: msg });
}

export async function listTasks(_req, res, next) {
  try {
    const repo = getTaskRepo();
    const tasks = await repo.list();
    res.json(tasks);
  } catch (e) {
    next(e);
  }
}

export async function addTask(req, res, next) {
  try {
    const { title, description = "" } = req.body || {};
    if (!title || !title.trim()) return bad(res, "Le champ 'title' est requis.", 400);
    const repo = getTaskRepo();
    const task = await repo.add({ title: title.trim(), description });
    res.status(201).json({ message: "Tâche ajoutée !", task });
  } catch (e) {
    next(e);
  }
}

export async function removeTask(req, res, next) {
  try {
    const { id } = req.params;
    const repo = getTaskRepo();
    const removed = await repo.remove(id);
    if (!removed) return bad(res, "Tâche introuvable.", 404);
    res.json({ message: "Tâche supprimée !", removed });
  } catch (e) {
    next(e);
  }
}
