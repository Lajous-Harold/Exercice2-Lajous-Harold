// src/repos/taskRepo.js
import memoryRepo from "./memoryRepo.js";
import mongoRepo from "./mongoRepo.js";
import postgresRepo from "./postgresRepo.js";

let _repo = null;

function resolveChoice() {
  if (process.env.NODE_ENV === "test") return "memory";

  const cli = (process.env.DB_CLIENT || "").toLowerCase();
  if (!cli) return "mongo";

  if (["mongo", "postgres", "memory"].includes(cli)) return cli;
  console.warn(`DB_CLIENT="${cli}" inconnu → fallback 'mongo'.`);
  return "mongo";
}

export function getTaskRepo() {
  if (_repo) return _repo;
  const choice = resolveChoice();
  _repo = choice === "postgres" ? postgresRepo : choice === "memory" ? memoryRepo : mongoRepo;
  return _repo;
}

export async function initTaskRepo() {
  const repo = getTaskRepo();
  if (typeof repo.init === "function") await repo.init();
  return repo;
}
