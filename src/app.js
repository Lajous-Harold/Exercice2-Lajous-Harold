import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import tasksRouter from "./routes/taskRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api/v1/tasks", tasksRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur" });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  connectDB(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`http://localhost:${PORT}`)))
    .catch((e) => {
      console.error("Échec connexion MongoDB:", e);
      process.exit(1);
    });
}

export default app;
