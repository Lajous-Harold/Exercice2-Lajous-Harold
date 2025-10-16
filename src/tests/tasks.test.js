import { test, describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

let api;

beforeEach(() => {
  api = request(app);
});

describe("Tasks API", () => {
  it("GET /api/v1/tasks -> returns array", async () => {
    const res = await api.get("/api/v1/tasks");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it("POST /api/v1/tasks -> creates a task", async () => {
    const res = await api
      .post("/api/v1/tasks")
      .send({ title: "Réviser tests", description: "node:test + supertest" })
      .set("Content-Type", "application/json");

    assert.equal(res.status, 201);
    assert.equal(res.body.message, "Tâche ajoutée !");
    assert.ok(res.body.task?.id);
    assert.equal(res.body.task.title, "Réviser tests");
  });

  it("DELETE /api/v1/tasks/:id -> deletes created task", async () => {
    const create = await api
      .post("/api/v1/tasks")
      .send({ title: "À supprimer" })
      .set("Content-Type", "application/json");
    const id = create.body.task.id;

    const del = await api.delete(`/api/v1/tasks/${id}`);
    assert.equal(del.status, 200);
    assert.equal(del.body.message, "Tâche supprimée !");
    assert.equal(del.body.removed.id, id);
  });
});
