import { getPg, initPg } from "../config/pg.js";

function toPublic(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    createdAt: row.created_at?.toISOString?.() ?? row.created_at,
    updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
  };
}

export default {
  async init() {
    await initPg();
  },
  async list() {
    const { rows } = await getPg().query(
      `SELECT id, title, description, created_at, updated_at
       FROM tasks
       ORDER BY created_at DESC`
    );
    return rows.map(toPublic);
  },
  async add({ title, description = "" }) {
    const { rows } = await getPg().query(
      `INSERT INTO tasks (title, description)
       VALUES ($1, $2)
       RETURNING id, title, description, created_at, updated_at`,
      [title, description]
    );
    return toPublic(rows[0]);
  },
  async remove(id) {
    const { rows } = await getPg().query(
      `DELETE FROM tasks
       WHERE id = $1
       RETURNING id, title, description, created_at, updated_at`,
      [id]
    );
    return rows[0] ? toPublic(rows[0]) : null;
  },
};
