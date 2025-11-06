const mem = { tasks: [] };

function toPublic(t) {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? "",
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export default {
  async init() {
    // rien à faire
  },
  async list() {
    return mem.tasks.map(toPublic);
  },
  async add({ title, description = "" }) {
    const task = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mem.tasks.unshift(task);
    return toPublic(task);
  },
  async remove(id) {
    const i = mem.tasks.findIndex((t) => t.id === id);
    if (i === -1) return null;
    const [removed] = mem.tasks.splice(i, 1);
    return toPublic(removed);
  },
};
