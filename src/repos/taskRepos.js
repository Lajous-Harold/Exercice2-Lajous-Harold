import memoryRepo from "./memoryRepo.js";
import mongoRepo from "./mongoRepo.js";
import postgresRepo from "./postgresRepo.js";

let _repo = null;

function resolveChoice() {
  const forceMemory = String(process.env.USE_MEMORY).toLowerCase() === "true";
  if (forceMemory) return "memory";
  const client = (process.env.DB_CLIENT || "").toLowerCase();
  if (["mongo", "postgres", "memory"].includes(client)) return client;
  return "memory"; // défaut safe
}

export function getTaskRepo() {
  if (_repo) return _repo;
  const choice = resolveChoice();
  switch (choice) {
    case "mongo":
      _repo = mongoRepo;
      break;
    case "postgres":
      _repo = postgresRepo;
      break;
    case "memory":
    default:
      _repo = memoryRepo;
  }
  return _repo;
}

export async function initTaskRepo() {
  const repo = getTaskRepo();
  if (typeof repo.init === "function") {
    await repo.init();
  }
  return repo;
}
