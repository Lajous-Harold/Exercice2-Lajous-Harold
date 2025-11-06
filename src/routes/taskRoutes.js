import { Router } from "express";
import { listTasks, addTask, removeTask } from "../controllers/taskController.js";

const router = Router();

// GET /api/v1/tasks  -> lists all tasks
router.get("/", listTasks);

// POST /api/v1/tasks -> adds a new task
router.post("/", addTask);

// DELETE /api/v1/tasks/:id -> deletes a task by uid
router.delete("/:id", removeTask);

export default router;
