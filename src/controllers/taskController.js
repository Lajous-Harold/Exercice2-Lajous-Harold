import { Task as MongoTask } from "../models/taskModel.js";

// Fallback mémoire pour les tests (évite d'avoir une DB en mode test)
const useMemory = process.env.NODE_ENV === "test" || process.env.USE_MEMORY === "true";
const mem = { tasks: [] };

function toPublic(t) {
  // Normalise l'objet retourné (Mongo ou mémoire)
  return {
    id: t.id ?? t._id?.toString(),
    title: t.title,
    description: t.description ?? "",
    createdAt: t.createdAt ?? new Date().toISOString(),
  };
}

export async function listTasks(_req, res, next) {
  try {
    if (useMemory) {
      const out = mem.tasks.map(toPublic);
      return res.json(out);
    }
    const tasks = await MongoTask.find().sort({ createdAt: -1 });
    return res.json(tasks.map(toPublic));
  } catch (err) {
    next(err);
  }
}

export async function addTask(req, res, next) {
  try {
    const { title, description = "" } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Le champ 'title' est requis." });
    }

    if (useMemory) {
      const task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: String(description),
        createdAt: new Date().toISOString(),
      };
      mem.tasks.unshift(task);
      return res.status(201).json({ message: "Tâche ajoutée !", task: toPublic(task) });
    }

    const created = await MongoTask.create({ title: title.trim(), description });
    return res.status(201).json({ message: "Tâche ajoutée !", task: toPublic(created) });
  } catch (err) {
    next(err);
  }
}

export async function removeTask(req, res, next) {
  try {
    const { id } = req.params;

    if (useMemory) {
      const idx = mem.tasks.findIndex((t) => t.id === id);
      if (idx === -1) return res.status(404).json({ error: "Tâche introuvable." });
      const removed = mem.tasks.splice(idx, 1)[0];
      return res.json({ message: "Tâche supprimée !", removed: toPublic(removed) });
    }

    const removed = await MongoTask.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: "Tâche introuvable." });
    return res.json({ message: "Tâche supprimée !", removed: toPublic(removed) });
  } catch (err) {
    next(err);
  }
}
