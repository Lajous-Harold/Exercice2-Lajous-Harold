import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tasksRouter from "./routes/taskRoutes.js";
import authRouter from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/jwt.js";
import { initTaskRepo } from "./repos/taskRepo.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res, next) => {
  res.format({
    html: () => res.redirect(302, "/demo.html"),
    default: () => res.status(404).json({ error: "Not found" }),
  });
});

app.use("/auth", authRouter);
app.use("/api/v1/tasks", requireAuth, tasksRouter);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;

  (async () => {
    try {
      await initTaskRepo();

      const selected =
        String(process.env.USE_MEMORY).toLowerCase() === "true"
          ? "memory (forced)"
          : (process.env.DB_CLIENT || "mongo") + " (default if empty)";

      console.log(`Storage selected: ${selected}`);
      console.log(
        `URIs → MONGO: ${process.env.MONGODB_URI || "(none)"} | POSTGRES: ${
          process.env.POSTGRES_URL || "(none)"
        }`
      );

      app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
    } catch (e) {
      console.error("Échec démarrage:", e);
      process.exit(1);
    }
  })();
}
